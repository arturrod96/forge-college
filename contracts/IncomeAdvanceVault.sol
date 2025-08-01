// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title IncomeAdvanceVault
 * @dev Vault for managing USDC deposits and salary payments to students
 * @notice Handles fund deposits, salary streaming, and withdrawal logic
 */
contract IncomeAdvanceVault is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    bytes32 public constant PAYMENT_MANAGER_ROLE = keccak256("PAYMENT_MANAGER_ROLE");
    bytes32 public constant INVESTOR_ROLE = keccak256("INVESTOR_ROLE");

    IERC20 public immutable usdcToken;

    struct StudentPayment {
        uint256 studentId;
        uint256 totalAllocated;      // Total amount allocated to student
        uint256 totalPaid;           // Total amount paid to student
        uint256 monthlySalary;       // Monthly salary amount
        uint256 lastPaymentDate;     // Last payment timestamp
        uint256 nextPaymentDate;     // Next payment due date
        bool isActive;
        uint256 startDate;
        uint256 endDate;
    }

    struct PaymentSchedule {
        uint256 studentId;
        uint256 amount;
        uint256 dueDate;
        bool isPaid;
        bool isOverdue;
    }

    // Mapping from student ID to payment information
    mapping(uint256 => StudentPayment) public studentPayments;
    
    // Mapping from student ID to array of payment schedules
    mapping(uint256 => PaymentSchedule[]) public paymentSchedules;
    
    // Mapping from investor address to total deposits
    mapping(address => uint256) public investorDeposits;
    
    // Total vault balance
    uint256 public totalVaultBalance;
    
    // Total allocated funds
    uint256 public totalAllocatedFunds;
    
    // Total paid out funds
    uint256 public totalPaidOutFunds;

    // Configuration
    uint256 public constant MINIMUM_SALARY = 100 * 10**6; // 100 USDC minimum
    uint256 public constant MAXIMUM_SALARY = 5000 * 10**6; // 5000 USDC maximum
    uint256 public constant PAYMENT_INTERVAL = 30 days; // Monthly payments

    // Events
    event FundsDeposited(address indexed investor, uint256 amount, uint256 totalBalance);
    event StudentAllocated(uint256 indexed studentId, uint256 amount, uint256 monthlySalary);
    event PaymentReleased(uint256 indexed studentId, uint256 amount, uint256 remainingBalance);
    event PaymentScheduled(uint256 indexed studentId, uint256 amount, uint256 dueDate);
    event FundsWithdrawn(address indexed investor, uint256 amount);
    event EmergencyWithdraw(address indexed admin, uint256 amount);

    constructor(address _usdcToken) {
        require(_usdcToken != address(0), "Invalid USDC token address");
        usdcToken = IERC20(_usdcToken);
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAYMENT_MANAGER_ROLE, msg.sender);
        _grantRole(INVESTOR_ROLE, msg.sender);
    }

    /**
     * @dev Deposit USDC funds to the vault
     * @param amount Amount of USDC to deposit
     */
    function depositFunds(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(usdcToken.balanceOf(msg.sender) >= amount, "Insufficient USDC balance");

        usdcToken.safeTransferFrom(msg.sender, address(this), amount);
        
        investorDeposits[msg.sender] += amount;
        totalVaultBalance += amount;

        emit FundsDeposited(msg.sender, amount, totalVaultBalance);
    }

    /**
     * @dev Allocate funds to a student for salary payments
     * @param studentId The student ID
     * @param totalAmount Total amount to allocate
     * @param monthlySalary Monthly salary amount
     * @param duration Duration in months
     */
    function allocateStudentFunds(
        uint256 studentId,
        uint256 totalAmount,
        uint256 monthlySalary,
        uint256 duration
    ) external onlyRole(PAYMENT_MANAGER_ROLE) {
        require(studentId > 0, "Invalid student ID");
        require(totalAmount > 0, "Total amount must be greater than 0");
        require(monthlySalary >= MINIMUM_SALARY, "Salary below minimum");
        require(monthlySalary <= MAXIMUM_SALARY, "Salary above maximum");
        require(duration > 0, "Duration must be greater than 0");
        require(!studentPayments[studentId].isActive, "Student already has active allocation");
        require(totalVaultBalance >= totalAllocatedFunds + totalAmount, "Insufficient vault balance");

        uint256 startDate = block.timestamp;
        uint256 endDate = startDate + (duration * PAYMENT_INTERVAL);

        studentPayments[studentId] = StudentPayment({
            studentId: studentId,
            totalAllocated: totalAmount,
            totalPaid: 0,
            monthlySalary: monthlySalary,
            lastPaymentDate: 0,
            nextPaymentDate: startDate + PAYMENT_INTERVAL,
            isActive: true,
            startDate: startDate,
            endDate: endDate
        });

        totalAllocatedFunds += totalAmount;

        // Create payment schedule
        for (uint256 i = 0; i < duration; i++) {
            uint256 dueDate = startDate + ((i + 1) * PAYMENT_INTERVAL);
            paymentSchedules[studentId].push(PaymentSchedule({
                studentId: studentId,
                amount: monthlySalary,
                dueDate: dueDate,
                isPaid: false,
                isOverdue: false
            }));
        }

        emit StudentAllocated(studentId, totalAmount, monthlySalary);
    }

    /**
     * @dev Release payment to a student (TESTNET ONLY)
     * @param studentId The student ID
     * @param amount Amount to release
     */
    function releasePayment(uint256 studentId, uint256 amount) 
        external 
        onlyRole(PAYMENT_MANAGER_ROLE) 
        nonReentrant 
    {
        require(studentId > 0, "Invalid student ID");
        require(amount > 0, "Amount must be greater than 0");
        
        StudentPayment storage payment = studentPayments[studentId];
        require(payment.isActive, "Student payment not active");
        require(payment.totalPaid + amount <= payment.totalAllocated, "Payment exceeds allocation");
        require(usdcToken.balanceOf(address(this)) >= amount, "Insufficient vault balance");

        payment.totalPaid += amount;
        payment.lastPaymentDate = block.timestamp;
        payment.nextPaymentDate = block.timestamp + PAYMENT_INTERVAL;

        totalPaidOutFunds += amount;

        usdcToken.safeTransfer(getStudentAddress(studentId), amount);

        emit PaymentReleased(studentId, amount, payment.totalAllocated - payment.totalPaid);
    }

    /**
     * @dev Release scheduled payment to a student
     * @param studentId The student ID
     * @param scheduleIndex Index of the payment schedule to release
     */
    function releaseScheduledPayment(uint256 studentId, uint256 scheduleIndex) 
        external 
        onlyRole(PAYMENT_MANAGER_ROLE) 
        nonReentrant 
    {
        require(studentId > 0, "Invalid student ID");
        require(scheduleIndex < paymentSchedules[studentId].length, "Invalid schedule index");
        
        PaymentSchedule storage schedule = paymentSchedules[studentId][scheduleIndex];
        require(!schedule.isPaid, "Payment already made");
        require(block.timestamp >= schedule.dueDate, "Payment not due yet");
        require(usdcToken.balanceOf(address(this)) >= schedule.amount, "Insufficient vault balance");

        schedule.isPaid = true;
        schedule.isOverdue = false;

        StudentPayment storage payment = studentPayments[studentId];
        payment.totalPaid += schedule.amount;
        payment.lastPaymentDate = block.timestamp;

        totalPaidOutFunds += schedule.amount;

        usdcToken.safeTransfer(getStudentAddress(studentId), schedule.amount);

        emit PaymentReleased(studentId, schedule.amount, payment.totalAllocated - payment.totalPaid);
    }

    /**
     * @dev Withdraw funds from vault (for investors)
     * @param amount Amount to withdraw
     */
    function withdrawFunds(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(investorDeposits[msg.sender] >= amount, "Insufficient deposited funds");
        require(totalVaultBalance >= totalAllocatedFunds + amount, "Insufficient available balance");

        investorDeposits[msg.sender] -= amount;
        totalVaultBalance -= amount;

        usdcToken.safeTransfer(msg.sender, amount);

        emit FundsWithdrawn(msg.sender, amount);
    }

    /**
     * @dev Emergency withdraw (admin only)
     * @param amount Amount to withdraw
     */
    function emergencyWithdraw(uint256 amount) external onlyRole(DEFAULT_ADMIN_ROLE) nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(usdcToken.balanceOf(address(this)) >= amount, "Insufficient balance");

        usdcToken.safeTransfer(msg.sender, amount);

        emit EmergencyWithdraw(msg.sender, amount);
    }

    /**
     * @dev Get student payment information
     * @param studentId The student ID
     * @return The student payment struct
     */
    function getStudentPayment(uint256 studentId) external view returns (StudentPayment memory) {
        return studentPayments[studentId];
    }

    /**
     * @dev Get payment schedules for a student
     * @param studentId The student ID
     * @return Array of payment schedules
     */
    function getPaymentSchedules(uint256 studentId) external view returns (PaymentSchedule[] memory) {
        return paymentSchedules[studentId];
    }

    /**
     * @dev Get available balance for withdrawals
     * @return Available balance
     */
    function getAvailableBalance() external view returns (uint256) {
        return totalVaultBalance - totalAllocatedFunds;
    }

    /**
     * @dev Get overdue payments for a student
     * @param studentId The student ID
     * @return Array of overdue payment indices
     */
    function getOverduePayments(uint256 studentId) external view returns (uint256[] memory) {
        PaymentSchedule[] memory schedules = paymentSchedules[studentId];
        uint256[] memory overdueIndices = new uint256[](schedules.length);
        uint256 overdueCount = 0;

        for (uint256 i = 0; i < schedules.length; i++) {
            if (!schedules[i].isPaid && block.timestamp > schedules[i].dueDate) {
                overdueIndices[overdueCount] = i;
                overdueCount++;
            }
        }

        // Resize array to actual count
        uint256[] memory result = new uint256[](overdueCount);
        for (uint256 i = 0; i < overdueCount; i++) {
            result[i] = overdueIndices[i];
        }

        return result;
    }

    /**
     * @dev Calculate total overdue amount for a student
     * @param studentId The student ID
     * @return Total overdue amount
     */
    function getTotalOverdueAmount(uint256 studentId) external view returns (uint256) {
        uint256[] memory overdueIndices = this.getOverduePayments(studentId);
        uint256 totalOverdue = 0;

        for (uint256 i = 0; i < overdueIndices.length; i++) {
            totalOverdue += paymentSchedules[studentId][overdueIndices[i]].amount;
        }

        return totalOverdue;
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
     * @dev Update payment schedule due dates (admin only)
     * @param studentId The student ID
     * @param scheduleIndex The schedule index
     * @param newDueDate The new due date
     */
    function updatePaymentDueDate(uint256 studentId, uint256 scheduleIndex, uint256 newDueDate) 
        external 
        onlyRole(PAYMENT_MANAGER_ROLE) 
    {
        require(studentId > 0, "Invalid student ID");
        require(scheduleIndex < paymentSchedules[studentId].length, "Invalid schedule index");
        require(newDueDate > block.timestamp, "Due date must be in the future");

        paymentSchedules[studentId][scheduleIndex].dueDate = newDueDate;
    }
} 