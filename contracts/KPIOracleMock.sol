// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title KPIOracleMock
 * @dev Mock oracle for student KPI tracking on testnet
 * @notice Allows manual setting of student KPIs for testing purposes
 */
contract KPIOracleMock is AccessControl {
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");

    struct StudentKPI {
        uint256 studentId;
        uint8 technicalScore;      // 0-100
        uint8 participationScore;  // 0-100
        uint8 projectScore;        // 0-100
        uint8 attendanceScore;     // 0-100
        uint256 lastUpdated;
        bool isActive;
    }

    // Mapping from student ID to KPI data
    mapping(uint256 => StudentKPI) public studentKPIs;
    
    // Mapping from student ID to array of historical scores
    mapping(uint256 => uint8[]) public historicalScores;

    // Events
    event KPIUpdated(uint256 indexed studentId, uint8 technicalScore, uint8 participationScore, uint8 projectScore, uint8 attendanceScore);
    event KPIAdded(uint256 indexed studentId, address indexed oracle);
    event KPIInactivated(uint256 indexed studentId);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ORACLE_ROLE, msg.sender);
    }

    /**
     * @dev Add or update KPI for a student (TESTNET ONLY)
     * @param studentId The student ID
     * @param technicalScore Technical skills score (0-100)
     * @param participationScore Participation score (0-100)
     * @param projectScore Project completion score (0-100)
     * @param attendanceScore Attendance score (0-100)
     */
    function setKPI(
        uint256 studentId,
        uint8 technicalScore,
        uint8 participationScore,
        uint8 projectScore,
        uint8 attendanceScore
    ) public onlyRole(ORACLE_ROLE) {
        require(studentId > 0, "Invalid student ID");
        require(technicalScore <= 100, "Technical score must be 0-100");
        require(participationScore <= 100, "Participation score must be 0-100");
        require(projectScore <= 100, "Project score must be 0-100");
        require(attendanceScore <= 100, "Attendance score must be 0-100");

        bool isNewKPI = !studentKPIs[studentId].isActive;

        studentKPIs[studentId] = StudentKPI({
            studentId: studentId,
            technicalScore: technicalScore,
            participationScore: participationScore,
            projectScore: projectScore,
            attendanceScore: attendanceScore,
            lastUpdated: block.timestamp,
            isActive: true
        });

        // Store historical average score
        uint8 averageScore = (technicalScore + participationScore + projectScore + attendanceScore) / 4;
        historicalScores[studentId].push(averageScore);

        if (isNewKPI) {
            emit KPIAdded(studentId, msg.sender);
        }
        
        emit KPIUpdated(studentId, technicalScore, participationScore, projectScore, attendanceScore);
    }

    /**
     * @dev Update individual KPI component (TESTNET ONLY)
     * @param studentId The student ID
     * @param component The KPI component to update (0=technical, 1=participation, 2=project, 3=attendance)
     * @param score The new score (0-100)
     */
    function updateKPIComponent(uint256 studentId, uint8 component, uint8 score) 
        external 
        onlyRole(ORACLE_ROLE) 
    {
        require(studentId > 0, "Invalid student ID");
        require(component <= 3, "Invalid component");
        require(score <= 100, "Score must be 0-100");
        require(studentKPIs[studentId].isActive, "Student KPI not found");

        StudentKPI storage kpi = studentKPIs[studentId];
        
        if (component == 0) kpi.technicalScore = score;
        else if (component == 1) kpi.participationScore = score;
        else if (component == 2) kpi.projectScore = score;
        else if (component == 3) kpi.attendanceScore = score;

        kpi.lastUpdated = block.timestamp;

        // Update historical average
        uint8 averageScore = (kpi.technicalScore + kpi.participationScore + kpi.projectScore + kpi.attendanceScore) / 4;
        historicalScores[studentId].push(averageScore);

        emit KPIUpdated(studentId, kpi.technicalScore, kpi.participationScore, kpi.projectScore, kpi.attendanceScore);
    }

    /**
     * @dev Inactivate a student's KPI (TESTNET ONLY)
     * @param studentId The student ID
     */
    function inactivateKPI(uint256 studentId) external onlyRole(ORACLE_ROLE) {
        require(studentId > 0, "Invalid student ID");
        require(studentKPIs[studentId].isActive, "Student KPI already inactive");

        studentKPIs[studentId].isActive = false;
        studentKPIs[studentId].lastUpdated = block.timestamp;

        emit KPIInactivated(studentId);
    }

    /**
     * @dev Get student KPI data
     * @param studentId The student ID
     * @return The student KPI struct
     */
    function getStudentKPI(uint256 studentId) external view returns (StudentKPI memory) {
        return studentKPIs[studentId];
    }

    /**
     * @dev Get student's average score
     * @param studentId The student ID
     * @return The average score (0-100)
     */
    function getAverageScore(uint256 studentId) external view returns (uint8) {
        StudentKPI memory kpi = studentKPIs[studentId];
        require(kpi.isActive, "Student KPI not found");
        
        return (kpi.technicalScore + kpi.participationScore + kpi.projectScore + kpi.attendanceScore) / 4;
    }

    /**
     * @dev Get student's historical scores
     * @param studentId The student ID
     * @return Array of historical average scores
     */
    function getHistoricalScores(uint256 studentId) external view returns (uint8[] memory) {
        return historicalScores[studentId];
    }

    /**
     * @dev Get student's latest average score
     * @param studentId The student ID
     * @return The latest average score
     */
    function getLatestAverageScore(uint256 studentId) external view returns (uint8) {
        uint8[] memory scores = historicalScores[studentId];
        require(scores.length > 0, "No historical scores found");
        return scores[scores.length - 1];
    }

    /**
     * @dev Check if student meets minimum performance threshold
     * @param studentId The student ID
     * @param threshold The minimum average score required
     * @return True if student meets the threshold
     */
    function meetsPerformanceThreshold(uint256 studentId, uint8 threshold) external view returns (bool) {
        StudentKPI memory kpi = studentKPIs[studentId];
        if (!kpi.isActive) return false;
        
        uint8 averageScore = (kpi.technicalScore + kpi.participationScore + kpi.projectScore + kpi.attendanceScore) / 4;
        return averageScore >= threshold;
    }

    /**
     * @dev Get student's performance trend (last 3 scores)
     * @param studentId The student ID
     * @return trend 0=stable, 1=improving, 2=declining
     */
    function getPerformanceTrend(uint256 studentId) external view returns (uint8) {
        uint8[] memory scores = historicalScores[studentId];
        if (scores.length < 3) return 0; // Not enough data

        uint8 latest = scores[scores.length - 1];
        uint8 previous = scores[scores.length - 2];
        uint8 earlier = scores[scores.length - 3];

        if (latest > previous && previous > earlier) return 1; // Improving
        if (latest < previous && previous < earlier) return 2; // Declining
        return 0; // Stable
    }

    /**
     * @dev Batch update multiple student KPIs (TESTNET ONLY)
     * @param studentIds Array of student IDs
     * @param technicalScores Array of technical scores
     * @param participationScores Array of participation scores
     * @param projectScores Array of project scores
     * @param attendanceScores Array of attendance scores
     */
    function batchSetKPI(
        uint256[] memory studentIds,
        uint8[] memory technicalScores,
        uint8[] memory participationScores,
        uint8[] memory projectScores,
        uint8[] memory attendanceScores
    ) external onlyRole(ORACLE_ROLE) {
        require(
            studentIds.length == technicalScores.length &&
            studentIds.length == participationScores.length &&
            studentIds.length == projectScores.length &&
            studentIds.length == attendanceScores.length,
            "Array lengths must match"
        );

        for (uint256 i = 0; i < studentIds.length; i++) {
            setKPI(
                studentIds[i],
                technicalScores[i],
                participationScores[i],
                projectScores[i],
                attendanceScores[i]
            );
        }
    }
} 