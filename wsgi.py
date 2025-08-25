#!/usr/bin/env python3
"""
WSGI entry point for Maze Password Manager
This file is used by Gunicorn to start the Flask application
"""

import os
import sys

# Add the backend directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backend'))

# Import the Flask app
from app import app

if __name__ == "__main__":
    app.run()
