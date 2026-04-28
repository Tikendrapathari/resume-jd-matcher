import numpy as np
from datetime import datetime

class MatchScorer:
    def __init__(self, weights):
        self.weights = weights
    
    def calculate_skill_match(self, resume_skills, jd_skills):
        """Calculate skill matching score"""
        if not jd_skills:
            return 0.0
        
        resume_skills_lower = [s.lower() for s in resume_skills]
        jd_skills_lower = [s.lower() for s in jd_skills]
        
        matched = sum(1 for skill in jd_skills_lower if skill in resume_skills_lower)
        return matched / len(jd_skills)
    
    def calculate_experience_match(self, resume_exp, required_exp):
        """Calculate experience matching score"""
        if required_exp <= 0:
            return 1.0
        if resume_exp >= required_exp:
            return 1.0
        return resume_exp / required_exp
    
    def calculate_education_match(self, resume_edu, required_edu):
        """Calculate education matching score"""
        edu_levels = {
            'phd': 5, 'doctorate': 5,
            'master': 4, 'm.tech': 4, 'msc': 4, 'ms': 4,
            'bachelor': 3, 'b.tech': 3, 'b.e': 3, 'bsc': 3, 'bs': 3,
            'diploma': 2, 'bca': 2,
            'high school': 1
        }
        
        if not required_edu:
            return 1.0
        
        max_resume_score = 0
        for edu in resume_edu:
            for req in required_edu:
                if req.lower() in edu.lower() or edu.lower() in req.lower():
                    score = 1.0
                    max_resume_score = max(max_resume_score, score)
                elif edu.lower() in edu_levels and req.lower() in edu_levels:
                    score = edu_levels[edu.lower()] / edu_levels[req.lower()]
                    max_resume_score = max(max_resume_score, min(score, 1.0))
        
        return max_resume_score if max_resume_score > 0 else 0.3
    
    def calculate_total_score(self, scores):
        """Calculate weighted total score"""
        total = sum(scores[key] * self.weights.get(key, 0) 
                   for key in scores if key in self.weights)
        return total * 100  # Convert to percentage