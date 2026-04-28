from flask import request, jsonify
from werkzeug.utils import secure_filename
import os
import pdfplumber
from docx import Document

class APIHandler:
    def __init__(self, matcher, db_manager, config):
        self.matcher = matcher
        self.db_manager = db_manager
        self.config = config
    
    def extract_text_from_pdf(self, file_path):
        """Extract text from PDF file"""
        text = ""
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                text += page.extract_text() or ""
        return text
    
    def extract_text_from_docx(self, file_path):
        """Extract text from DOCX file"""
        doc = Document(file_path)
        return "\n".join([paragraph.text for paragraph in doc.paragraphs])
    
    def allowed_file(self, filename):
        """Check if file extension is allowed"""
        return '.' in filename and \
               filename.rsplit('.', 1)[1].lower() in self.config.ALLOWED_EXTENSIONS
    
    def handle_match(self, request):
        """Handle resume-JD matching request"""
        try:
            if 'resume' not in request.files or 'job_description' not in request.files:
                return jsonify({'error': 'Both resume and job description files are required'}), 400
            
            resume_file = request.files['resume']
            jd_file = request.files['job_description']
            
            if resume_file.filename == '' or jd_file.filename == '':
                return jsonify({'error': 'No files selected'}), 400
            
            if not (self.allowed_file(resume_file.filename) and 
                   self.allowed_file(jd_file.filename)):
                return jsonify({'error': 'Invalid file type. Allowed: pdf, docx, txt'}), 400
            
            # Save and process resume
            resume_filename = secure_filename(resume_file.filename)
            resume_path = os.path.join(self.config.UPLOAD_FOLDER, resume_filename)
            resume_file.save(resume_path)
            
            # Save and process JD
            jd_filename = secure_filename(jd_file.filename)
            jd_path = os.path.join(self.config.UPLOAD_FOLDER, jd_filename)
            jd_file.save(jd_path)
            
            # Extract text based on file type
            resume_ext = resume_filename.rsplit('.', 1)[1].lower()
            jd_ext = jd_filename.rsplit('.', 1)[1].lower()
            
            if resume_ext == 'pdf':
                resume_text = self.extract_text_from_pdf(resume_path)
            elif resume_ext == 'docx':
                resume_text = self.extract_text_from_docx(resume_path)
            else:
                with open(resume_path, 'r', encoding='utf-8') as f:
                    resume_text = f.read()
            
            if jd_ext == 'pdf':
                jd_text = self.extract_text_from_pdf(jd_path)
            elif jd_ext == 'docx':
                jd_text = self.extract_text_from_docx(jd_path)
            else:
                with open(jd_path, 'r', encoding='utf-8') as f:
                    jd_text = f.read()
            
            # Perform matching
            match_result = self.matcher.match(resume_text, jd_text)
            
            # Save to database
            match_id = self.db_manager.save_match(
                resume_filename, jd_filename, match_result
            )
            
            match_result['match_id'] = match_id
            
            # Clean up files
            os.remove(resume_path)
            os.remove(jd_path)
            
            return jsonify(match_result)
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    def handle_history(self):
        """Get match history"""
        history = self.db_manager.get_history()
        return jsonify([h.to_dict() for h in history])