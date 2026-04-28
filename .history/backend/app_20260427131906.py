from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
from config import Config
from models.matcher import ResumeJDMatcher
from api.routes import APIHandler
from database.db_manager import DatabaseManager

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

# Create upload folder
os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)

# Initialize components
matcher = ResumeJDMatcher()
db_manager = DatabaseManager(app)
api_handler = APIHandler(matcher, db_manager, Config)

@app.route('/api/match', methods=['POST'])
def match_resume():
    return api_handler.handle_match(request)

@app.route('/api/history', methods=['GET'])
def get_history():
    return api_handler.handle_history()

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Resume-JD Matcher API is running'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)