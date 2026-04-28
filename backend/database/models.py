from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class MatchHistory(db.Model):
    __tablename__ = 'match_history'
    
    id = db.Column(db.Integer, primary_key=True)
    resume_name = db.Column(db.String(200))
    jd_name = db.Column(db.String(200))
    match_score = db.Column(db.Float)
    skills_matched = db.Column(db.Integer)
    total_skills = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'resume_name': self.resume_name,
            'jd_name': self.jd_name,
            'match_score': self.match_score,
            'skills_matched': self.skills_matched,
            'total_skills': self.total_skills,
            'created_at': self.created_at.isoformat()
        }