from flask import Flask
from flask_sqlalchemy import SQLAlchemy

def create_app():
    app = Flask(__name__)

    app.config['SQALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'

    from .views import main
    app.register_blueprint(main)

    return app