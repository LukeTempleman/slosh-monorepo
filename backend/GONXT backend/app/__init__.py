"""GONXT Backend Flask Application"""

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
    from app.routes.auth import auth_bp
    from app.routes.keys import apikey_bp
    from app.routes.codes import codes_bp
    from app.routes.health import health_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(apikey_bp, url_prefix='/api/keys')
    app.register_blueprint(codes_bp, url_prefix='/api/codes')
    app.register_blueprint(health_bp, url_prefix='/api')
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        from flask import jsonify
        return jsonify({"error": "Not found"}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        from flask import jsonify
        return jsonify({"error": "Internal server error"}), 500
    
    # Create tables
    with app.app_context():
        db.create_all()
    
    return app
