import io
import re
from typing import Optional, List, Dict
import pypdf
import docx

# Regex-based text cleaner for resumes
def clean_resume_text(text: str) -> str:
    """
    Cleans raw resume text:
    - Removes URLs
    - Removes mentions (@username) and hashtags (#tag)
    - Removes email addresses
    - Removes standard punctuation and special characters
    - Removes non-ASCII characters
    - Normalizes whitespace to single spaces and converts to lowercase
    """
    if not text:
        return ""
    
    # Remove URLs
    text = re.sub(r'https?://\S+|www\.\S+', ' ', text)
    # Remove email addresses
    text = re.sub(r'\S+@\S+', ' ', text)
    # Remove RT and cc
    text = re.sub(r'\b(RT|cc|rt|CC)\b', ' ', text)
    # Remove hashtags and mentions
    text = re.sub(r'#\S+', ' ', text)
    text = re.sub(r'@\S+', ' ', text)
    # Remove punctuations and special characters
    text = re.sub(r'[%s]' % re.escape('''!"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~'''), ' ', text)
    # Remove non-ASCII characters
    text = re.sub(r'[^\x00-\x7f]', ' ', text)
    # Collapse multiple whitespaces
    text = re.sub(r'\s+', ' ', text)
    
    return text.strip().lower()

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extracts raw text from a PDF document using pypdf."""
    reader = pypdf.PdfReader(io.BytesIO(file_bytes))
    extracted = []
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            extracted.append(page_text)
    return "\n".join(extracted)

def extract_text_from_docx(file_bytes: bytes) -> str:
    """Extracts raw text from a DOCX document using python-docx."""
    doc = docx.Document(io.BytesIO(file_bytes))
    extracted = [p.text for p in doc.paragraphs if p.text.strip()]
    # Also extract text from any tables
    for table in doc.tables:
        for row in table.rows:
            for cell in row.cells:
                if cell.text.strip():
                    extracted.append(cell.text.strip())
    return "\n".join(extracted)

def extract_text_from_file(file_bytes: bytes, filename: str) -> str:
    """Detects file type and extracts plain text accordingly."""
    filename_lower = filename.lower()
    if filename_lower.endswith(".pdf"):
        return extract_text_from_pdf(file_bytes)
    elif filename_lower.endswith(".docx"):
        return extract_text_from_docx(file_bytes)
    elif filename_lower.endswith(".txt"):
        return file_bytes.decode("utf-8", errors="ignore")
    else:
        # Fallback to UTF-8 text decode
        return file_bytes.decode("utf-8", errors="ignore")

# Domain skill dictionary for skill extraction / keyword matching
SKILL_DICTIONARY: Dict[str, List[str]] = {
    "Programming Languages": [
        "python", "java", "c++", "c#", "c", "javascript", "typescript", "php", 
        "ruby", "swift", "kotlin", "go", "rust", "scala", "r", "dart", "sql", "pl/sql"
    ],
    "Data Science & AI": [
        "machine learning", "deep learning", "nlp", "natural language processing",
        "computer vision", "tensorflow", "pytorch", "keras", "scikit-learn", "pandas",
        "numpy", "matplotlib", "seaborn", "opencv", "transformers", "huggingface",
        "llm", "genai", "bert", "xgboost", "lightgbm", "data mining", "data analysis"
    ],
    "Web & Cloud": [
        "react", "next.js", "angular", "vue", "vue.js", "node.js", "express", 
        "django", "flask", "fastapi", "spring boot", "asp.net", "html5", "css3", 
        "tailwind", "bootstrap", "aws", "azure", "gcp", "docker", "kubernetes",
        "terraform", "ci/cd", "jenkins", "git", "github", "linux"
    ],
    "Databases & Big Data": [
        "mysql", "postgresql", "mongodb", "redis", "elasticsearch", "cassandra", 
        "oracle", "sql server", "hadoop", "spark", "kafka", "hive", "hbase", "snowflake"
    ],
    "Testing & DevOps": [
        "selenium", "junit", "testng", "pytest", "cypress", "postman", "jmeter",
        "ansible", "puppet", "helm", "prometheus", "grafana", "automation testing"
    ],
    "Business & Management": [
        "agile", "scrum", "jira", "pmo", "project management", "stakeholder management",
        "risk management", "business analysis", "tableau", "power bi", "excel", "salesforce"
    ]
}

def extract_skills_from_text(text: str) -> Dict[str, List[str]]:
    """Extracts known technical and domain skills matching keywords in text."""
    lower_text = " " + clean_resume_text(text) + " "
    detected: Dict[str, List[str]] = {}
    
    for category, skills in SKILL_DICTIONARY.items():
        matched = []
        for skill in skills:
            # Word boundary matching for clean detection
            pattern = r'\b' + re.escape(skill) + r'\b'
            if re.search(pattern, lower_text):
                matched.append(skill.title() if len(skill) > 3 else skill.upper())
        if matched:
            detected[category] = sorted(list(set(matched)))
            
    return detected
