#!/bin/bash

echo "🚀 Flask PostgreSQL Backend Docker Setup Test"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check Docker
echo "📦 Checking Docker..."
if ! command -v docker &> /dev/null; then
    echo -e "${RED}✗ Docker is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker found${NC}"

# Check Docker Compose
echo "📦 Checking Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}✗ Docker Compose is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker Compose found${NC}"

# Build images
echo ""
echo "🔨 Building Docker images..."
docker-compose build

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Build failed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Build successful${NC}"

# Start services
echo ""
echo "▶️  Starting services..."
docker-compose up -d

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Failed to start services${NC}"
    exit 1
fi

# Wait for services
echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if services are running
echo ""
echo "🔍 Checking service health..."
docker-compose ps

# Test API
echo ""
echo "🧪 Testing API..."
sleep 5

STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/auth/me)

if [ $STATUS -eq 401 ]; then
    echo -e "${GREEN}✓ API is responding (401 expected without token)${NC}"
elif [ $STATUS -eq 200 ]; then
    echo -e "${GREEN}✓ API is responding (200)${NC}"
else
    echo -e "${RED}✗ API returned status $STATUS${NC}"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "  1. Register a user:"
echo "     curl -X POST http://localhost:5000/api/auth/register \\"
echo "       -H 'Content-Type: application/json' \\"
echo "       -d '{\"username\":\"admin\",\"email\":\"admin@example.com\",\"password\":\"pass123\",\"role\":\"admin\"}'"
echo ""
echo "  2. Login:"
echo "     curl -X POST http://localhost:5000/api/auth/login \\"
echo "       -H 'Content-Type: application/json' \\"
echo "       -d '{\"username\":\"admin\",\"password\":\"pass123\"}'"
echo ""
echo "  3. View logs:"
echo "     docker-compose logs -f web"
echo ""
echo "  4. Stop services:"
echo "     docker-compose down"
