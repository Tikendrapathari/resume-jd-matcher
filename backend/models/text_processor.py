import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
import spacy

# Download required NLTK data
nltk.download('stopwords', quiet=True)
nltk.download('punkt', quiet=True)

class TextProcessor:
    def __init__(self):
        self.stop_words = set(stopwords.words('english'))
        self.stemmer = PorterStemmer()
        try:
            self.nlp = spacy.load('en_core_web_sm')
        except:
            import subprocess
            subprocess.run(['python', '-m', 'spacy', 'download', 'en_core_web_sm'])
            self.nlp = spacy.load('en_core_web_sm')
    
    def clean_text(self, text):
        """Clean and preprocess text"""
        text = text.lower()
        text = re.sub(r'[^a-zA-Z\s]', ' ', text)
        text = re.sub(r'\s+', ' ', text)
        return text.strip()
    
    def extract_skills(self, text):
        """Extract technical skills from text"""
        skill_keywords = [
            'python', 'sql', 'tensorflow', 'pytorch', 'scikit-learn', 'pandas',
            'numpy', 'matplotlib', 'seaborn', 'keras', 'nlp', 'computer vision',
            'deep learning', 'machine learning', 'data analysis', 'statistics',
            'excel', 'tableau', 'power bi', 'hadoop', 'spark', 'aws', 'azure',
            'gcp', 'docker', 'kubernetes', 'git', 'jira', 'r', 'java', 'c++',
            'javascript', 'html', 'css', 'flask', 'django', 'fastapi', 'mongodb',
            'postgresql', 'mysql', 'redis', 'elasticsearch', 'kafka', 'airflow'
        ]
        
        text_lower = text.lower()
        found_skills = []
        for skill in skill_keywords:
            if skill in text_lower:
                found_skills.append(skill)
        
        # Extract skills using NER
        doc = self.nlp(text)
        for ent in doc.ents:
            if ent.label_ in ['ORG', 'PRODUCT', 'TECH']:
                found_skills.append(ent.text.lower())
        
        return list(set(found_skills))
    
    def extract_experience(self, text):
        """Extract years of experience"""
        patterns = [
            r'(\d+)\+?\s*(?:years?|yrs?)\s*(?:of)?\s*experience',
            r'experience\s*(?:of)?\s*(\d+)\+?\s*(?:years?|yrs?)',
            r'(\d+)\+?\s*(?:years?|yrs?)\s+experience'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text.lower())
            if match:
                return int(match.group(1))
        
        # Count from employment dates
        date_pattern = r'(19|20)\d{2}'
        dates = re.findall(date_pattern, text)
        if len(dates) >= 2:
            try:
                return int(dates[-1]) - int(dates[0])
            except:
                pass
        return 0
    
    def extract_education(self, text):
        """Extract education information"""
        education_keywords = [
            'bachelor', 'master', 'phd', 'b.tech', 'm.tech', 'b.e', 'm.e',
            'bsc', 'msc', 'bca', 'mca', 'diploma', 'doctorate', 'bs', 'ms'
        ]
        
        found_education = []
        for edu in education_keywords:
            if edu in text.lower():
                found_education.append(edu)
        
        return found_education
    
    def get_text_similarity(self, text1, text2):
        """Calculate similarity between two texts"""
        from sklearn.feature_extraction.text import TfidfVectorizer
        from sklearn.metrics.pairwise import cosine_similarity
        
        vectorizer = TfidfVectorizer(max_features=1000)
        tfidf_matrix = vectorizer.fit_transform([text1, text2])
        similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])
        return similarity[0][0]