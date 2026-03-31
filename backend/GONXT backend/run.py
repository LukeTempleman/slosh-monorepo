#!/usr/bin/env python
"""Run the GONXT Flask application"""

import os
from app import create_app, db
from app.models import User

if __name__ == "__main__":
    config_name = os.getenv("FLASK_ENV", "development")
    app = create_app(config_name)
    
    # Initialize database
    with app.app_context():
        db.create_all()
    
    # Run app
    app.run(
        host="0.0.0.0",
        port=int(os.getenv("PORT", 5000)),
        debug=os.getenv("FLASK_DEBUG", "False").lower() == "true"
    )

