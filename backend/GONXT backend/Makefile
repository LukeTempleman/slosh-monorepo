.PHONY: help install run dev test db-init db-seed db-drop docker-up docker-down docker-logs clean

help:
	@echo "GONXT Backend - Available Commands"
	@echo ""
	@echo "Setup:"
	@echo "  make install          - Install dependencies"
	@echo "  make db-init          - Initialize database"
	@echo "  make db-seed          - Seed database with test data"
	@echo ""
	@echo "Development:"
	@echo "  make run              - Run production server"
	@echo "  make dev              - Run development server with hot reload"
	@echo "  make test             - Run tests"
	@echo ""
	@echo "Database:"
	@echo "  make db-drop          - Drop all database tables"
	@echo ""
	@echo "Docker:"
	@echo "  make docker-up        - Start all services with Docker Compose"
	@echo "  make docker-down      - Stop all services"
	@echo "  make docker-logs      - View Docker Compose logs"
	@echo ""
	@echo "Cleanup:"
	@echo "  make clean            - Remove cache and temp files"

install:
	pip install -r requirements.txt

run:
	python run.py

dev:
	FLASK_ENV=development FLASK_DEBUG=True python run.py

test:
	pytest -v --cov=. --cov-report=html

db-init:
	python -c "from app import create_app, db; app = create_app(); ctx = app.app_context(); ctx.push(); db.create_all(); print('Database initialized!')"

db-seed:
	python -c "from app import create_app; app = create_app(); ctx = app.app_context(); ctx.push(); \
	from models import User, db; \
	admin = User(username='admin', email='admin@gonxt.local', role='admin'); \
	admin.set_password('admin@123'); \
	demo = User(username='demo', email='demo@gonxt.local', role='user'); \
	demo.set_password('demo@123'); \
	db.session.add_all([admin, demo]); \
	db.session.commit(); \
	print('Database seeded!')"

db-drop:
	python -c "from app import create_app, db; app = create_app(); ctx = app.app_context(); ctx.push(); db.drop_all(); print('Database dropped!')"

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f

clean:
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete
	find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".coverage" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name "htmlcov" -exec rm -rf {} + 2>/dev/null || true
