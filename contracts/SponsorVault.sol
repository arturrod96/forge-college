// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title SponsorVault
 * @dev Vault for managing sponsor funding and impact metrics
 * @notice Handles sponsor deposits, fund allocation, and impact tracking
 */
contract SponsorVault is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    bytes32 public constant SPONSOR_MANAGER_ROLE = keccak256("SPONSOR_MANAGER_ROLE");
    bytes32 public constant IMPACT_TRACKER_ROLE = keccak256("IMPACT_TRACKER_ROLE");

    IERC20 public immutable usdcToken;

    struct Sponsor {
        address sponsorAddress;
        string name;
        string description;
        uint256 totalDeposited;
        uint256 totalAllocated;
        uint256 totalDistributed;
        bool isActive;
        uint256 registrationDate;
        uint256 lastActivity;
    }

    struct Sponsorship {
        uint256 id;
        address sponsor;
        uint256 cohortId;
        uint256 studentId; // 0 for cohort-wide sponsorship
        uint256 amount;
        uint256 allocatedAmount;
        uint256 distributedAmount;
        uint256 startDate;
        uint256 endDate;
        bool isActive;
        string description;
    }

    struct ImpactMetrics {
        uint256 totalStudentsFunded;
        uint256 totalUSDDistributed;
        uint256 totalCohortsSupported;
        uint256 averageStudentFunding;
        uint256 lastUpdated;
    }

    // Mapping from sponsor address to sponsor information
    mapping(address => Sponsor) public sponsors;
    
    // Mapping from sponsorship ID to sponsorship details
    mapping(uint256 => Sponsorship) public sponsorships;
    
    // Mapping from cohort ID to array of sponsorship IDs
    mapping(uint256 => uint256[]) public cohortSponsorships;
    
    // Mapping from student ID to array of sponsorship IDs
    mapping(uint256 => uint256[]) public studentSponsorships;
    
    // Mapping from sponsor address to array of sponsorship IDs
    mapping(address => uint256[]) public sponsorSponsorships;

    // Global impact metrics
    ImpactMetrics public impactMetrics;
    
    // Total vault balance
    uint256 public totalVaultBalance;
    
    // Total allocated funds
    uint256 public totalAllocatedFunds;
    
    // Total distributed funds
    uint256 public totalDistributedFunds;

    // Sponsorship ID counter
    uint256 private _sponsorshipIds;

    // Events
    event SponsorRegistered(address indexed sponsor, string name, uint256 initialDeposit);
    event SponsorshipCreated(uint256 indexed sponsorshipId, address indexed sponsor, uint256 cohortId, uint256 studentId, uint256 amount);
    event FundsAllocated(uint256 indexed sponsorshipId, uint256 amount);
    event FundsDistributed(uint256 indexed sponsorshipId, uint256 amount, uint256 indexed studentId);
    event ImpactMetricsUpdated(uint256 totalStudents, uint256 totalUSD, uint256 totalCohorts);
    event SponsorDeactivated(address indexed sponsor);

    constructor(address _usdcToken) {
        require(_usdcToken != address(0), "Invalid USDC token address");
        usdcToken = IERC20(_usdcToken);
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(SPONSOR_MANAGER_ROLE, msg.sender);
        _grantRole(IMPACT_TRACKER_ROLE, msg.sender);
    }

    /**
     * @dev Register a new sponsor
     * @param sponsorAddress The sponsor's address
     * @param name The sponsor's name
     * @param description The sponsor's description
     * @param initialDeposit Initial deposit amount
     */
    function registerSponsor(
        address sponsorAddress,
        string memory name,
        string memory description,
        uint256 initialDeposit
    ) external onlyRole(SPONSOR_MANAGER_ROLE) {
        require(sponsorAddress != address(0), "Invalid sponsor address");
        require(bytes(name).length > 0, "Name cannot be empty");
        require(!sponsors[sponsorAddress].isActive, "Sponsor already registered");

        if (initialDeposit > 0) {
            require(usdcToken.balanceOf(msg.sender) >= initialDeposit, "Insufficient USDC balance");
            usdcToken.safeTransferFrom(msg.sender, address(this), initialDeposit);
            totalVaultBalance += initialDeposit;
        }

        sponsors[sponsorAddress] = Sponsor({
            sponsorAddress: sponsorAddress,
            name: name,
            description: description,
            totalDeposited: initialDeposit,
            totalAllocated: 0,
            totalDistributed: 0,
            isActive: true,
            registrationDate: block.timestamp,
            lastActivity: block.timestamp
        });

        emit SponsorRegistered(sponsorAddress, name, initialDeposit);
    }

    /**
     * @dev Create a new sponsorship
     * @param sponsor The sponsor address
     * @param cohortId The cohort ID (0 for general sponsorship)
     * @param studentId The student ID (0 for cohort-wide sponsorship)
     * @param amount The sponsorship amount
     * @param duration Duration in days
     * @param description Sponsorship description
     * @return sponsorshipId The created sponsorship ID
     */
    function createSponsorship(
        address sponsor,
        uint256 cohortId,
        uint256 studentId,
        uint256 amount,
        uint256 duration,
        string memory description
    ) external onlyRole(SPONSOR_MANAGER_ROLE) returns (uint256 sponsorshipId) {
        require(sponsors[sponsor].isActive, "Sponsor not active");
        require(amount > 0, "Amount must be greater than 0");
        require(duration > 0, "Duration must be greater than 0");
        require(totalVaultBalance >= totalAllocatedFunds + amount, "Insufficient vault balance");

        _sponsorshipIds++;
        sponsorshipId = _sponsorshipIds;

        uint256 startDate = block.timestamp;
        uint256 endDate = startDate + (duration * 1 days);

        sponsorships[sponsorshipId] = Sponsorship({
            id: sponsorshipId,
            sponsor: sponsor,
            cohortId: cohortId,
            studentId: studentId,
            amount: amount,
            allocatedAmount: 0,
            distributedAmount: 0,
            startDate: startDate,
            endDate: endDate,
            isActive: true,
            description: description
        });

        // Update sponsor activity
        sponsors[sponsor].lastActivity = block.timestamp;
        sponsors[sponsor].totalAllocated += amount;

        // Add to mappings
        if (cohortId > 0) {
            cohortSponsorships[cohortId].push(sponsorshipId);
        }
        if (studentId > 0) {
            studentSponsorships[studentId].push(sponsorshipId);
        }
        sponsorSponsorships[sponsor].push(sponsorshipId);

        totalAllocatedFunds += amount;

        emit SponsorshipCreated(sponsorshipId, sponsor, cohortId, studentId, amount);
    }

    /**
     * @dev Allocate funds from a sponsorship
     * @param sponsorshipId The sponsorship ID
     * @param amount Amount to allocate
     */
    function allocateFunds(uint256 sponsorshipId, uint256 amount) 
        external 
        onlyRole(SPONSOR_MANAGER_ROLE) 
    {
        require(sponsorshipId > 0 && sponsorshipId <= _sponsorshipIds, "Invalid sponsorship ID");
        
        Sponsorship storage sponsorship = sponsorships[sponsorshipId];
        require(sponsorship.isActive, "Sponsorship not active");
        require(sponsorship.allocatedAmount + amount <= sponsorship.amount, "Allocation exceeds sponsorship amount");

        sponsorship.allocatedAmount += amount;

        emit FundsAllocated(sponsorshipId, amount);
    }

    /**
     * @dev Distribute funds to a student
     * @param sponsorshipId The sponsorship ID
     * @param studentId The student ID
     * @param amount Amount to distribute
     */
    function distributeFunds(uint256 sponsorshipId, uint256 studentId, uint256 amount) 
        external 
        onlyRole(SPONSOR_MANAGER_ROLE) 
        nonReentrant 
    {
        require(sponsorshipId > 0 && sponsorshipId <= _sponsorshipIds, "Invalid sponsorship ID");
        require(studentId > 0, "Invalid student ID");
        require(amount > 0, "Amount must be greater than 0");
        require(usdcToken.balanceOf(address(this)) >= amount, "Insufficient vault balance");

        Sponsorship storage sponsorship = sponsorships[sponsorshipId];
        require(sponsorship.isActive, "Sponsorship not active");
        require(sponsorship.distributedAmount + amount <= sponsorship.allocatedAmount, "Distribution exceeds allocation");

        sponsorship.distributedAmount += amount;
        sponsors[sponsorship.sponsor].totalDistributed += amount;
        totalDistributedFunds += amount;

        // Transfer funds to student (placeholder - would integrate with IncomeAdvanceVault)
        usdcToken.safeTransfer(getStudentAddress(studentId), amount);

        emit FundsDistributed(sponsorshipId, amount, studentId);
    }

    /**
     * @dev Update impact metrics
     * @param totalStudents Total number of students funded
     * @param totalUSD Total USD distributed
     * @param totalCohorts Total cohorts supported
     */
    function updateImpactMetrics(
        uint256 totalStudents,
        uint256 totalUSD,
        uint256 totalCohorts
    ) external onlyRole(IMPACT_TRACKER_ROLE) {
        impactMetrics = ImpactMetrics({
            totalStudentsFunded: totalStudents,
            totalUSDDistributed: totalUSD,
            totalCohortsSupported: totalCohorts,
            averageStudentFunding: totalStudents > 0 ? totalUSD / totalStudents : 0,
            lastUpdated: block.timestamp
        });

        emit ImpactMetricsUpdated(totalStudents, totalUSD, totalCohorts);
    }

    /**
     * @dev Deactivate a sponsor
     * @param sponsorAddress The sponsor address
     */
    function deactivateSponsor(address sponsorAddress) external onlyRole(SPONSOR_MANAGER_ROLE) {
        require(sponsors[sponsorAddress].isActive, "Sponsor not active");

        sponsors[sponsorAddress].isActive = false;
        sponsors[sponsorAddress].lastActivity = block.timestamp;

        emit SponsorDeactivated(sponsorAddress);
    }

    /**
     * @dev Get sponsor information
     * @param sponsorAddress The sponsor address
     * @return The sponsor struct
     */
    function getSponsor(address sponsorAddress) external view returns (Sponsor memory) {
        return sponsors[sponsorAddress];
    }

    /**
     * @dev Get sponsorship information
     * @param sponsorshipId The sponsorship ID
     * @return The sponsorship struct
     */
    function getSponsorship(uint256 sponsorshipId) external view returns (Sponsorship memory) {
        return sponsorships[sponsorshipId];
    }

    /**
     * @dev Get sponsorships for a cohort
     * @param cohortId The cohort ID
     * @return Array of sponsorship IDs
     */
    function getCohortSponsorships(uint256 cohortId) external view returns (uint256[] memory) {
        return cohortSponsorships[cohortId];
    }

    /**
     * @dev Get sponsorships for a student
     * @param studentId The student ID
     * @return Array of sponsorship IDs
     */
    function getStudentSponsorships(uint256 studentId) external view returns (uint256[] memory) {
        return studentSponsorships[studentId];
    }

    /**
     * @dev Get sponsorships for a sponsor
     * @param sponsor The sponsor address
     * @return Array of sponsorship IDs
     */
    function getSponsorSponsorships(address sponsor) external view returns (uint256[] memory) {
        return sponsorSponsorships[sponsor];
    }

    /**
     * @dev Get total sponsorship value for a cohort
     * @param cohortId The cohort ID
     * @return Total sponsorship amount
     */
    function getCohortTotalSponsorship(uint256 cohortId) external view returns (uint256) {
        uint256[] memory sponsorshipIds = cohortSponsorships[cohortId];
        uint256 totalAmount = 0;

        for (uint256 i = 0; i < sponsorshipIds.length; i++) {
            Sponsorship memory sponsorship = sponsorships[sponsorshipIds[i]];
            if (sponsorship.isActive) {
                totalAmount += sponsorship.amount;
            }
        }

        return totalAmount;
    }

    /**
     * @dev Get total sponsorship value for a student
     * @param studentId The student ID
     * @return Total sponsorship amount
     */
    function getStudentTotalSponsorship(uint256 studentId) external view returns (uint256) {
        uint256[] memory sponsorshipIds = studentSponsorships[studentId];
        uint256 totalAmount = 0;

        for (uint256 i = 0; i < sponsorshipIds.length; i++) {
            Sponsorship memory sponsorship = sponsorships[sponsorshipIds[i]];
            if (sponsorship.isActive) {
                totalAmount += sponsorship.amount;
            }
        }

        return totalAmount;
    }

    /**
     * @dev Get available balance for new sponsorships
     * @return Available balance
     */
    function getAvailableBalance() external view returns (uint256) {
        return totalVaultBalance - totalAllocatedFunds;
    }

    /**
     * @dev Get total number of sponsorships
     * @return Total number of sponsorships
     */
    function getTotalSponsorships() external view returns (uint256) {
        return _sponsorshipIds;
    }

    /**
     * @dev Get active sponsorships count
     * @return Number of active sponsorships
     */
    function getActiveSponsorshipsCount() external view returns (uint256) {
        uint256 activeCount = 0;
        for (uint256 i = 1; i <= _sponsorshipIds; i++) {
            if (sponsorships[i].isActive) {
                activeCount++;
            }
        }
        return activeCount;
    }

    /**
     * @dev Get student address (placeholder - would integrate with StudentRegistry)
     * @param studentId The student ID
     * @return Student wallet address
     */
    function getStudentAddress(uint256 studentId) internal pure returns (address) {
        // TODO: Integrate with ForgeStudentRegistry to get actual student address
        // For now, return a placeholder address
        return address(0x1234567890123456789012345678901234567890);
    }

    /**
     * @dev Add vesting logic for sponsorships (future enhancement)
     * @param sponsorshipId The sponsorship ID
     * @param vestingSchedule Array of vesting amounts and dates
     */
    function addVestingSchedule(uint256 sponsorshipId, uint256[] memory vestingSchedule) 
        external 
        onlyRole(SPONSOR_MANAGER_ROLE) 
    {
        // TODO: Implement vesting logic for future releases
        // This would allow sponsors to set up gradual fund releases
        require(sponsorshipId > 0 && sponsorshipId <= _sponsorshipIds, "Invalid sponsorship ID");
        require(vestingSchedule.length > 0, "Vesting schedule cannot be empty");
        
        // Placeholder for future vesting implementation
    }
} 