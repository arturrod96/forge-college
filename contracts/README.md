# Forge College Smart Contracts

A comprehensive smart contract system for managing Web3 education, student funding, and debt tokenization on Scroll Sepolia testnet.

## 🏗️ Architecture Overview

The Forge College smart contract system consists of 8 main contracts that work together to create a complete Web3 education platform:

### Core Contracts

1. **ForgeStudentRegistry.sol** - Student registration and management
2. **CohortManager.sol** - Cohort creation and milestone tracking
3. **KPIOracleMock.sol** - Student performance tracking (testnet mock)
4. **StudentDebtToken.sol** - ERC-721 debt tokenization
5. **IncomeAdvanceVault.sol** - Salary payment management
6. **RepaymentManager.sol** - Debt repayment processing
7. **SponsorVault.sol** - Sponsor funding and impact metrics
8. **MockUSDC.sol** - Test USDC token for Scroll Sepolia

## 📋 Contract Descriptions

### ForgeStudentRegistry.sol
- **Purpose**: Register and manage students, their cohorts, and status
- **Key Features**:
  - Student registration with wallet address and cohort assignment
  - Status management (PENDING, ACTIVE, GRADUATED, DROPPED, SUSPENDED)
  - Cohort reassignment capabilities
  - Event emission for all student operations

### CohortManager.sol
- **Purpose**: Manage educational cohorts, mentors, and milestones
- **Key Features**:
  - Cohort creation with topics, mentors, and date ranges
  - Milestone tracking with weights and completion status
  - Mentor assignment and management
  - Cohort status updates (PLANNING, ACTIVE, COMPLETED, CANCELLED)

### KPIOracleMock.sol
- **Purpose**: Track student performance metrics (testnet version)
- **Key Features**:
  - Four KPI components: Technical, Participation, Project, Attendance
  - Historical score tracking
  - Performance threshold checking
  - Trend analysis (improving/declining/stable)
  - Batch KPI updates for efficiency

### StudentDebtToken.sol
- **Purpose**: Tokenize student debt as ERC-721 NFTs
- **Key Features**:
  - Each token represents a student's advance + repayment terms
  - Metadata includes amount, interest rate, duration, student/cohort IDs
  - Interest calculation and overdue tracking
  - Transferable debt tokens (secondary market simulation)
  - Full repayment tracking and token burning

### IncomeAdvanceVault.sol
- **Purpose**: Manage USDC deposits and salary payments
- **Key Features**:
  - Accept investor deposits
  - Allocate funds to students with monthly salary schedules
  - Payment scheduling and release mechanisms
  - Balance tracking per student
  - Emergency withdrawal capabilities

### RepaymentManager.sol
- **Purpose**: Handle student debt repayments and fund redistribution
- **Key Features**:
  - Accept repayments from students
  - Update debt token status upon repayment
  - Fee collection (0.5% on repayments)
  - Repayment history tracking
  - Force repayment capabilities (testnet only)

### SponsorVault.sol
- **Purpose**: Manage sponsor funding and impact metrics
- **Key Features**:
  - Sponsor registration and management
  - Sponsorship creation for cohorts or individual students
  - Impact metrics tracking (students funded, USD distributed, cohorts supported)
  - Fund allocation and distribution
  - Vesting logic placeholders for future enhancements

### MockUSDC.sol
- **Purpose**: Simulate USDC on Scroll Sepolia testnet
- **Key Features**:
  - 6 decimal precision (like real USDC)
  - 1,000,000 initial supply to deployer
  - Mint/burn functions for testing
  - ERC-20 standard compliance

## 🔐 Access Control

All contracts use OpenZeppelin's `AccessControl` for role-based permissions:

### Roles
- `DEFAULT_ADMIN_ROLE` - Contract owner with full permissions
- `COHORT_MANAGER_ROLE` - Can manage cohorts and students
- `MENTOR_ROLE` - Can complete milestones and assess students
- `ORACLE_ROLE` - Can update student KPIs
- `PAYMENT_MANAGER_ROLE` - Can manage salary payments
- `REPAYMENT_MANAGER_ROLE` - Can process repayments
- `SPONSOR_MANAGER_ROLE` - Can manage sponsors and sponsorships
- `IMPACT_TRACKER_ROLE` - Can update impact metrics
- `MINTER_ROLE` - Can mint debt tokens
- `BURNER_ROLE` - Can burn debt tokens

## 🚀 Deployment

### Prerequisites
1. Node.js and npm installed
2. Hardhat development environment
3. Private key with Scroll Sepolia ETH for gas fees

### Environment Setup
Create a `.env` file in the project root:
```env
PRIVATE_KEY=your_private_key_here
SCROLLSCAN_API_KEY=your_scrollscan_api_key_here
```

### Installation
```bash
npm install
```

### Compilation
```bash
npx hardhat compile
```

### Testing
```bash
npx hardhat test
```

### Deployment to Scroll Sepolia
```bash
npx hardhat run scripts/deploy.js --network scrollSepolia
```

## 📊 Contract Interactions

### Student Lifecycle
1. **Registration**: Student registered in `ForgeStudentRegistry`
2. **Cohort Assignment**: Student assigned to cohort in `CohortManager`
3. **KPI Tracking**: Performance tracked in `KPIOracleMock`
4. **Funding**: Salary allocated in `IncomeAdvanceVault`
5. **Debt Tokenization**: Debt token minted in `StudentDebtToken`
6. **Repayment**: Repayments processed in `RepaymentManager`
7. **Sponsorship**: Optional funding from `SponsorVault`

### Funding Flow
1. Investors deposit USDC to `IncomeAdvanceVault`
2. Funds allocated to students with payment schedules
3. Monthly payments released to students
4. Students make repayments through `RepaymentManager`
5. Repayments update debt token status
6. Returns distributed to investors

## 🔧 Configuration

### Salary Limits
- Minimum: 100 USDC
- Maximum: 5,000 USDC

### Payment Intervals
- Default: 30 days (monthly payments)

### Interest Rates
- Maximum: 50% annual (5,000 basis points)

### Repayment Fees
- 0.5% fee on all repayments

### KPI Scoring
- Range: 0-100 for each component
- Components: Technical, Participation, Project, Attendance

## 🧪 Testing Features

### Testnet-Only Functions
- `forceRepayment()` - Force student repayments
- `setKPI()` - Manually set student performance scores
- `releasePayment()` - Manual salary releases
- `mint()` - Create additional USDC for testing

### Test Scenarios
- Complete student lifecycle
- Cohort management workflows
- Debt token lifecycle
- Payment and repayment flows
- Sponsor funding scenarios

## 🔮 Future Enhancements

### Planned Integrations
- **Superfluid/Sablier**: Real-time salary streaming
- **ZK Attestations**: Off-chain learning proof verification
- **Real USDC**: Mainnet deployment with actual USDC
- **Advanced Vesting**: Time-locked fund releases
- **Secondary Market**: Debt token trading platform

### Scalability Features
- Batch operations for efficiency
- Gas optimization for high-volume operations
- Modular architecture for easy upgrades

## 📝 Events

All contracts emit comprehensive events for:
- Student registration and updates
- Cohort creation and management
- KPI updates and trends
- Debt token minting and burning
- Payment releases and repayments
- Sponsor activities and impact metrics

## 🔒 Security Features

- Reentrancy protection on all external calls
- Access control for all administrative functions
- Input validation and bounds checking
- Safe ERC-20 transfers
- Emergency withdrawal capabilities
- Comprehensive error handling

## 📞 Support

For questions or issues with the smart contracts:
1. Check the test files for usage examples
2. Review the deployment script for setup instructions
3. Examine the event logs for debugging
4. Use Hardhat's console.log for development debugging

## 📄 License

MIT License - see LICENSE file for details. 