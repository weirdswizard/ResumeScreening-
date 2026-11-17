"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  UploadCloud,
  FileText,
  Brain,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Layers,
  Award,
  BarChart3,
  Sparkles,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  ShieldCheck,
  FileCheck,
  UserCheck,
  Lightbulb,
  Target,
  ArrowRight,
  TrendingUp,
  Check,
  Compass,
  Building2,
  Users,
  Sun,
  Moon,
  X
} from "lucide-react";

interface TopCategory {
  category: string;
  probability: number;
}

interface AtsMatch {
  score: number;
  matched_skills: string[];
  missing_skills: string[];
  jd_skills_detected: Record<string, string[]>;
}

interface HumanAssessment {
  verdict: string;
  verdict_color: string;
  narrative: string;
  actionable_tips: string[];
  skill_count: number;
}

interface ScreenResponse {
  filename: string;
  predicted_category: string;
  confidence: number;
  top_categories: TopCategory[];
  detected_skills: Record<string, string[]>;
  word_count: number;
  character_count: number;
  ats_match: AtsMatch | null;
  assessment?: HumanAssessment;
  cleaned_preview: string;
}

const SAMPLE_RESUMES = {
  data_scientist: `ALEX CHEN
Email: alex.chen@example.com | San Francisco, CA
LinkedIn: linkedin.com/in/alexchen-ai | GitHub: github.com/alexchen-data

PROFESSIONAL SUMMARY:
Senior Data Scientist with 5+ years of experience delivering end-to-end machine learning, predictive modeling, and NLP applications. Proven background in designing large-scale statistical pipelines, fine-tuning neural networks, and deploying real-time inference microservices.

TECHNICAL COMPETENCIES:
- Languages: Python, SQL, R, C++
- ML & Deep Learning: Scikit-learn, TensorFlow, PyTorch, Keras, Pandas, NumPy, NLP, Transformers, BERT, HuggingFace
- Cloud & MLOps: AWS (SageMaker, S3), Docker, Git, FastAPI, CI/CD, MLflow

EXPERIENCE:
Staff Data Scientist | Horizon Analytics (2021 - Present)
- Designed automated document understanding and classification systems utilizing TF-IDF and ensemble classifiers, cutting processing time by 80%.
- Fine-tuned transformer architectures for multi-class taxonomy classification across 25 industry domains with 98.7% test precision.
- Engineered high-throughput REST APIs handling 4M+ predictive queries daily.

Data Science Associate | Nexa Corp (2019 - 2021)
- Developed customer churn prediction pipelines and time-series forecasting models using Pandas, XGBoost, and Scikit-Learn.
- Built interactive analytics dashboards visualizing model telemetry and hiring funnel conversions.

EDUCATION:
B.S. in Computer Science & Applied Statistics`,

  java_developer: `MARCUS VANCE
Email: marcus.vance@example.com | Austin, TX
LinkedIn: linkedin.com/in/marcusvance-dev

PROFESSIONAL SUMMARY:
Lead Java Backend Engineer with 6+ years of expertise in distributed system architecture, microservices design, and enterprise cloud migrations. Passionate about high-throughput messaging, transactional integrity, and clean code.

TECHNICAL COMPETENCIES:
- Languages: Java 17, SQL, JavaScript
- Frameworks: Spring Boot, Spring Cloud, Hibernate ORM, RESTful Web Services, Microservices, Maven
- Databases: PostgreSQL, MySQL, Oracle DB, Redis
- Distributed Systems & Cloud: Apache Kafka, RabbitMQ, Docker, Kubernetes, AWS, Jenkins CI/CD

EXPERIENCE:
Senior Backend Developer | Vanguard FinTech (2021 - Present)
- Architected payment orchestration microservices in Spring Boot and Kafka, supporting 5,000+ financial transactions per second.
- Reduced PostgreSQL query latency by 45% via index restructuring and Redis multi-tier caching.
- Enforced OAuth2 and OpenID Connect authorization across 30+ internal banking services.

Software Engineer | BlueStone Systems (2018 - 2021)
- Engineered scalable REST APIs for supply-chain management using Java, Hibernate, and Oracle DB.
- Implemented automated integration test suites with JUnit and Mockito maintaining 90% branch coverage.

EDUCATION:
B.S. in Software Engineering`,

  devops_engineer: `SARAH JENKINS
Email: sarah.jenkins@example.com | Seattle, WA
LinkedIn: linkedin.com/in/sarahjenkins-cloud

PROFESSIONAL SUMMARY:
Senior DevOps & Cloud Platform Engineer with 5 years experience specializing in Kubernetes orchestration, Infrastructure as Code (Terraform), multi-cloud automation, and robust CI/CD pipelines.

TECHNICAL COMPETENCIES:
- Cloud Platforms: AWS, Microsoft Azure, Google Cloud (GCP)
- Containerization: Docker, Kubernetes, Helm, Amazon EKS, Istio
- CI/CD & IaC: Terraform, Ansible, GitHub Actions, GitLab CI, Jenkins
- Observability: Prometheus, Grafana, Datadog, ELK Stack
- Scripting & Systems: Python, Bash, Linux (Ubuntu, RHEL)

EXPERIENCE:
Lead Cloud Infrastructure Engineer | CloudSphere Networks (2021 - Present)
- Managed production Kubernetes clusters running 350+ microservices with 99.99% service uptime.
- Transitioned 100% of cloud resources to modular Terraform templates, cutting environment provisioning from 3 days to 15 minutes.
- Implemented comprehensive Prometheus alerting and Grafana dashboards for proactive incident resolution.

DevOps Engineer | Apex Solutions (2019 - 2021)
- Automated deployment pipelines using GitHub Actions, enabling development teams to deploy 12x daily with automated rollback.

EDUCATION:
B.S. in Computer Engineering`,

  hr_specialist: `ELENA ROSTOVA
Email: elena.rostova@example.com | Chicago, IL
LinkedIn: linkedin.com/in/elenarostova-hr

PROFESSIONAL SUMMARY:
People Operations & Talent Acquisition Manager with 6+ years driving full-cycle technical recruiting, employer branding, performance review structures, and employee engagement in high-growth tech companies.

AREAS OF EXPERTISE:
- Full-Lifecycle Talent Acquisition, Technical Recruiting, Executive Search
- Candidate Assessment, Onboarding Optimization, HR Compliance
- Performance Management, Compensation Benchmarking, Employee Relations
- HRIS & Tools: Workday, Greenhouse, Lever, BambooHR, LinkedIn Recruiter, Excel

EXPERIENCE:
Talent Acquisition Manager | Peak Ventures (2021 - Present)
- Spearheaded hiring strategy across Engineering, Product, and Data teams, scaling workforce from 80 to 260 employees within 18 months.
- Reduced average time-to-hire from 48 days to 24 days while elevating offer acceptance rate to 92%.
- Designed structured competency-based interview rubrics reducing early attrition by 22%.

Senior Recruiter | TalentForge Partners (2018 - 2021)
- Managed full-cycle recruiting for 40+ technical positions annually across cloud and engineering divisions.

EDUCATION:
B.A. in Human Resource Management & Organizational Psychology`
};

const SAMPLE_JOB_DESCRIPTION = `Role: Senior Machine Learning / NLP Engineer
Company: Apex Artificial Intelligence
Location: Remote / Hybrid

About the Role:
We are looking for an experienced Machine Learning & NLP Engineer to lead the design and deployment of natural language systems, resume understanding pipelines, and predictive algorithms.

Key Requirements:
- 3+ years experience with Python, Machine Learning, Deep Learning, and NLP.
- Proven proficiency with Scikit-learn, TensorFlow, PyTorch, Pandas, and NumPy.
- Experience building production REST APIs with FastAPI or Flask and containerizing with Docker.
- Demonstrated background in text classification, TF-IDF vectorization, and model evaluation.
- Strong team collaboration and technical communication skills.`;

export default function Home() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [activeTab, setActiveTab] = useState<"upload" | "paste">("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [includeAts, setIncludeAts] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScreenResponse | null>(null);
  const [showRolesModal, setShowRolesModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "dark" | "light" | null;
    if (savedTheme === "light") {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    } else {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setError(null);
    }
  };

  const loadSample = (key: keyof typeof SAMPLE_RESUMES) => {
    setActiveTab("paste");
    setResumeText(SAMPLE_RESUMES[key]);
    setSelectedFile(null);
    setError(null);
  };

  const handleScreenResume = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const formData = new FormData();

      if (activeTab === "upload") {
        if (!selectedFile) {
          setError("Please select or drop a resume file (.pdf, .docx, or .txt).");
          setIsLoading(false);
          return;
        }
        formData.append("file", selectedFile);
      } else {
        if (!resumeText.trim()) {
          setError("Please paste candidate resume text to evaluate.");
          setIsLoading(false);
          return;
        }
        formData.append("text", resumeText);
      }

      if (includeAts && jobDescription.trim()) {
        formData.append("job_description", jobDescription.trim());
      }

      const res = await fetch("/api/screen", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Unable to complete resume screening.");
      }

      setResult(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred while communicating with the service.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetAll = () => {
    setSelectedFile(null);
    setResumeText("");
    setJobDescription("");
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-200 antialiased w-full max-w-full overflow-x-hidden">
      {/* Responsive Navigation Header */}
      <header className="border-b border-slate-200/90 bg-white/90 dark:border-slate-800/80 dark:bg-slate-900/90 backdrop-blur-xl sticky top-0 z-50 transition-colors duration-200 w-full">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo & Product Name */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="p-2 sm:p-2.5 bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 rounded-xl shadow-lg shadow-indigo-500/25 border border-indigo-400/20 text-white shrink-0">
              <Brain className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-sm sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white truncate">
                  TalentScan<span className="text-indigo-600 dark:text-indigo-400 font-extrabold">.ai</span>
                </span>
                <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider shrink-0">
                  Live
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 truncate hidden xs:block">
                AI Resume Screener &amp; Talent Platform
              </p>
            </div>
          </div>

          {/* Navigation Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 text-xs shrink-0">
            <button
              type="button"
              onClick={() => setShowRolesModal(!showRolesModal)}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 transition flex items-center gap-1.5 font-medium cursor-pointer shadow-sm text-[11px] sm:text-xs"
            >
              <Compass className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span><span className="hidden sm:inline">Supported </span>Roles (25)</span>
            </button>

            {/* Dark / Light Mode Switcher */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-1.5 sm:p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 transition flex items-center justify-center cursor-pointer shadow-sm group"
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600 group-hover:-rotate-12 transition-transform duration-300" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Supported Roles Drawer */}
      {showRolesModal && (
        <div className="bg-white dark:bg-slate-900 border-b border-indigo-500/30 px-3.5 sm:px-4 py-4 sm:py-5 animate-fadeIn shadow-xl backdrop-blur-md transition-colors duration-200 max-h-[80vh] overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h2 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-indigo-200">
                  25 Supported Candidate Job Tracks
                </h2>
              </div>
              <button
                onClick={() => setShowRolesModal(false)}
                className="p-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Our natural language classifier automatically recognizes competencies across these 25 domains:
            </p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
              {[
                "Data Science", "Python Developer", "Java Developer", "DevOps Engineer",
                "Web Designing", "HR", "Testing", "Automation Testing", "Blockchain",
                "Database", "ETL Developer", "Hadoop", "Business Analyst", "Network Security Engineer",
                "Civil Engineer", "Mechanical Engineer", "Electrical Engineering", "Operations Manager",
                "DotNet Developer", "SAP Developer", "PMO", "Sales", "Arts", "Health and fitness", "Advocate"
              ].map((role) => (
                <span
                  key={role}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/60 text-slate-800 dark:text-slate-200 text-[11px] sm:text-xs font-medium"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-8 flex-1 w-full space-y-6 sm:space-y-8">
        {/* Human-Centered Hero Section */}
        <div className="text-center max-w-2xl mx-auto pt-1 sm:pt-2 space-y-2.5 sm:space-y-3">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-400 text-[11px] sm:text-xs font-semibold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span>AI Talent Intelligence for Modern Hiring</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug sm:leading-tight">
            Find the right role for every candidate — <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-300 dark:to-pink-400 bg-clip-text text-transparent">in seconds</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-base leading-relaxed px-1">
            Drop in candidate CVs or resumes to automatically reveal their strongest domain fit, extract proven technical skills, and generate actionable recruiter interview notes.
          </p>

          {/* 3 Step Indicator (Responsive Wrapping) */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 pt-1 font-medium">
            <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300"><Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> 1. Upload CV</span>
            <span className="text-slate-400 dark:text-slate-600 hidden xs:inline">→</span>
            <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300"><Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> 2. AI Analysis</span>
            <span className="text-slate-400 dark:text-slate-600 hidden xs:inline">→</span>
            <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300"><Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> 3. Interview Insights</span>
          </div>
        </div>

        {/* Workspace Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-start">
          {/* Left Column: Input Form (7 cols) */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/90 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl shadow-slate-200/50 dark:shadow-2xl backdrop-blur-md transition-colors duration-200">
              {/* Tab Selector & Sample Buttons */}
              <div className="flex flex-col gap-3 border-b border-slate-200 dark:border-slate-800 pb-4 sm:pb-5 mb-4 sm:mb-5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 w-full sm:w-fit">
                    <button
                      type="button"
                      onClick={() => setActiveTab("upload")}
                      className={`flex-1 sm:flex-initial px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer ${
                        activeTab === "upload"
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                          : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                      }`}
                    >
                      <UploadCloud className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Upload Document
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("paste")}
                      className={`flex-1 sm:flex-initial px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer ${
                        activeTab === "paste"
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                          : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Paste Text
                    </button>
                  </div>
                </div>

                {/* Quick Sample Selector */}
                <div className="flex items-center flex-wrap gap-1 sm:gap-1.5 text-xs pt-1">
                  <span className="text-slate-500 font-medium text-[10px] sm:text-[11px] mr-0.5">Try sample:</span>
                  <button
                    type="button"
                    onClick={() => loadSample("data_scientist")}
                    className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/90 dark:hover:bg-slate-700 text-indigo-700 dark:text-indigo-300 rounded-md sm:rounded-lg text-[10px] sm:text-[11px] font-medium transition cursor-pointer border border-slate-200 dark:border-slate-700/60"
                  >
                    Alex (Data Science)
                  </button>
                  <button
                    type="button"
                    onClick={() => loadSample("java_developer")}
                    className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/90 dark:hover:bg-slate-700 text-indigo-700 dark:text-indigo-300 rounded-md sm:rounded-lg text-[10px] sm:text-[11px] font-medium transition cursor-pointer border border-slate-200 dark:border-slate-700/60"
                  >
                    Marcus (Java)
                  </button>
                  <button
                    type="button"
                    onClick={() => loadSample("devops_engineer")}
                    className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/90 dark:hover:bg-slate-700 text-indigo-700 dark:text-indigo-300 rounded-md sm:rounded-lg text-[10px] sm:text-[11px] font-medium transition cursor-pointer border border-slate-200 dark:border-slate-700/60"
                  >
                    Sarah (DevOps)
                  </button>
                </div>
              </div>

              {/* Upload Tab View */}
              {activeTab === "upload" && (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-indigo-500/80 dark:border-slate-700 dark:hover:border-indigo-500/80 rounded-xl sm:rounded-2xl p-5 sm:p-8 text-center cursor-pointer transition bg-slate-50/60 hover:bg-indigo-50/50 dark:bg-slate-950/40 dark:hover:bg-indigo-950/15 group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2.5 sm:mb-3.5 rounded-xl sm:rounded-2xl bg-slate-100 dark:bg-slate-800/80 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-600/20 text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center justify-center transition border border-slate-200 dark:border-slate-700 shadow-inner">
                    <UploadCloud className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  {selectedFile ? (
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold mb-1">
                        <FileCheck className="w-3.5 h-3.5" /> File Selected
                      </div>
                      <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white break-all px-2">{selectedFile.name}</p>
                      <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                        {(selectedFile.size / 1024).toFixed(1)} KB • Tap to replace
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                        Drop candidate resume here, or <span className="text-indigo-600 dark:text-indigo-400 underline decoration-indigo-400/50 underline-offset-2">browse</span>
                      </p>
                      <p className="text-[10px] sm:text-xs text-slate-500 mt-1">
                        Supports PDF, DOCX, and TXT files
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Paste Text Tab View */}
              {activeTab === "paste" && (
                <div>
                  <textarea
                    rows={7}
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste resume text here (Summary, Technical Experience, Skills, Education)..."
                    className="w-full bg-slate-50 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 rounded-xl p-3 sm:p-3.5 text-xs sm:text-sm text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 font-mono transition resize-y min-h-[140px]"
                  />
                  <div className="flex justify-between items-center text-[10px] sm:text-[11px] text-slate-500 mt-1 px-1 font-mono">
                    <span>{resumeText.split(/\s+/).filter(Boolean).length} words</span>
                    <span>{resumeText.length} characters</span>
                  </div>
                </div>
              )}

              {/* ATS Job Description Matching Section */}
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-5 border-t border-slate-200 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-3 mb-2.5">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeAts}
                      onChange={(e) => setIncludeAts(e.target.checked)}
                      className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-white dark:bg-slate-800 h-4 w-4 shrink-0"
                    />
                    <span className="text-[11px] sm:text-xs">Compare with Job Req (ATS Alignment)</span>
                  </label>
                  {includeAts && (
                    <button
                      type="button"
                      onClick={() => setJobDescription(SAMPLE_JOB_DESCRIPTION)}
                      className="text-[10px] sm:text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline transition cursor-pointer font-medium self-end sm:self-auto"
                    >
                      Paste Sample Job Req
                    </button>
                  )}
                </div>

                {includeAts && (
                  <div className="animate-fadeIn mt-2">
                    <textarea
                      rows={4}
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste target job description to check keyword alignment and skill gaps..."
                      className="w-full bg-slate-50 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 sm:p-3 text-xs sm:text-sm text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 font-mono transition resize-y min-h-[90px]"
                    />
                  </div>
                )}
              </div>

              {/* Error Message Alert */}
              {error && (
                <div className="mt-3.5 p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-500/50 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500 dark:text-red-400" />
                  <span className="font-medium">{error}</span>
                </div>
              )}

              {/* Action Buttons (Full Width on Mobile) */}
              <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={handleScreenResume}
                  disabled={isLoading}
                  className="flex-1 py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                      Evaluating Profile...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Evaluate &amp; Screen Resume
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={resetAll}
                  className="py-2.5 sm:py-3 px-4 sm:px-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 text-xs font-semibold transition cursor-pointer text-center"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Platform Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 text-xs">
              <div className="bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-3 flex items-start gap-2 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-[11px] sm:text-xs">Zero-Bias Screening</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-[10px] sm:text-[11px] mt-0.5">Focuses purely on verified technical skills, experience, and domain alignment.</p>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-3 flex items-start gap-2 shadow-sm">
                <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-[11px] sm:text-xs">25 Career Tracks</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-[10px] sm:text-[11px] mt-0.5">Trained across engineering, data science, management, and tech roles.</p>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-3 flex items-start gap-2 shadow-sm">
                <BarChart3 className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-[11px] sm:text-xs">Instant ATS Check</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-[10px] sm:text-[11px] mt-0.5">Measure cosine similarity alignment against target role descriptions.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Results Dashboard (5 cols) */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-6">
            {result ? (
              <div className="space-y-4 sm:space-y-6 animate-fadeIn">
                {/* Human-Like Recruiter Assessment Card */}
                {result.assessment && (
                  <div className="bg-gradient-to-br from-indigo-50/90 via-white to-white dark:from-indigo-950/90 dark:via-slate-900 dark:to-slate-900 border border-indigo-200 dark:border-indigo-500/40 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl dark:shadow-2xl relative overflow-hidden transition-colors duration-200">
                    <div className="flex items-center justify-between text-xs font-semibold mb-2.5 sm:mb-3 gap-2 flex-wrap">
                      <span className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300 text-[11px] sm:text-xs">
                        <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 dark:text-indigo-400" /> AI Recruiter Assessment
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-bold text-[10px] sm:text-[11px] shrink-0">
                        {result.assessment.verdict}
                      </span>
                    </div>

                    <div className="mt-2">
                      <span className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
                        Top Recommended Role Fit
                      </span>
                      <h3 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-0.5 sm:mt-1 tracking-tight break-words">
                        {result.predicted_category}
                      </h3>
                    </div>

                    {/* Conversational Narrative */}
                    <p className="mt-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-100/80 dark:bg-slate-950/60 p-3 sm:p-3.5 rounded-xl border border-slate-200 dark:border-slate-800/80">
                      {result.assessment.narrative}
                    </p>

                    {/* Actionable Interview Tips */}
                    <div className="mt-3.5 space-y-1.5">
                      <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0" /> Recruiter Interview Tips:
                      </span>
                      <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300 pl-1">
                        {result.assessment.actionable_tips.map((tip, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-[11px] sm:text-xs">
                            <span className="text-indigo-600 dark:text-indigo-400 font-bold">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4 pt-3.5 border-t border-slate-200 dark:border-slate-800">
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <span className="text-slate-700 dark:text-slate-300 font-semibold text-[11px] sm:text-xs">Model Confidence</span>
                        <span className="text-indigo-600 dark:text-indigo-300 font-bold font-mono text-xs sm:text-sm">
                          {result.confidence}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800/90 h-2 sm:h-2.5 rounded-full overflow-hidden border border-slate-300 dark:border-slate-700/50">
                        <div
                          className="bg-gradient-to-r from-indigo-500 via-indigo-400 to-purple-500 h-full rounded-full transition-all duration-700"
                          style={{ width: `${Math.max(result.confidence, 8)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ATS Job Match Card (If calculated) */}
                {result.ats_match && (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/90 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-md dark:shadow-lg transition-colors duration-200">
                    <div className="flex items-center justify-between mb-3 gap-2">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Job Match (ATS)</h4>
                      </div>
                      <span
                        className={`text-xs font-bold font-mono px-2 py-0.5 rounded-lg border ${
                          result.ats_match.score >= 50
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400"
                            : "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400"
                        }`}
                      >
                        {result.ats_match.score}% Alignment
                      </span>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <span className="text-slate-600 dark:text-slate-400 block mb-1 font-semibold text-[11px] sm:text-xs">
                          Matching Strengths ({result.ats_match.matched_skills.length}):
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {result.ats_match.matched_skills.length > 0 ? (
                            result.ats_match.matched_skills.map((s) => (
                              <span
                                key={s}
                                className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-[10px] sm:text-[11px] font-medium"
                              >
                                ✓ {s}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-500 italic text-[11px]">No keyword overlap detected.</span>
                          )}
                        </div>
                      </div>

                      {result.ats_match.missing_skills.length > 0 && (
                        <div>
                          <span className="text-slate-600 dark:text-slate-400 block mb-1 font-semibold text-[11px] sm:text-xs">
                            Missing Skills to Probe ({result.ats_match.missing_skills.length}):
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {result.ats_match.missing_skills.map((s) => (
                              <span
                                key={s}
                                className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-500/30 text-amber-800 dark:text-amber-300 text-[10px] sm:text-[11px] font-medium"
                              >
                                ✗ {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Top 5 Alternative Role Matches */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/90 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-md dark:shadow-lg transition-colors duration-200">
                  <div className="flex items-center gap-1.5 mb-3.5">
                    <BarChart3 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Role Probability Distribution</h4>
                  </div>
                  <div className="space-y-2.5">
                    {result.top_categories.map((cat, idx) => (
                      <div key={cat.category}>
                        <div className="flex justify-between items-center text-[11px] sm:text-xs mb-1">
                          <span className="text-slate-800 dark:text-slate-200 font-medium truncate mr-2">
                            {idx + 1}. {cat.category}
                          </span>
                          <span className="text-slate-500 dark:text-slate-400 font-mono font-bold shrink-0">{cat.probability}%</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800/90 h-1.5 sm:h-2 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700/40">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              idx === 0
                                ? "bg-gradient-to-r from-indigo-500 to-purple-500"
                                : idx === 1
                                ? "bg-indigo-600/70"
                                : "bg-slate-400 dark:bg-slate-600"
                            }`}
                            style={{ width: `${Math.max(cat.probability, 4)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Extracted Skills Section */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/90 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-md dark:shadow-lg transition-colors duration-200">
                  <div className="flex items-center gap-1.5 mb-3">
                    <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Detected Competencies</h4>
                  </div>

                  {Object.keys(result.detected_skills).length > 0 ? (
                    <div className="space-y-2.5 text-xs">
                      {Object.entries(result.detected_skills).map(([group, skills]) => (
                        <div key={group}>
                          <span className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-1">
                            {group}
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {skills.map((skill) => (
                              <span
                                key={skill}
                                className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-500/25 text-indigo-700 dark:text-indigo-300 text-[10px] sm:text-[11px] font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">
                      No standardized domain skills detected in text.
                    </p>
                  )}
                </div>
              </div>
            ) : (
              /* Empty State Placeholder */
              <div className="h-full min-h-[260px] sm:min-h-[380px] bg-white/60 dark:bg-slate-900/40 border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-xl sm:rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center transition-colors duration-200">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-slate-100 dark:bg-slate-800/60 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-3 sm:mb-4 border border-slate-200 dark:border-slate-700/50 shadow-inner">
                  <Briefcase className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200">Candidate Evaluation Ready</h3>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 max-w-xs mt-1.5 leading-relaxed">
                  Upload a candidate resume or pick one of the quick profiles on the left to see the AI recruiter assessment and role match.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Responsive Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-900 bg-white/80 dark:bg-slate-950/90 py-5 sm:py-6 text-center text-xs text-slate-500 dark:text-slate-500 mt-8 sm:mt-12 transition-colors duration-200 w-full px-4">
        <div className="max-w-7xl mx-auto space-y-1">
          <p className="font-semibold text-slate-700 dark:text-slate-400 text-[11px] sm:text-xs">
            TalentScan AI • Intelligent Resume Screening &amp; Candidate Classification
          </p>
          <p className="text-slate-500 dark:text-slate-600 text-[10px] sm:text-[11px]">
            Powered by Natural Language Processing &amp; Machine Learning • Privacy-First Architecture
          </p>
        </div>
      </footer>
    </div>
  );
}
