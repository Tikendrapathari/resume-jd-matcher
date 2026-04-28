# Resume-Job Description Matcher

An AI-powered application that matches resumes with job descriptions using advanced NLP techniques.

## Features

- 📄 **Multi-format Support**: Upload PDF, DOCX, or TXT files
- 🤖 **AI-Powered Matching**: Uses NLP algorithms for accurate skill matching
- 📊 **Detailed Analysis**: Get category-wise scores and insights
- 🎯 **Skill Gap Analysis**: Identify missing skills and get recommendations
- 📈 **Analytics Dashboard**: Track matching trends and statistics
- 📜 **Match History**: View all previous matches
- 🎨 **Beautiful UI**: Modern design with smooth animations

## Tech Stack

### Backend
- Flask (Python web framework)
- SQLAlchemy (ORM)
- scikit-learn (NLP & ML)
- spaCy & NLTK (Text processing)
- PDFPlumber & python-docx (Document parsing)

### Frontend
- React 18
- Tailwind CSS
- Framer Motion (Animations)
- Recharts (Data visualization)
- Axios (API calls)

## Installation

### Prerequisites
- Python 3.8+
- Node.js 14+
- npm or yarn

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
python app.py