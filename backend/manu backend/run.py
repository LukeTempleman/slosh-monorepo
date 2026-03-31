import os
from dotenv import load_dotenv
from app import create_app, db
from app.models import User

load_dotenv()

app = create_app(os.getenv('FLASK_ENV', 'development'))

@app.shell_context_processor
def make_shell_context():
    """Create application context for shell"""
    return {'db': db, 'User': User}

if __name__ == '__main__':
    # Initialize database
    with app.app_context():
        db.create_all()
    
    app.run(
        debug=os.getenv('FLASK_DEBUG', 'True').lower() == 'true',
        host='0.0.0.0',
        port=int(os.getenv('PORT', 5000))
    )
