#!/bin/bash

# Docker validation and health check script

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}Slosh Docker Validation Script${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""

# Check Docker
echo -e "${YELLOW}[1/5] Checking Docker...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}✗ Docker not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker is installed${NC}"
echo ""

# Check Docker Compose
echo -e "${YELLOW}[2/5] Checking Docker Compose...${NC}"
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}✗ Docker Compose not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker Compose is installed${NC}"
echo ""

# Check services status
echo -e "${YELLOW}[3/5] Checking service status...${NC}"
OUTPUT=$(docker-compose -f docker-compose.global.yml ps 2>&1 || true)

if echo "$OUTPUT" | grep -q "gonxt_flask"; then
    GONXT_STATUS=$(echo "$OUTPUT" | grep "gonxt_flask" | awk '{print $NF}')
    if [[ "$GONXT_STATUS" == "Up"* ]]; then
        echo -e "${GREEN}✓ GONXT Flask: Running${NC}"
    else
        echo -e "${YELLOW}⚠ GONXT Flask: $GONXT_STATUS${NC}"
    fi
else
    echo -e "${YELLOW}⚠ GONXT Flask: Container not found${NC}"
fi

if echo "$OUTPUT" | grep -q "manu_flask"; then
    MANU_STATUS=$(echo "$OUTPUT" | grep "manu_flask" | awk '{print $NF}')
    if [[ "$MANU_STATUS" == "Up"* ]]; then
        echo -e "${GREEN}✓ Manufacturers Flask: Running${NC}"
    else
        echo -e "${YELLOW}⚠ Manufacturers Flask: $MANU_STATUS${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Manufacturers Flask: Container not found${NC}"
fi

if echo "$OUTPUT" | grep -q "gonxt_postgres"; then
    GONXT_DB_STATUS=$(echo "$OUTPUT" | grep "gonxt_postgres" | awk '{print $NF}')
    if [[ "$GONXT_DB_STATUS" == "Up"* ]]; then
        echo -e "${GREEN}✓ GONXT Postgres: Running${NC}"
    else
        echo -e "${YELLOW}⚠ GONXT Postgres: $GONXT_DB_STATUS${NC}"
    fi
else
    echo -e "${YELLOW}⚠ GONXT Postgres: Container not found${NC}"
fi

if echo "$OUTPUT" | grep -q "manu_postgres"; then
    MANU_DB_STATUS=$(echo "$OUTPUT" | grep "manu_postgres" | awk '{print $NF}')
    if [[ "$MANU_DB_STATUS" == "Up"* ]]; then
        echo -e "${GREEN}✓ Manufacturers Postgres: Running${NC}"
    else
        echo -e "${YELLOW}⚠ Manufacturers Postgres: $MANU_DB_STATUS${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Manufacturers Postgres: Container not found${NC}"
fi
echo ""

# Test API endpoints
echo -e "${YELLOW}[4/5] Testing API endpoints...${NC}"

# GONXT health check
if curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓ GONXT Backend (http://localhost:5000/api/health)${NC}"
else
    echo -e "${RED}✗ GONXT Backend not responding${NC}"
fi

# Manufacturers health check
if curl -s http://localhost:5001/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Manufacturers Backend (http://localhost:5001/api/health)${NC}"
else
    echo -e "${RED}✗ Manufacturers Backend not responding${NC}"
fi
echo ""

# Check directories
echo -e "${YELLOW}[5/5] Checking required files...${NC}"

if [ -f "docker-compose.global.yml" ]; then
    echo -e "${GREEN}✓ docker-compose.global.yml${NC}"
else
    echo -e "${RED}✗ docker-compose.global.yml not found${NC}"
fi

if [ -f "Slosh_Multi_Backend_Collection.postman_collection.json" ]; then
    echo -e "${GREEN}✓ Slosh_Multi_Backend_Collection.postman_collection.json${NC}"
else
    echo -e "${RED}✗ Postman collection not found${NC}"
fi

if [ -f "GONXT backend/.env" ]; then
    echo -e "${GREEN}✓ GONXT backend/.env${NC}"
else
    echo -e "${RED}✗ GONXT backend/.env not found${NC}"
fi

if [ -f "manu backend/.env" ]; then
    echo -e "${GREEN}✓ manu backend/.env${NC}"
else
    echo -e "${RED}✗ manu backend/.env not found${NC}"
fi
echo ""

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Validation Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

echo "Services:"
echo "  - GONXT API: http://localhost:5000"
echo "  - GONXT PgAdmin: http://localhost:5050"
echo "  - Manufacturers API: http://localhost:5001"
echo "  - Manufacturers PgAdmin: http://localhost:5051"
echo ""

echo "Next steps:"
echo "  1. If services aren't running, execute: docker-compose -f docker-compose.global.yml up -d"
echo "  2. Import Postman collection: Slosh_Multi_Backend_Collection.postman_collection.json"
echo "  3. Start testing with GONXT Backend > Authentication > Register User"
echo ""
