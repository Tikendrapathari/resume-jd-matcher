import re
from datetime import datetime
import hashlib

def generate_file_hash(filename):
    """Generate a unique hash for a file"""
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    return hashlib.md5(f"{filename}{timestamp}".encode()).hexdigest()[:8]

def sanitize_text(text):
    """Sanitize text by removing special characters and extra spaces"""
    text = re.sub(r'[^\w\s\.\,\-\/]', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def calculate_percentage(score):
    """Convert score to percentage"""
    return round(score * 100, 2)

def format_time_ago(timestamp):
    """Format timestamp as time ago string"""
    now = datetime.now()
    diff = now - timestamp
    
    if diff.days > 365:
        return f"{diff.days // 365} years ago"
    elif diff.days > 30:
        return f"{diff.days // 30} months ago"
    elif diff.days > 0:
        return f"{diff.days} days ago"
    elif diff.seconds > 3600:
        return f"{diff.seconds // 3600} hours ago"
    elif diff.seconds > 60:
        return f"{diff.seconds // 60} minutes ago"
    else:
        return "Just now"

def extract_file_extension(filename):
    """Extract file extension from filename"""
    return filename.rsplit('.', 1)[1].lower() if '.' in filename else ''

def validate_file_size(file_size, max_size_mb=10):
    """Validate file size"""
    return file_size <= max_size_mb * 1024 * 1024