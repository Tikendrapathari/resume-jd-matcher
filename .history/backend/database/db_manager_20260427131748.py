from .models import db, MatchHistory

class DatabaseManager:
    def __init__(self, app):
        self.app = app
        db.init_app(app)
        
        with app.app_context():
            db.create_all()
    
    def save_match(self, resume_name, jd_name, match_result):
        """Save match result to database"""
        match = MatchHistory(
            resume_name=resume_name,
            jd_name=jd_name,
            match_score=match_result['total_match'],
            skills_matched=len(match_result['required_skills']) - len(match_result['missing_skills']),
            total_skills=len(match_result['required_skills'])
        )
        
        db.session.add(match)
        db.session.commit()
        return match.id
    
    def get_history(self, limit=50):
        """Get match history"""
        return MatchHistory.query.order_by(
            MatchHistory.created_at.desc()
        ).limit(limit).all()