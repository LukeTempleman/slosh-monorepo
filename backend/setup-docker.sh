#!/bin/bash

# Linux/Mac setup script for Docker Compose

echo "========================================"
echo "Slosh Multi-Backend Docker Setup"
echo "========================================"
echo ""

echo "[1] Checking Docker and Docker Compose..."
docker --version
docker-compose --version
echo ""

echo "[2] Building images..."
docker-compose -f docker-compose.global.yml build
echo ""

echo "[3] Starting services..."
docker-compose -f docker-compose.global.yml up -d
echo ""

echo "[4] Waiting for services to be healthy..."
sleep 5
echo ""

echo "[5] Checking service status..."
docker-compose -f docker-compose.global.yml ps
echo ""

echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "GONXT Backend:"
echo "   - API: http://localhost:5000"
echo "   - PgAdmin: http://localhost:5050"
echo "   - Database: localhost:5432"
echo ""
echo "Manufacturers Backend:"
echo "   - API: http://localhost:5001"
echo "   - PgAdmin: http://localhost:5051"
echo "   - Database: localhost:5433"
echo ""
echo "Next steps:"
echo "   1. Import Slosh_Multi_Backend_Collection.postman_collection.json to Postman"
echo "   2. Start with \"GONXT Backend -> Authentication -> Register User\""
echo "   3. Then Login and create API keys"
echo ""
