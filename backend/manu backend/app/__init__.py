from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS

db = SQLAlchemy()
jwt = JWTManager()

def create_app(config_name='development'):
    """Application factory"""
    app = Flask(__name__)
    
    # Load configuration
    from config import config
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    CORS(app)
    
    # Register blueprints
    from app.routes import auth_bp, manufacturers_bp, secret_key_bp, health_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(manufacturers_bp, url_prefix='/api/manufacturers')
    app.register_blueprint(secret_key_bp, url_prefix='/api')
    app.register_blueprint(health_bp, url_prefix='/api')
    
    # Create tables
    with app.app_context():
        db.create_all()
    
    return app
