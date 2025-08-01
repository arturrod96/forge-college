// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title StudentDebtToken
 * @dev ERC-721 token representing student debt obligations
 * @notice Each token represents a student's advance + repayment terms
 */
contract StudentDebtToken is ERC721, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    uint256 private _tokenIds;

    // Manual token URI storage
    mapping(uint256 => string) private _tokenURIs;

    struct DebtMetadata {
        uint256 studentId;
        uint256 cohortId;
        uint256 amount;           // Amount in USDC (6 decimals)
        uint256 interestRate;     // Annual interest rate (basis points)
        uint256 duration;         // Duration in days
        uint256 startDate;
        uint256 dueDate;
        uint256 amountRepaid;
        bool isFullyRepaid;
        bool isActive;
    }

    // Mapping from token ID to debt metadata
    mapping(uint256 => DebtMetadata) public debtMetadata;
    
    // Mapping from student ID to array of token IDs
    mapping(uint256 => uint256[]) public studentDebtTokens;
    
    // Mapping from cohort ID to array of token IDs
    mapping(uint256 => uint256[]) public cohortDebtTokens;

    // Events
    event DebtTokenMinted(uint256 indexed tokenId, uint256 indexed studentId, uint256 amount, uint256 interestRate);
    event DebtTokenBurned(uint256 indexed tokenId, uint256 indexed studentId);
    event RepaymentUpdated(uint256 indexed tokenId, uint256 amountRepaid, uint256 remainingAmount);
    event DebtFullyRepaid(uint256 indexed tokenId, uint256 indexed studentId);

    constructor() ERC721("Forge College Student Debt", "FORGE-DEBT") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(BURNER_ROLE, msg.sender);
    }

    /**
     * @dev Mint a new debt token
     * @param to The address to mint the token to
     * @param studentId The student ID
     * @param cohortId The cohort ID
     * @param amount The debt amount in USDC
     * @param interestRate Annual interest rate in basis points
     * @param duration Duration in days
     * @param uri The token URI for metadata
     * @return tokenId The minted token ID
     */
    function mintDebtToken(
        address to,
        uint256 studentId,
        uint256 cohortId,
        uint256 amount,
        uint256 interestRate,
        uint256 duration,
        string memory uri
    ) external onlyRole(MINTER_ROLE) returns (uint256 tokenId) {
        require(to != address(0), "Invalid recipient address");
        require(studentId > 0, "Invalid student ID");
        require(amount > 0, "Amount must be greater than 0");
        require(interestRate <= 5000, "Interest rate cannot exceed 50%"); // 50% max
        require(duration > 0, "Duration must be greater than 0");

        _tokenIds++;
        tokenId = _tokenIds;

        uint256 startDate = block.timestamp;
        uint256 dueDate = startDate + (duration * 1 days);

        debtMetadata[tokenId] = DebtMetadata({
            studentId: studentId,
            cohortId: cohortId,
            amount: amount,
            interestRate: interestRate,
            duration: duration,
            startDate: startDate,
            dueDate: dueDate,
            amountRepaid: 0,
            isFullyRepaid: false,
            isActive: true
        });

        studentDebtTokens[studentId].push(tokenId);
        cohortDebtTokens[cohortId].push(tokenId);

        _safeMint(to, tokenId);
        _tokenURIs[tokenId] = uri;

        emit DebtTokenMinted(tokenId, studentId, amount, interestRate);
    }

    /**
     * @dev Burn a debt token (when fully repaid)
     * @param tokenId The token ID to burn
     */
    function burnDebtToken(uint256 tokenId) external onlyRole(BURNER_ROLE) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        require(debtMetadata[tokenId].isFullyRepaid, "Debt not fully repaid");

        uint256 studentId = debtMetadata[tokenId].studentId;
        debtMetadata[tokenId].isActive = false;

        _burn(tokenId);

        emit DebtTokenBurned(tokenId, studentId);
    }

    /**
     * @dev Update repayment amount for a debt token
     * @param tokenId The token ID
     * @param repaymentAmount The amount being repaid
     */
    function updateRepayment(uint256 tokenId, uint256 repaymentAmount) external onlyRole(MINTER_ROLE) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        require(debtMetadata[tokenId].isActive, "Token is not active");
        require(repaymentAmount > 0, "Repayment amount must be greater than 0");

        DebtMetadata storage debt = debtMetadata[tokenId];
        require(debt.amountRepaid + repaymentAmount <= debt.amount, "Repayment exceeds debt amount");

        debt.amountRepaid += repaymentAmount;

        if (debt.amountRepaid >= debt.amount) {
            debt.isFullyRepaid = true;
            emit DebtFullyRepaid(tokenId, debt.studentId);
        }

        emit RepaymentUpdated(tokenId, debt.amountRepaid, debt.amount - debt.amountRepaid);
    }

    /**
     * @dev Get debt metadata for a token
     * @param tokenId The token ID
     * @return The debt metadata struct
     */
    function getDebtMetadata(uint256 tokenId) external view returns (DebtMetadata memory) {
        return debtMetadata[tokenId];
    }

    /**
     * @dev Get all debt tokens for a student
     * @param studentId The student ID
     * @return Array of token IDs
     */
    function getStudentDebtTokens(uint256 studentId) external view returns (uint256[] memory) {
        return studentDebtTokens[studentId];
    }

    /**
     * @dev Get all debt tokens for a cohort
     * @param cohortId The cohort ID
     * @return Array of token IDs
     */
    function getCohortDebtTokens(uint256 cohortId) external view returns (uint256[] memory) {
        return cohortDebtTokens[cohortId];
    }

    /**
     * @dev Calculate total debt for a student
     * @param studentId The student ID
     * @return Total debt amount
     */
    function getStudentTotalDebt(uint256 studentId) external view returns (uint256) {
        uint256[] memory tokens = studentDebtTokens[studentId];
        uint256 totalDebt = 0;

        for (uint256 i = 0; i < tokens.length; i++) {
            if (debtMetadata[tokens[i]].isActive) {
                totalDebt += debtMetadata[tokens[i]].amount;
            }
        }

        return totalDebt;
    }

    /**
     * @dev Calculate total repaid amount for a student
     * @param studentId The student ID
     * @return Total repaid amount
     */
    function getStudentTotalRepaid(uint256 studentId) external view returns (uint256) {
        uint256[] memory tokens = studentDebtTokens[studentId];
        uint256 totalRepaid = 0;

        for (uint256 i = 0; i < tokens.length; i++) {
            if (debtMetadata[tokens[i]].isActive) {
                totalRepaid += debtMetadata[tokens[i]].amountRepaid;
            }
        }

        return totalRepaid;
    }

    /**
     * @dev Calculate remaining debt for a student
     * @param studentId The student ID
     * @return Remaining debt amount
     */
    function getStudentRemainingDebt(uint256 studentId) external view returns (uint256) {
        uint256 totalDebt = this.getStudentTotalDebt(studentId);
        uint256 totalRepaid = this.getStudentTotalRepaid(studentId);
        return totalDebt - totalRepaid;
    }

    /**
     * @dev Calculate interest accrued on a debt token
     * @param tokenId The token ID
     * @return Interest amount in USDC
     */
    function calculateInterest(uint256 tokenId) external view returns (uint256) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        
        DebtMetadata memory debt = debtMetadata[tokenId];
        if (!debt.isActive || debt.isFullyRepaid) return 0;

        uint256 timeElapsed = block.timestamp - debt.startDate;
        uint256 daysElapsed = timeElapsed / 1 days;
        
        // Simple interest calculation: (Principal * Rate * Time) / (365 * 10000)
        return (debt.amount * debt.interestRate * daysElapsed) / (365 * 10000);
    }

    /**
     * @dev Get total outstanding debt for a cohort
     * @param cohortId The cohort ID
     * @return Total outstanding debt amount
     */
    function getCohortTotalDebt(uint256 cohortId) external view returns (uint256) {
        uint256[] memory tokens = cohortDebtTokens[cohortId];
        uint256 totalDebt = 0;

        for (uint256 i = 0; i < tokens.length; i++) {
            if (debtMetadata[tokens[i]].isActive && !debtMetadata[tokens[i]].isFullyRepaid) {
                totalDebt += (debtMetadata[tokens[i]].amount - debtMetadata[tokens[i]].amountRepaid);
            }
        }

        return totalDebt;
    }

    /**
     * @dev Check if a debt token is overdue
     * @param tokenId The token ID
     * @return True if the debt is overdue
     */
    function isDebtOverdue(uint256 tokenId) external view returns (bool) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        
        DebtMetadata memory debt = debtMetadata[tokenId];
        return debt.isActive && !debt.isFullyRepaid && block.timestamp > debt.dueDate;
    }

    /**
     * @dev Get overdue days for a debt token
     * @param tokenId The token ID
     * @return Number of days overdue (0 if not overdue)
     */
    function getOverdueDays(uint256 tokenId) external view returns (uint256) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        
        DebtMetadata memory debt = debtMetadata[tokenId];
        if (!debt.isActive || debt.isFullyRepaid || block.timestamp <= debt.dueDate) {
            return 0;
        }
        
        return (block.timestamp - debt.dueDate) / 1 days;
    }

    /**
     * @dev Returns the token URI for a given tokenId
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return _tokenURIs[tokenId];
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
} 