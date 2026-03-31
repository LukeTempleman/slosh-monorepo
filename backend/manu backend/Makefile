.PHONY: help build up down logs shell migrate test lint format clean

help:
	@echo "Flask PostgreSQL Backend - Available Commands"
	@echo ""
	@echo "Docker Commands:"
	@echo "  make build           - Build Docker images"
	@echo "  make up              - Start containers (development)"
	@echo "  make up-prod         - Start containers (production)"
	@echo "  make down            - Stop and remove containers"
	@echo "  make logs            - View container logs"
	@echo "  make logs-web        - View Flask app logs only"
	@echo "  make logs-db         - View PostgreSQL logs only"
	@echo "  make shell           - Access Flask shell"
	@echo "  make restart         - Restart containers"
	@echo ""
	@echo "Development Commands:"
	@echo "  make venv            - Create virtual environment"
	@echo "  make install         - Install Python dependencies"
	@echo "  make run             - Run Flask app locally"
	@echo "  make migrate         - Create database tables"
	@echo ""
	@echo "Testing & Code Quality:"
	@echo "  make lint            - Run code linter"
	@echo "  make format          - Format code with black"
	@echo "  make test            - Run tests"
	@echo ""
	@echo "Database:"
	@echo "  make db-reset        - Reset database (delete all data)"
	@echo "  make db-backup       - Backup database"
	@echo ""
	@echo "Cleanup:"
	@echo "  make clean           - Remove Python cache and builds"
	@echo "  make clean-all       - Remove everything including volumes"

# Docker commands
build:
	docker-compose build

up:
	docker-compose up -d
	@echo "✓ Services running. Access API at http://localhost:5000"

up-prod:
	docker-compose -f docker-compose.prod.yml up -d
	@echo "✓ Production services running"

down:
	docker-compose down

logs:
	docker-compose logs -f

logs-web:
	docker-compose logs -f web

logs-db:
	docker-compose logs -f db

shell:
	docker-compose exec web flask shell

restart:
	docker-compose restart

# Development commands
venv:
	python -m venv venv

install:
	pip install -r requirements.txt

run:
	python run.py

migrate:
	flask db upgrade

# Database commands
db-reset:
	docker-compose down -v
	@echo "✓ Database reset. Run 'make up' to recreate"

db-backup:
	docker exec slosh_db pg_dump -U slosh_user slosh_db > backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "✓ Database backed up"

# Code quality
lint:
	flake8 app/

format:
	black app/ run.py config.py

test:
	python -m pytest

# Cleanup
clean:
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	find . -type d -name ".pytest_cache" -exec rm -rf {} +
	find . -type d -name ".egg-info" -exec rm -rf {} +
	@echo "✓ Cleaned Python cache"

clean-all: down clean
	docker system prune -f
	@echo "✓ Cleaned all Docker resources"
