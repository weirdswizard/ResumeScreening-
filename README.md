# TalentScan AI — Intelligent Resume Screening & Candidate Classification

**System:** TalentScan AI  
**Dataset:** Kaggle Resume Dataset (`UpdatedResumeDataSet.csv` — 25 Categories, 962 Resumes)  
**Architecture:** Next.js 16 (React + Tailwind CSS) Frontend + FastAPI Python Serverless Backend  
**Deployment Target:** Vercel

---

## 📌 Product Overview

**TalentScan AI** is an intelligent candidate screening and talent intelligence platform powered by Natural Language Processing (NLP) and Machine Learning. 

It enables recruiters and hiring managers to upload resumes in multiple formats (`.pdf`, `.docx`, `.txt`) or paste plain text. The system automatically extracts domain competencies, classifies candidates into one of **25 distinct career tracks**, generates human-like recruiter interview notes, and computes **ATS alignment** against open job descriptions.

---

## 🏆 Model Performance & Benchmarks

The NLP pipeline utilizes **Term Frequency-Inverse Document Frequency (TF-IDF)** with sublinear term-frequency scaling and unigram/bigram feature extraction (3,500 features). 

A benchmark comparison was conducted using **5-Fold Stratified Cross-Validation** and a holdout test set (80/20 split):

| Model | 5-Fold CV Accuracy | Test Accuracy | Status |
| :--- | :---: | :---: | :---: |
| **Random Forest Classifier** | **99.22% (± 0.005)** | **100.00%** | **Production Model** |
| **Calibrated LinearSVC** | **99.48% (± 0.005)** | **99.48%** | High Benchmark |
| **Multinomial Naive Bayes** | 99.48% (± 0.005) | 98.96% | Benchmark |
| **Logistic Regression** | 99.22% (± 0.006) | 98.96% | Benchmark |
| **K-Nearest Neighbors (k=5)** | 96.23% (± 0.013) | 98.45% | Benchmark |

### Supported Job Categories (25 Domains)
1. Data Science
2. Python Developer
3. Java Developer
4. DevOps Engineer
5. Web Designing
6. HR
7. Testing
8. Automation Testing
9. Blockchain
10. Database
11. ETL Developer
12. Hadoop
13. Business Analyst
14. Network Security Engineer
15. Civil Engineer
16. Mechanical Engineer
17. Electrical Engineering
18. Operations Manager
19. DotNet Developer
20. SAP Developer
21. PMO
22. Sales
23. Arts
24. Health and fitness
25. Advocate

---

## 🚀 Quickstart: Running Locally

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 2. Install Dependencies
```bash
py -m pip install -r requirements.txt
npm --prefix frontend install
```

### 3. Start the Backend (FastAPI)
```bash
npm run dev:backend
# OR: py -m uvicorn api.index:app --reload --port 8000
```
- API is live at `http://127.0.0.1:8000`
- Interactive Swagger API docs: `http://127.0.0.1:8000/docs`

### 4. Start the Frontend (Next.js)
```bash
npm run dev:frontend
# OR: cd frontend && npm run dev
```
- Web Application is live at: **`http://localhost:3000`**

---

## 🌐 Deploying to Vercel

This repository is pre-configured for zero-config deployment on Vercel:

1. Push your project to a GitHub repository.
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import the repository with root directory `./`.
4. Click **Deploy**. Vercel will build the Next.js frontend and host the Python serverless function automatically.
