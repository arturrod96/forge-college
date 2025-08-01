// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title ForgeStudentRegistry
 * @dev Registry for managing students, their cohorts, and status
 * @notice Handles student registration, cohort assignment, and status updates
 */
contract ForgeStudentRegistry is AccessControl {
    bytes32 public constant COHORT_MANAGER_ROLE = keccak256("COHORT_MANAGER_ROLE");
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");

    uint256 private _studentIds;

    struct Student {
        uint256 id;
        address wallet;
        uint256 cohortId;
        StudentStatus status;
        uint256 registrationDate;
        uint256 lastUpdated;
    }

    enum StudentStatus {
        PENDING,
        ACTIVE,
        GRADUATED,
        DROPPED,
        SUSPENDED
    }

    // Mapping from student ID to Student struct
    mapping(uint256 => Student) public students;
    
    // Mapping from wallet address to student ID
    mapping(address => uint256) public walletToStudentId;
    
    // Mapping from cohort ID to array of student IDs
    mapping(uint256 => uint256[]) public cohortStudents;

    // Events
    event StudentRegistered(uint256 indexed studentId, address indexed wallet, uint256 cohortId);
    event StudentUpdated(uint256 indexed studentId, address indexed wallet, StudentStatus status);
    event CohortAssigned(uint256 indexed studentId, uint256 indexed cohortId);
    event StudentStatusChanged(uint256 indexed studentId, StudentStatus oldStatus, StudentStatus newStatus);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(COHORT_MANAGER_ROLE, msg.sender);
        _grantRole(ORACLE_ROLE, msg.sender);
    }

    /**
     * @dev Register a new student
     * @param wallet The student's wallet address
     * @param cohortId The cohort ID to assign the student to
     * @return studentId The assigned student ID
     */
    function registerStudent(address wallet, uint256 cohortId) 
        external 
        onlyRole(COHORT_MANAGER_ROLE) 
        returns (uint256 studentId) 
    {
        require(wallet != address(0), "Invalid wallet address");
        require(walletToStudentId[wallet] == 0, "Student already registered");

        _studentIds++;
        studentId = _studentIds;

        students[studentId] = Student({
            id: studentId,
            wallet: wallet,
            cohortId: cohortId,
            status: StudentStatus.PENDING,
            registrationDate: block.timestamp,
            lastUpdated: block.timestamp
        });

        walletToStudentId[wallet] = studentId;
        cohortStudents[cohortId].push(studentId);

        emit StudentRegistered(studentId, wallet, cohortId);
    }

    /**
     * @dev Update student status
     * @param studentId The student ID
     * @param newStatus The new status to set
     */
    function updateStudentStatus(uint256 studentId, StudentStatus newStatus) 
        external 
        onlyRole(COHORT_MANAGER_ROLE) 
    {
        require(students[studentId].id != 0, "Student does not exist");
        
        StudentStatus oldStatus = students[studentId].status;
        students[studentId].status = newStatus;
        students[studentId].lastUpdated = block.timestamp;

        emit StudentStatusChanged(studentId, oldStatus, newStatus);
        emit StudentUpdated(studentId, students[studentId].wallet, newStatus);
    }

    /**
     * @dev Assign a student to a different cohort
     * @param studentId The student ID
     * @param newCohortId The new cohort ID
     */
    function assignCohort(uint256 studentId, uint256 newCohortId) 
        external 
        onlyRole(COHORT_MANAGER_ROLE) 
    {
        require(students[studentId].id != 0, "Student does not exist");
        
        uint256 oldCohortId = students[studentId].cohortId;
        students[studentId].cohortId = newCohortId;
        students[studentId].lastUpdated = block.timestamp;

        // Remove from old cohort
        if (oldCohortId != 0) {
            uint256[] storage oldCohort = cohortStudents[oldCohortId];
            for (uint256 i = 0; i < oldCohort.length; i++) {
                if (oldCohort[i] == studentId) {
                    oldCohort[i] = oldCohort[oldCohort.length - 1];
                    oldCohort.pop();
                    break;
                }
            }
        }

        // Add to new cohort
        cohortStudents[newCohortId].push(studentId);

        emit CohortAssigned(studentId, newCohortId);
        emit StudentUpdated(studentId, students[studentId].wallet, students[studentId].status);
    }

    /**
     * @dev Get student information by ID
     * @param studentId The student ID
     * @return The student struct
     */
    function getStudent(uint256 studentId) external view returns (Student memory) {
        return students[studentId];
    }

    /**
     * @dev Get student information by wallet address
     * @param wallet The wallet address
     * @return The student struct
     */
    function getStudentByWallet(address wallet) external view returns (Student memory) {
        uint256 studentId = walletToStudentId[wallet];
        require(studentId != 0, "Student not found");
        return students[studentId];
    }

    /**
     * @dev Get all students in a cohort
     * @param cohortId The cohort ID
     * @return Array of student IDs in the cohort
     */
    function getCohortStudents(uint256 cohortId) external view returns (uint256[] memory) {
        return cohortStudents[cohortId];
    }

    /**
     * @dev Get total number of students
     * @return The total number of registered students
     */
    function getTotalStudents() external view returns (uint256) {
        return _studentIds;
    }

    /**
     * @dev Check if a wallet is registered as a student
     * @param wallet The wallet address to check
     * @return True if the wallet is registered
     */
    function isStudentRegistered(address wallet) external view returns (bool) {
        return walletToStudentId[wallet] != 0;
    }

    /**
     * @dev Get student ID by wallet address
     * @param wallet The wallet address
     * @return The student ID (0 if not found)
     */
    function getStudentId(address wallet) external view returns (uint256) {
        return walletToStudentId[wallet];
    }
} 