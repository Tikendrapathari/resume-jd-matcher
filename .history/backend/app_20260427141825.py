from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import re
import nltk
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pdfplumber
from docx import Document
from werkzeug.utils import secure_filename
from datetime import datetime
import traceback

# Download NLTK data (run once)
try:
    nltk.data.find('tokenizers/punkt')
except:
    nltk.download('punkt', quiet=True)
try:
    nltk.data.find('corpora/stopwords')
except:
    nltk.download('stopwords', quiet=True)

app = Flask(__name__)
CORS(app)  # Allow all CORS for development

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'docx', 'txt'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max

# Create uploads folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Store match history
match_history = []

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_text_from_pdf(file_path):
    """Extract text from PDF file"""
    text = ""
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        print(f"PDF extraction error: {str(e)}")
    return text

def extract_text_from_docx(file_path):
    """Extract text from DOCX file"""
    text = ""
    try:
        doc = Document(file_path)
        for paragraph in doc.paragraphs:
            if paragraph.text:
                text += paragraph.text + "\n"
    except Exception as e:
        print(f"DOCX extraction error: {str(e)}")
    return text

def preprocess_text(text):
    """Clean and preprocess text"""
    if not text:
        return ""
    text = text.lower()
    text = re.sub(r'[^a-zA-Z0-9\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    try:
        stop_words = set(stopwords.words('english'))
        words = text.split()
        words = [word for word in words if word not in stop_words and len(word) > 2]
        return ' '.join(words[:5000])
    except:
        return text[:5000]

def extract_skills(text):
    """Extract technical skills from text"""
    skill_keywords = [
        'python', 'sql', 'tensorflow', 'pytorch', 'scikit-learn', 'pandas',
        'numpy', 'matplotlib', 'seaborn', 'keras', 'nlp', 'deep learning',
        'machine learning', 'data analysis', 'statistics', 'excel', 'tableau',
        'power bi', 'hadoop', 'spark', 'aws', 'azure', 'gcp', 'docker',
        'kubernetes', 'git', 'java', 'javascript', 'react', 'flask', 'django',
        'mongodb', 'postgresql', 'mysql', 'redis', 'airflow', 'llm', 'langchain',
        'data science', 'analytics', 'visualization', 'r', 'scala', 'spss',
        'sas', 'excel vba', 'looker', 'redshift', 'bigquery', 'snowflake'
    ]
    text_lower = text.lower()
    found_skills = []
    for skill in skill_keywords:
        if skill in text_lower:
            found_skills.append(skill)
    return list(set(found_skills))

def extract_experience(text):
    """Extract years of experience from text"""
    patterns = [
        r'(\d+)\+?\s*(?:years?|yrs?)\s*(?:of)?\s*experience',
        r'experience\s*(?:of)?\s*(\d+)\+?\s*(?:years?|yrs?)',
        r'(\d+)\+?\s*year',
        r'(\d+)\+?\s*yr',
        r'(\d+)\s*\+\s*years'
    ]
    text_lower = text.lower()
    for pattern in patterns:
        match = re.search(pattern, text_lower)
        if match:
            try:
                return int(match.group(1))
            except:
                pass
    
    # Look for employment date ranges
    years = re.findall(r'(19|20)\d{2}', text)
    if len(years) >= 2:
        try:
            years_int = [int(y) for y in years]
            return max(years_int) - min(years_int)
        except:
            pass
    return 0

def calculate_match_score(resume_text, jd_text):
    """Calculate match score between resume and job description"""
    
    if not resume_text or not jd_text:
        return {
            'total_match': 0,
            'similarity_score': 0,
            'skill_score': 0,
            'experience_score': 0,
            'resume_skills': [],
            'required_skills': [],
            'missing_skills': [],
            'experience_gap': 0,
            'scores': {
                'skills': 0,
                'experience': 0,
                'education': 0,
                'certification': 0,
                'project': 0
            },
            'recommendation': "Could not extract text from files. Please check file format."
        }
    
    # Process texts
    resume_clean = preprocess_text(resume_text)
    jd_clean = preprocess_text(jd_text)
    
    # Calculate text similarity
    try:
        vectorizer = TfidfVectorizer(max_features=500, stop_words='english')
        tfidf_matrix = vectorizer.fit_transform([resume_clean, jd_clean])
        similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
    except:
        similarity = 0
    
    # Extract and compare skills
    resume_skills = extract_skills(resume_text)
    jd_skills = extract_skills(jd_text)
    
    if jd_skills:
        matched_skills = sum(1 for skill in jd_skills if skill in resume_skills)
        skill_score = matched_skills / len(jd_skills)
    else:
        skill_score = 0.5
        jd_skills = resume_skills[:5] if resume_skills else []
    
    # Extract and compare experience
    resume_exp = extract_experience(resume_text)
    jd_exp = extract_experience(jd_text)
    
    if jd_exp > 0:
        exp_score = min(1.0, resume_exp / jd_exp)
    else:
        exp_score = 0.5
    
    # Calculate total score
    total_score = (similarity * 0.3 + skill_score * 0.5 + exp_score * 0.2) * 100
    
    missing_skills = [skill for skill in jd_skills if skill not in resume_skills]
    
    # Generate recommendation
    if total_score >= 80:
        recommendation = "✅ Excellent match! Strongly recommend for interview."
    elif total_score >= 60:
        recommendation = "👍 Good match. Consider interviewing with focus on skill gaps."
    elif total_score >= 40:
        rec_skills = ', '.join(missing_skills[:3]) if missing_skills else "specific technical areas"
        recommendation = f"⚠️ Moderate match. Key missing skills: {rec_skills}"
    else:
        recommendation = "❌ Low match. Significant skill gaps need to be addressed."
    
    return {
        'total_match': round(total_score, 2),
        'similarity_score': round(similarity * 100, 2),
        'skill_score': round(skill_score * 100, 2),
        'experience_score': round(exp_score * 100, 2),
        'resume_skills': resume_skills,
        'required_skills': jd_skills,
        'missing_skills': missing_skills,
        'experience_gap': max(0, jd_exp - resume_exp),
        'scores': {
            'skills': round(skill_score * 100, 2),
            'experience': round(exp_score * 100, 2),
            'education': round(similarity * 100 * 0.8, 2),
            'certification': round(similarity * 100 * 0.7, 2),
            'project': round(similarity * 100 * 0.6, 2)
        },
        'recommendation': recommendation
    }

# API Routes
@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'Resume-JD Matcher API is running',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/match', methods=['POST'])
def match_resume():
    """Match resume with job description"""
    try:
        # Check if files are present
        if 'resume' not in request.files:
            return jsonify({'error': 'Resume file is required'}), 400
        if 'job_description' not in request.files:
            return jsonify({'error': 'Job description file is required'}), 400
        
        resume_file = request.files['resume']
        jd_file = request.files['job_description']
        
        # Check if files are selected
        if resume_file.filename == '':
            return jsonify({'error': 'No resume file selected'}), 400
        if jd_file.filename == '':
            return jsonify({'error': 'No job description file selected'}), 400
        
        # Check file types
        if not allowed_file(resume_file.filename):
            return jsonify({'error': f'Invalid resume file type. Allowed: {", ".join(ALLOWED_EXTENSIONS)}'}), 400
        if not allowed_file(jd_file.filename):
            return jsonify({'error': f'Invalid job description file type. Allowed: {", ".join(ALLOWED_EXTENSIONS)}'}), 400
        
        # Save files temporarily
        resume_filename = secure_filename(resume_file.filename)
        jd_filename = secure_filename(jd_file.filename)
        resume_path = os.path.join(app.config['UPLOAD_FOLDER'], resume_filename)
        jd_path = os.path.join(app.config['UPLOAD_FOLDER'], jd_filename)
        
        resume_file.save(resume_path)
        jd_file.save(jd_path)
        
        # Extract file extensions
        resume_ext = resume_filename.rsplit('.', 1)[1].lower()
        jd_ext = jd_filename.rsplit('.', 1)[1].lower()
        
        # Extract text from files
        try:
            if resume_ext == 'pdf':
                resume_text = extract_text_from_pdf(resume_path)
            elif resume_ext == 'docx':
                resume_text = extract_text_from_docx(resume_path)
            else:
                with open(resume_path, 'r', encoding='utf-8', errors='ignore') as f:
                    resume_text = f.read()
            
            if jd_ext == 'pdf':
                jd_text = extract_text_from_pdf(jd_path)
            elif jd_ext == 'docx':
                jd_text = extract_text_from_docx(jd_path)
            else:
                with open(jd_path, 'r', encoding='utf-8', errors='ignore') as f:
                    jd_text = f.read()
        except Exception as e:
            return jsonify({'error': f'Error reading files: {str(e)}'}), 500
        
        # Calculate match score
        result = calculate_match_score(resume_text, jd_text)
        
        # Save to history
        history_entry = {
            'id': len(match_history) + 1,
            'resume_name': resume_filename,
            'jd_name': jd_filename,
            'match_score': result['total_match'],
            'skills_matched': len(result['required_skills']) - len(result['missing_skills']),
            'total_skills': len(result['required_skills']),
            'created_at': datetime.now().isoformat()
        }
        match_history.insert(0, history_entry)
        
        # Keep only last 50 records
        while len(match_history) > 50:
            match_history.pop()
        
        # Clean up temporary files
        try:
            os.remove(resume_path)
            os.remove(jd_path)
        except:
            pass
        
        return jsonify(result)
    
    except Exception as e:
        print(f"Error in match_resume: {str(e)}")
        print(traceback.format_exc())
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/api/history', methods=['GET'])
def get_history():
    """Get match history"""
    return jsonify(match_history)

# Main entry point
if __name__ == '__main__':
    print("=" * 60)
    print("🚀 Resume-JD Matcher Backend Server")
    print("=" * 60)
    print(f"📁 Upload folder: {os.path.abspath(UPLOAD_FOLDER)}")
    print(f"📊 Max file size: 16MB")
    print(f"✅ Allowed formats: PDF, DOCX, TXT")
    print(f"🌐 Server URL: http://localhost:5000")
    print(f"🩺 Health check: http://localhost:5000/api/health")
    print("=" * 60)
    print("Press CTRL+C to stop the server")
    print("=" * 60)
    app.run(debug=True, port=5000, host='0.0.0.0')