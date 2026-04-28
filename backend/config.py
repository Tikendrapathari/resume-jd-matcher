import os

class Config:
    SECRET_KEY = 'your-secret-key-here'
    UPLOAD_FOLDER = 'uploads'
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    ALLOWED_EXTENSIONS = {'pdf', 'docx', 'txt'}
    DATABASE_URL = 'sqlite:///resume_matcher.db'
    
    # NLP Settings
    USE_GPU = False
    BATCH_SIZE = 32
    
    # Matching weights
    SKILL_WEIGHT = 0.4
    EXPERIENCE_WEIGHT = 0.2
    EDUCATION_WEIGHT = 0.15
    CERTIFICATION_WEIGHT = 0.15
    PROJECT_WEIGHT = 0.1