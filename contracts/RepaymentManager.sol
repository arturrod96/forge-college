// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./StudentDebtToken.sol";

/**
 * @title RepaymentManager
 * @dev Manages student debt repayments and debt token lifecycle
 * @notice Handles repayments, debt token updates, and investor fund redistribution
 */
contract RepaymentManager is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    bytes32 public constant REPAYMENT_MANAGER_ROLE = keccak256("REPAYMENT_MANAGER_ROLE");
    bytes32 public constant DEBT_TOKEN_ROLE = keccak256("DEBT_TOKEN_ROLE");

    IERC20 public immutable usdcToken;
    StudentDebtToken public immutable debtToken;

    struct Repayment {
        uint256 tokenId;
        uint256 studentId;
        uint256 amount;
        uint256 timestamp;
        uint256 remainingDebt;
    }

    struct StudentRepaymentHistory {
        uint256 totalRepaid;
        uint256 totalDebt;
        uint256 lastRepaymentDate;
        uint256 repaymentCount;
    }

    // Mapping from student ID to repayment history
    mapping(uint256 => StudentRepaymentHistory) public studentRepayments;
    
    // Mapping from token ID to array of repayments
    mapping(uint256 => Repayment[]) public tokenRepayments;
    
    // Mapping from investor address to total returns
    mapping(address => uint256) public investorReturns;
    
    // Total repayments received
    uint256 public totalRepaymentsReceived;
    
    // Total returns distributed to investors
    uint256 public totalReturnsDistributed;

    // Configuration
    uint256 public constant MINIMUM_REPAYMENT = 10 * 10**6; // 10 USDC minimum
    uint256 public constant REPAYMENT_FEE = 50; // 0.5% fee (50 basis points)

    // Events
    event RepaymentReceived(uint256 indexed tokenId, uint256 indexed studentId, uint256 amount, uint256 remainingDebt);
    event DebtFullyRepaid(uint256 indexed tokenId, uint256 indexed studentId);
    event ReturnsDistributed(address indexed investor, uint256 amount);
    event RepaymentFeeCollected(uint256 amount);
    event EmergencyRepayment(uint256 indexed studentId, uint256 amount);

    constructor(address _usdcToken, address _debtToken) {
        require(_usdcToken != address(0), "Invalid USDC token address");
        require(_debtToken != address(0), "Invalid debt token address");
        
        usdcToken = IERC20(_usdcToken);
        debtToken = StudentDebtToken(_debtToken);
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(REPAYMENT_MANAGER_ROLE, msg.sender);
        _grantRole(DEBT_TOKEN_ROLE, _debtToken);
    }

    /**
     * @dev Accept repayment from a student
     * @param tokenId The debt token ID
     * @param amount Amount to repay
     */
    function acceptRepayment(uint256 tokenId, uint256 amount) external nonReentrant {
        require(tokenId > 0, "Invalid token ID");
        require(amount >= MINIMUM_REPAYMENT, "Repayment below minimum");
        require(usdcToken.balanceOf(msg.sender) >= amount, "Insufficient USDC balance");

        // Get debt metadata
        StudentDebtToken.DebtMetadata memory debt = debtToken.getDebtMetadata(tokenId);
        require(debt.isActive && !debt.isFullyRepaid, "Debt not active or already repaid");
        require(debt.amountRepaid + amount <= debt.amount, "Repayment exceeds debt amount");

        // Transfer USDC from student
        usdcToken.safeTransferFrom(msg.sender, address(this), amount);

        // Calculate fee
        uint256 fee = (amount * REPAYMENT_FEE) / 10000;
        uint256 netRepayment = amount - fee;

        // Update debt token
        debtToken.updateRepayment(tokenId, netRepayment);

        // Update repayment history
        StudentRepaymentHistory storage history = studentRepayments[debt.studentId];
        history.totalRepaid += netRepayment;
        history.lastRepaymentDate = block.timestamp;
        history.repaymentCount++;

        // Record repayment
        Repayment memory repayment = Repayment({
            tokenId: tokenId,
            studentId: debt.studentId,
            amount: netRepayment,
            timestamp: block.timestamp,
            remainingDebt: debt.amount - debt.amountRepaid - netRepayment
        });

        tokenRepayments[tokenId].push(repayment);
        totalRepaymentsReceived += netRepayment;

        emit RepaymentReceived(tokenId, debt.studentId, netRepayment, repayment.remainingDebt);

        // Check if debt is fully repaid
        if (debt.amountRepaid + netRepayment >= debt.amount) {
            emit DebtFullyRepaid(tokenId, debt.studentId);
        }
    }

    /**
     * @dev Force repayment for a student (TESTNET ONLY)
     * @param studentId The student ID
     * @param amount Amount to force repay
     */
    function forceRepayment(uint256 studentId, uint256 amount) 
        public 
        onlyRole(REPAYMENT_MANAGER_ROLE) 
        nonReentrant 
    {
        require(studentId > 0, "Invalid student ID");
        require(amount > 0, "Amount must be greater than 0");

        // Get all debt tokens for the student
        uint256[] memory tokens = debtToken.getStudentDebtTokens(studentId);
        require(tokens.length > 0, "No debt tokens found for student");

        uint256 remainingAmount = amount;
        
        for (uint256 i = 0; i < tokens.length && remainingAmount > 0; i++) {
            StudentDebtToken.DebtMetadata memory debt = debtToken.getDebtMetadata(tokens[i]);
            
            if (debt.isActive && !debt.isFullyRepaid) {
                uint256 debtRemaining = debt.amount - debt.amountRepaid;
                uint256 repaymentAmount = remainingAmount > debtRemaining ? debtRemaining : remainingAmount;
                
                if (repaymentAmount > 0) {
                    debtToken.updateRepayment(tokens[i], repaymentAmount);
                    remainingAmount -= repaymentAmount;
                    
                    // Update repayment history
                    StudentRepaymentHistory storage history = studentRepayments[studentId];
                    history.totalRepaid += repaymentAmount;
                    history.lastRepaymentDate = block.timestamp;
                    history.repaymentCount++;

                    totalRepaymentsReceived += repaymentAmount;

                    emit RepaymentReceived(tokens[i], studentId, repaymentAmount, debtRemaining - repaymentAmount);
                }
            }
        }

        emit EmergencyRepayment(studentId, amount - remainingAmount);
    }

    /**
     * @dev Distribute returns to investors
     * @param investor The investor address
     * @param amount Amount to distribute
     */
    function distributeReturns(address investor, uint256 amount) 
        external 
        onlyRole(REPAYMENT_MANAGER_ROLE) 
        nonReentrant 
    {
        require(investor != address(0), "Invalid investor address");
        require(amount > 0, "Amount must be greater than 0");
        require(usdcToken.balanceOf(address(this)) >= amount, "Insufficient balance");

        investorReturns[investor] += amount;
        totalReturnsDistributed += amount;

        usdcToken.safeTransfer(investor, amount);

        emit ReturnsDistributed(investor, amount);
    }

    /**
     * @dev Collect repayment fees
     * @param recipient The fee recipient address
     */
    function collectFees(address recipient) external onlyRole(REPAYMENT_MANAGER_ROLE) nonReentrant {
        require(recipient != address(0), "Invalid recipient address");
        
        uint256 feeBalance = usdcToken.balanceOf(address(this)) - (totalRepaymentsReceived - totalReturnsDistributed);
        require(feeBalance > 0, "No fees to collect");

        usdcToken.safeTransfer(recipient, feeBalance);

        emit RepaymentFeeCollected(feeBalance);
    }

    /**
     * @dev Get repayment history for a student
     * @param studentId The student ID
     * @return The student repayment history struct
     */
    function getStudentRepaymentHistory(uint256 studentId) external view returns (StudentRepaymentHistory memory) {
        return studentRepayments[studentId];
    }

    /**
     * @dev Get repayment history for a debt token
     * @param tokenId The token ID
     * @return Array of repayments
     */
    function getTokenRepayments(uint256 tokenId) external view returns (Repayment[] memory) {
        return tokenRepayments[tokenId];
    }

    /**
     * @dev Get total outstanding debt for a student
     * @param studentId The student ID
     * @return Total outstanding debt amount
     */
    function getStudentOutstandingDebt(uint256 studentId) external view returns (uint256) {
        uint256[] memory tokens = debtToken.getStudentDebtTokens(studentId);
        uint256 totalOutstanding = 0;

        for (uint256 i = 0; i < tokens.length; i++) {
            StudentDebtToken.DebtMetadata memory debt = debtToken.getDebtMetadata(tokens[i]);
            if (debt.isActive && !debt.isFullyRepaid) {
                totalOutstanding += (debt.amount - debt.amountRepaid);
            }
        }

        return totalOutstanding;
    }

    /**
     * @dev Get student's repayment progress
     * @param studentId The student ID
     * @return progress Percentage of debt repaid (0-10000)
     */
    function getStudentRepaymentProgress(uint256 studentId) external view returns (uint256) {
        StudentRepaymentHistory memory history = studentRepayments[studentId];
        uint256 totalDebt = debtToken.getStudentTotalDebt(studentId);
        
        if (totalDebt == 0) return 0;
        
        return (history.totalRepaid * 10000) / totalDebt;
    }

    /**
     * @dev Get overdue debt tokens for a student
     * @param studentId The student ID
     * @return Array of overdue token IDs
     */
    function getOverdueDebtTokens(uint256 studentId) external view returns (uint256[] memory) {
        uint256[] memory tokens = debtToken.getStudentDebtTokens(studentId);
        uint256[] memory overdueTokens = new uint256[](tokens.length);
        uint256 overdueCount = 0;

        for (uint256 i = 0; i < tokens.length; i++) {
            if (debtToken.isDebtOverdue(tokens[i])) {
                overdueTokens[overdueCount] = tokens[i];
                overdueCount++;
            }
        }

        // Resize array to actual count
        uint256[] memory result = new uint256[](overdueCount);
        for (uint256 i = 0; i < overdueCount; i++) {
            result[i] = overdueTokens[i];
        }

        return result;
    }

    /**
     * @dev Calculate total overdue amount for a student
     * @param studentId The student ID
     * @return Total overdue amount
     */
    function getTotalOverdueAmount(uint256 studentId) external view returns (uint256) {
        uint256[] memory overdueTokens = this.getOverdueDebtTokens(studentId);
        uint256 totalOverdue = 0;

        for (uint256 i = 0; i < overdueTokens.length; i++) {
            StudentDebtToken.DebtMetadata memory debt = debtToken.getDebtMetadata(overdueTokens[i]);
            totalOverdue += (debt.amount - debt.amountRepaid);
        }

        return totalOverdue;
    }

    /**
     * @dev Get available balance for returns distribution
     * @return Available balance
     */
    function getAvailableBalance() external view returns (uint256) {
        return totalRepaymentsReceived - totalReturnsDistributed;
    }

    /**
     * @dev Get fee balance
     * @return Fee balance
     */
    function getFeeBalance() external view returns (uint256) {
        return usdcToken.balanceOf(address(this)) - (totalRepaymentsReceived - totalReturnsDistributed);
    }

    /**
     * @dev Batch process repayments for multiple students (TESTNET ONLY)
     * @param studentIds Array of student IDs
     * @param amounts Array of repayment amounts
     */
    function batchProcessRepayments(uint256[] memory studentIds, uint256[] memory amounts) 
        external 
        onlyRole(REPAYMENT_MANAGER_ROLE) 
    {
        require(studentIds.length == amounts.length, "Array lengths must match");

        for (uint256 i = 0; i < studentIds.length; i++) {
            if (amounts[i] > 0) {
                forceRepayment(studentIds[i], amounts[i]);
            }
        }
    }
} 