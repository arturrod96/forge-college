// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title CohortManager
 * @dev Manages cohorts, their topics, mentors, and milestones
 * @notice Handles cohort creation, assignment, and milestone tracking
 */
contract CohortManager is AccessControl {
    bytes32 public constant COHORT_MANAGER_ROLE = keccak256("COHORT_MANAGER_ROLE");
    bytes32 public constant MENTOR_ROLE = keccak256("MENTOR_ROLE");

    uint256 private _cohortIds;

    struct Cohort {
        uint256 id;
        string name;
        string description;
        string[] topics;
        address[] mentors;
        uint256 startDate;
        uint256 endDate;
        uint256 maxStudents;
        uint256 currentStudents;
        CohortStatus status;
        uint256 createdDate;
        uint256 lastUpdated;
    }

    struct Milestone {
        uint256 id;
        string name;
        string description;
        uint256 dueDate;
        uint256 weight; // Percentage weight for final grade
        bool isCompleted;
        uint256 completedDate;
    }

    enum CohortStatus {
        PLANNING,
        ACTIVE,
        COMPLETED,
        CANCELLED
    }

    // Mapping from cohort ID to Cohort struct
    mapping(uint256 => Cohort) public cohorts;
    
    // Mapping from cohort ID to array of milestones
    mapping(uint256 => Milestone[]) public cohortMilestones;
    
    // Mapping from mentor address to array of cohort IDs
    mapping(address => uint256[]) public mentorCohorts;

    // Events
    event CohortCreated(uint256 indexed cohortId, string name, address indexed creator);
    event CohortUpdated(uint256 indexed cohortId, CohortStatus status);
    event MilestoneAdded(uint256 indexed cohortId, uint256 indexed milestoneId, string name);
    event MilestoneCompleted(uint256 indexed cohortId, uint256 indexed milestoneId);
    event MentorAssigned(uint256 indexed cohortId, address indexed mentor);
    event MentorRemoved(uint256 indexed cohortId, address indexed mentor);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(COHORT_MANAGER_ROLE, msg.sender);
        _grantRole(MENTOR_ROLE, msg.sender);
    }

    /**
     * @dev Create a new cohort
     * @param name The cohort name
     * @param description The cohort description
     * @param topics Array of topics covered in the cohort
     * @param mentors Array of mentor addresses
     * @param startDate The cohort start date (timestamp)
     * @param endDate The cohort end date (timestamp)
     * @param maxStudents Maximum number of students allowed
     * @return cohortId The created cohort ID
     */
    function createCohort(
        string memory name,
        string memory description,
        string[] memory topics,
        address[] memory mentors,
        uint256 startDate,
        uint256 endDate,
        uint256 maxStudents
    ) external onlyRole(COHORT_MANAGER_ROLE) returns (uint256 cohortId) {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(startDate > block.timestamp, "Start date must be in the future");
        require(endDate > startDate, "End date must be after start date");
        require(maxStudents > 0, "Max students must be greater than 0");

        _cohortIds++;
        cohortId = _cohortIds;

        cohorts[cohortId] = Cohort({
            id: cohortId,
            name: name,
            description: description,
            topics: topics,
            mentors: mentors,
            startDate: startDate,
            endDate: endDate,
            maxStudents: maxStudents,
            currentStudents: 0,
            status: CohortStatus.PLANNING,
            createdDate: block.timestamp,
            lastUpdated: block.timestamp
        });

        // Assign mentors to cohort
        for (uint256 i = 0; i < mentors.length; i++) {
            if (mentors[i] != address(0)) {
                mentorCohorts[mentors[i]].push(cohortId);
                emit MentorAssigned(cohortId, mentors[i]);
            }
        }

        emit CohortCreated(cohortId, name, msg.sender);
    }

    /**
     * @dev Update cohort status
     * @param cohortId The cohort ID
     * @param newStatus The new status
     */
    function updateCohortStatus(uint256 cohortId, CohortStatus newStatus) 
        external 
        onlyRole(COHORT_MANAGER_ROLE) 
    {
        require(cohorts[cohortId].id != 0, "Cohort does not exist");
        
        cohorts[cohortId].status = newStatus;
        cohorts[cohortId].lastUpdated = block.timestamp;

        emit CohortUpdated(cohortId, newStatus);
    }

    /**
     * @dev Add a milestone to a cohort
     * @param cohortId The cohort ID
     * @param name The milestone name
     * @param description The milestone description
     * @param dueDate The milestone due date
     * @param weight The milestone weight (percentage)
     */
    function addMilestone(
        uint256 cohortId,
        string memory name,
        string memory description,
        uint256 dueDate,
        uint256 weight
    ) external onlyRole(COHORT_MANAGER_ROLE) {
        require(cohorts[cohortId].id != 0, "Cohort does not exist");
        require(bytes(name).length > 0, "Name cannot be empty");
        require(weight <= 100, "Weight cannot exceed 100%");

        Milestone memory newMilestone = Milestone({
            id: cohortMilestones[cohortId].length,
            name: name,
            description: description,
            dueDate: dueDate,
            weight: weight,
            isCompleted: false,
            completedDate: 0
        });

        cohortMilestones[cohortId].push(newMilestone);

        emit MilestoneAdded(cohortId, newMilestone.id, name);
    }

    /**
     * @dev Mark a milestone as completed
     * @param cohortId The cohort ID
     * @param milestoneId The milestone ID
     */
    function completeMilestone(uint256 cohortId, uint256 milestoneId) 
        external 
        onlyRole(MENTOR_ROLE) 
    {
        require(cohorts[cohortId].id != 0, "Cohort does not exist");
        require(milestoneId < cohortMilestones[cohortId].length, "Milestone does not exist");
        require(!cohortMilestones[cohortId][milestoneId].isCompleted, "Milestone already completed");

        cohortMilestones[cohortId][milestoneId].isCompleted = true;
        cohortMilestones[cohortId][milestoneId].completedDate = block.timestamp;

        emit MilestoneCompleted(cohortId, milestoneId);
    }

    /**
     * @dev Assign a mentor to a cohort
     * @param cohortId The cohort ID
     * @param mentor The mentor address
     */
    function assignMentor(uint256 cohortId, address mentor) 
        external 
        onlyRole(COHORT_MANAGER_ROLE) 
    {
        require(cohorts[cohortId].id != 0, "Cohort does not exist");
        require(mentor != address(0), "Invalid mentor address");

        // Check if mentor is already assigned
        for (uint256 i = 0; i < cohorts[cohortId].mentors.length; i++) {
            require(cohorts[cohortId].mentors[i] != mentor, "Mentor already assigned");
        }

        cohorts[cohortId].mentors.push(mentor);
        mentorCohorts[mentor].push(cohortId);
        cohorts[cohortId].lastUpdated = block.timestamp;

        emit MentorAssigned(cohortId, mentor);
    }

    /**
     * @dev Remove a mentor from a cohort
     * @param cohortId The cohort ID
     * @param mentor The mentor address
     */
    function removeMentor(uint256 cohortId, address mentor) 
        external 
        onlyRole(COHORT_MANAGER_ROLE) 
    {
        require(cohorts[cohortId].id != 0, "Cohort does not exist");
        
        address[] storage mentors = cohorts[cohortId].mentors;
        for (uint256 i = 0; i < mentors.length; i++) {
            if (mentors[i] == mentor) {
                mentors[i] = mentors[mentors.length - 1];
                mentors.pop();
                break;
            }
        }

        // Remove from mentor's cohort list
        uint256[] storage mentorCohortList = mentorCohorts[mentor];
        for (uint256 i = 0; i < mentorCohortList.length; i++) {
            if (mentorCohortList[i] == cohortId) {
                mentorCohortList[i] = mentorCohortList[mentorCohortList.length - 1];
                mentorCohortList.pop();
                break;
            }
        }

        cohorts[cohortId].lastUpdated = block.timestamp;

        emit MentorRemoved(cohortId, mentor);
    }

    /**
     * @dev Increment student count in a cohort (called by StudentRegistry)
     * @param cohortId The cohort ID
     */
    function incrementStudentCount(uint256 cohortId) external {
        require(cohorts[cohortId].id != 0, "Cohort does not exist");
        require(cohorts[cohortId].currentStudents < cohorts[cohortId].maxStudents, "Cohort is full");
        
        cohorts[cohortId].currentStudents++;
        cohorts[cohortId].lastUpdated = block.timestamp;
    }

    /**
     * @dev Get cohort information
     * @param cohortId The cohort ID
     * @return The cohort struct
     */
    function getCohort(uint256 cohortId) external view returns (Cohort memory) {
        return cohorts[cohortId];
    }

    /**
     * @dev Get all milestones for a cohort
     * @param cohortId The cohort ID
     * @return Array of milestones
     */
    function getCohortMilestones(uint256 cohortId) external view returns (Milestone[] memory) {
        return cohortMilestones[cohortId];
    }

    /**
     * @dev Get cohorts for a mentor
     * @param mentor The mentor address
     * @return Array of cohort IDs
     */
    function getMentorCohorts(address mentor) external view returns (uint256[] memory) {
        return mentorCohorts[mentor];
    }

    /**
     * @dev Get total number of cohorts
     * @return The total number of cohorts
     */
    function getTotalCohorts() external view returns (uint256) {
        return _cohortIds;
    }

    /**
     * @dev Check if a cohort is active
     * @param cohortId The cohort ID
     * @return True if the cohort is active
     */
    function isCohortActive(uint256 cohortId) external view returns (bool) {
        Cohort memory cohort = cohorts[cohortId];
        return cohort.status == CohortStatus.ACTIVE && 
               block.timestamp >= cohort.startDate && 
               block.timestamp <= cohort.endDate;
    }
} 