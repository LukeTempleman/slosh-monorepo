# Slosh Monorepo

This is a combined monorepo containing the Slosh backend and all frontend applications.

## Repository Structure

```
slosh-combined/
├── backend/                    # Backend services
│   ├── GONXT backend/         # GONXT backend service
│   ├── manu backend/          # Manufacturing backend service
│   └── ...                    # Docker configs, scripts, and documentation
├── apps/                      # Frontend applications
│   ├── manufacture/           # Manufacturing frontend
│   ├── risk-assessment/       # Risk assessment frontend
│   └── nfc-scanner/           # NFC scanner frontend
└── README.md                  # This file
```

## Backend

The backend directory contains two main services:

- **GONXT backend**: Core GONXT service
- **manu backend**: Manufacturing-specific backend service

### Backend Documentation

See the following files in the `backend/` directory for detailed information:

- `README_DOCKER_SETUP.md` - Docker setup instructions
- `DOCKER_SETUP_COMPLETE.md` - Complete Docker configuration guide
- `DOCKER_QUICK_REFERENCE.md` - Quick reference for Docker commands
- `DOCKER_POSTMAN_GUIDE.md` - Postman collection guide
- `STATUS_REPORT.md` - Current status and implementation details

### Docker Setup

The backend includes Docker Compose configurations for easy deployment:

```bash
cd backend
./setup-docker.sh    # Linux/Mac
# or
setup-docker.bat     # Windows
```

To validate your Docker setup:

```bash
./validate-docker.sh    # Linux/Mac
# or
validate-docker.bat     # Windows
```

### Postman Collections

Two Postman collections are included:

- `Code_Generation_Flow_Collection.postman_collection.json`
- `Slosh_Multi_Backend_Collection.postman_collection.json`

## Frontend Applications

The monorepo includes three frontend applications:

### 1. Manufacturing App (`apps/manufacture/`)

Manufacturing management application.

**Structure:**
- `components/` - React components
- `pages/` - Application pages
- `services/` - API service layer
- `hooks/` - Custom React hooks
- `types/` - TypeScript type definitions

See `apps/manufacture/README.md` for more details.

### 2. Risk Assessment App (`apps/risk-assessment/`)

Risk assessment and management application.

**Structure:**
- `components/` - React components
- `pages/` - Application pages
- `services/` - API service layer
- `hooks/` - Custom React hooks
- `types/` - TypeScript type definitions

See `apps/risk-assessment/README.md` for more details.

### 3. NFC Scanner App (`apps/nfc-scanner/`)

NFC scanning and tracking application.

**Structure:**
- `components/` - React components
- `pages/` - Application pages
- `services/` - API service layer
- `hooks/` - Custom React hooks
- `types/` - TypeScript type definitions

See `apps/nfc-scanner/README.md` for more details.

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js (for frontend development)
- Git

### Quick Start

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd slosh-combined
   ```

2. **Start the backend services:**
   ```bash
   cd backend
   ./setup-docker.sh
   ```

3. **Start a frontend application:**
   ```bash
   cd apps/manufacture    # or risk-assessment, or nfc-scanner
   npm install
   npm start
   ```

## Development Workflow

### Working on Backend

```bash
cd backend
# Make your changes to GONXT backend or manu backend
# Test using Docker Compose
docker-compose -f docker-compose.global.yml up
```

### Working on Frontend

```bash
cd apps/<app-name>
# Make your changes
# Run development server
npm start
```

## Original Repositories

This monorepo combines the following repositories:

- **Backend**: https://github.com/SupportGonxt/Slosh-backend-.git
- **Manufacture Frontend**: https://github.com/SupportGonxt/veritas-manufacture.git
- **Risk Assessment Frontend**: https://github.com/SupportGonxt/veritas-risk-assessment.git
- **NFC Scanner Frontend**: https://github.com/SupportGonxt/veritas-NFC-scanner-.git

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

[Add your license information here]
