from .text_processor import TextProcessor
from .scorer import MatchScorer

class ResumeJDMatcher:
    def __init__(self):
        self.processor = TextProcessor()
        self.weights = {
            'skills': 0.4,
            'experience': 0.2,
            'education': 0.15,
            'certification': 0.15,
            'project': 0.1
        }
        self.scorer = MatchScorer(self.weights)
    
    def parse_resume(self, text):
        """Parse resume and extract information"""
        cleaned_text = self.processor.clean_text(text)
        
        return {
            'skills': self.processor.extract_skills(cleaned_text),
            'experience': self.processor.extract_experience(cleaned_text),
            'education': self.processor.extract_education(cleaned_text),
            'full_text': cleaned_text
        }
    
    def parse_job_description(self, text):
        """Parse job description and extract requirements"""
        cleaned_text = self.processor.clean_text(text)
        
        return {
            'skills': self.processor.extract_skills(cleaned_text),
            'required_experience': self.processor.extract_experience(cleaned_text),
            'required_education': self.processor.extract_education(cleaned_text),
            'full_text': cleaned_text
        }
    
    def match(self, resume_text, jd_text):
        """Match resume against job description"""
        # Parse both documents
        resume_data = self.parse_resume(resume_text)
        jd_data = self.parse_job_description(jd_text)
        
        # Calculate individual scores
        skill_score = self.scorer.calculate_skill_match(
            resume_data['skills'], jd_data['skills']
        )
        
        exp_score = self.scorer.calculate_experience_match(
            resume_data['experience'], jd_data['required_experience']
        )
        
        edu_score = self.scorer.calculate_education_match(
            resume_data['education'], jd_data['required_education']
        )
        
        # Text similarity score
        text_sim_score = self.processor.get_text_similarity(
            resume_data['full_text'], jd_data['full_text']
        )
        
        scores = {
            'skills': skill_score,
            'experience': exp_score,
            'education': edu_score,
            'certification': text_sim_score * 0.8,
            'project': text_sim_score * 0.7
        }
        
        total_score = self.scorer.calculate_total_score(scores)
        
        # Find missing skills
        missing_skills = [
            skill for skill in jd_data['skills'] 
            if skill.lower() not in [s.lower() for s in resume_data['skills']]
        ]
        
        return {
            'total_match': round(total_score, 2),
            'scores': {k: round(v * 100, 2) for k, v in scores.items()},
            'resume_skills': resume_data['skills'],
            'required_skills': jd_data['skills'],
            'missing_skills': missing_skills,
            'experience_gap': max(0, jd_data['required_experience'] - resume_data['experience']),
            'recommendation': self._get_recommendation(total_score, missing_skills)
        }
    
    def _get_recommendation(self, score, missing_skills):
        """Generate recommendation based on score"""
        if score >= 80:
            return "Excellent match! Strongly recommend for interview."
        elif score >= 60:
            return "Good match. Consider interviewing with focus on skill gaps."
        elif score >= 40:
            return f"Moderate match. Key missing skills: {', '.join(missing_skills[:3])}"
        else:
            return "Low match. Significant skill gaps need to be addressed."