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
  RefreshCw,
  ShieldCheck,
  FileCheck,
  Lightbulb,
  Target,
  ArrowRight,
  Check,
  Compass,
  Sun,
  Moon,
  X,
  Play,
  Cpu,
  FileCode,
  GitBranch,
  BookOpen
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
Company: Technology Systems Inc.
Location: Remote

About the Role:
We are looking for an experienced Machine Learning & NLP Engineer to design and deploy natural language processing pipelines and predictive text classification models.

Key Requirements:
- 3+ years experience with Python, Machine Learning, Deep Learning, and NLP.
- Proven proficiency with Scikit-learn, TensorFlow, PyTorch, Pandas, and NumPy.
- Experience building REST APIs with FastAPI or Flask and containerizing with Docker.
- Strong background in text vectorization, TF-IDF, and model evaluation metrics.`;

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
  const [showArchModal, setShowArchModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);

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
    scrollToWorkspace();
  };

  const scrollToWorkspace = () => {
    workspaceRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
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
    <div className="min-h-screen bg-[#08080a] text-[#E4E4E7] flex flex-col font-sans selection:bg-[#C8521C] selection:text-white dark-space-bg transition-colors duration-200 antialiased w-full max-w-full overflow-x-hidden">
      {/* 1. Clean Project Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#08080a]/90 backdrop-blur-md transition-all duration-200">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-3">
          {/* Logo & Project Title */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#C8521C]/20 border border-[#C8521C]/40 flex items-center justify-center text-[#E06629] shrink-0">
              <FileCode className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm sm:text-lg font-bold tracking-tight text-white font-sans">
                <span className="hidden xs:inline">ResumeScreening</span>
                <span className="xs:hidden">Resume</span>
                <span className="text-[#D45B1E]">.ai</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-medium px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-zinc-400">
                NLP Model
              </span>
            </div>
          </div>

          {/* Genuine Project Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs text-zinc-400">
            <button
              onClick={() => setShowRolesModal(true)}
              className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5 text-[#D45B1E]" />
              <span>25 Categories</span>
            </button>
            <button
              onClick={() => setShowArchModal(true)}
              className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Cpu className="w-3.5 h-3.5 text-[#D45B1E]" />
              <span>Model Specs</span>
            </button>
            <a
              href="https://github.com/weirdswizard/ResumeScreening-.git"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <GitBranch className="w-3.5 h-3.5 text-[#D45B1E]" />
              <span>GitHub</span>
            </a>
          </nav>

          {/* Right Action Items */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Roles Drawer Trigger for Mobile */}
            <button
              type="button"
              onClick={() => setShowRolesModal(!showRolesModal)}
              className="md:hidden px-2.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-xs text-zinc-300 border border-white/10 transition flex items-center gap-1 cursor-pointer"
            >
              <Compass className="w-3 h-3 text-[#D45B1E]" />
              <span className="text-[11px]">25 Roles</span>
            </button>

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white border border-white/10 transition flex items-center justify-center cursor-pointer"
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === "dark" ? (
                <Sun className="w-3.5 h-3.5 text-zinc-300" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-zinc-300" />
              )}
            </button>

            {/* Screener Anchor Button */}
            <button
              type="button"
              onClick={scrollToWorkspace}
              className="px-3 sm:px-5 py-1.5 sm:py-2 rounded-full bg-[#C8521C] hover:bg-[#D95B22] text-white font-semibold text-xs sm:text-sm tracking-wide transition-colors border border-[#E06629]/40 cursor-pointer"
            >
              <span className="xs:hidden">Screen</span>
              <span className="hidden xs:inline">Screen Resume</span>
            </button>
          </div>
        </div>
      </header>

      {/* 25 Supported Job Tracks Modal */}
      {showRolesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0e1015] border border-white/10 rounded-2xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#C8521C]/20 border border-[#C8521C]/30 text-[#E06629]">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-base sm:text-lg text-white">
                    25 Trained Job Categories
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Pre-trained NLP multi-class model categories
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowRolesModal(false)}
                className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/[0.08] rounded-lg transition cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 pt-4">
              {[
                "Data Science", "Python Developer", "Java Developer", "DevOps Engineer",
                "Web Designing", "HR", "Testing", "Automation Testing", "Blockchain",
                "Database", "ETL Developer", "Hadoop", "Business Analyst", "Network Security Engineer",
                "Civil Engineer", "Mechanical Engineer", "Electrical Engineering", "Operations Manager",
                "DotNet Developer", "SAP Developer", "PMO", "Sales", "Arts", "Health and fitness", "Advocate"
              ].map((role) => (
                <span
                  key={role}
                  className="px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-zinc-300 text-xs font-medium"
                >
                  {role}
                </span>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setShowRolesModal(false)}
                className="px-5 py-2 rounded-full bg-[#C8521C] hover:bg-[#D95B22] text-white text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Model Architecture Modal */}
      {showArchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0e1015] border border-white/10 rounded-2xl max-w-xl w-full p-5 sm:p-7 shadow-2xl relative max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-[#D45B1E]" />
                <h3 className="font-bold text-white text-base">Model &amp; Pipeline Architecture</h3>
              </div>
              <button
                onClick={() => setShowArchModal(false)}
                className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/[0.08] rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
              <p><strong className="text-white">Dataset:</strong> Kaggle UpdatedResumeDataSet comprising 962 resumes across 25 distinct job classifications.</p>
              <p><strong className="text-white">Preprocessing:</strong> URL removal, punctuation cleaning, symbol stripping, extra whitespace trimming, and lowercasing via Python regex.</p>
              <p><strong className="text-white">Feature Representation:</strong> Scikit-Learn TF-IDF vectorizer (Term Frequency-Inverse Document Frequency) with English stopword filtering.</p>
              <p><strong className="text-white">Classifier:</strong> Multi-class Random Forest with 100 estimators achieving 100% test evaluation score.</p>
              <p><strong className="text-white">Document Parsing:</strong> PDF extraction via pypdf, Word document parsing via python-docx, and UTF-8 plain text handling.</p>
            </div>
            <div className="pt-3 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setShowArchModal(false)}
                className="px-4 py-2 rounded-full bg-[#C8521C] hover:bg-[#D95B22] text-white text-xs font-semibold cursor-pointer"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Hero Section (Project Centered with Subtle Warm Horizon) */}
      <section className="relative pt-12 sm:pt-16 pb-0 overflow-hidden flex flex-col items-center text-center px-4 sm:px-6 lg:px-8">
        {/* Atmospheric Ambient Gradient Glows behind Hero Content */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] max-w-full h-[280px] bg-gradient-to-b from-[#C8521C]/14 via-[#C8521C]/06 to-transparent blur-[80px] rounded-full pointer-events-none -z-10" />
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[850px] max-w-full h-[220px] bg-gradient-to-t from-[#C8521C]/22 via-[#C8521C]/08 to-transparent blur-[65px] rounded-full pointer-events-none -z-10" />

        {/* Project Tag Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs text-zinc-300 mb-5">
          <span className="w-2 h-2 rounded-full bg-[#C8521C]" />
          <span>Machine Learning &amp; NLP Project</span>
          <span className="text-zinc-500">•</span>
          <span className="text-zinc-400">25 Career Categories</span>
        </div>

        {/* Honest Heading */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.15] max-w-3xl mx-auto px-2">
          Resume Screening &amp; Classification
        </h1>

        {/* Project Description */}
        <p className="mt-4 sm:mt-5 text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed px-2">
          An automated machine learning system trained on resume text to predict job category fit across 25 career domains, extract key technical competencies, and measure alignment with target job requisitions.
        </p>

        {/* Action Buttons */}
        <div className="mt-7 sm:mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4 w-full px-4">
          <button
            type="button"
            onClick={() => loadSample("data_scientist")}
            className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white/[0.05] hover:bg-white/[0.09] text-white font-medium text-xs sm:text-sm border border-white/10 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white text-white" />
            <span>Load Sample Resume</span>
          </button>

          <button
            type="button"
            onClick={scrollToWorkspace}
            className="px-6 sm:px-7 py-2.5 sm:py-3 rounded-full bg-[#C8521C] hover:bg-[#D95B22] text-white font-semibold text-xs sm:text-sm transition-colors border border-[#E06629]/40 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Analyze Resume</span>
          </button>
        </div>

        {/* 3. Subtle Warm Orange Horizon Arc (Refined, Non-Neon) */}
        <div className="horizon-arc-wrapper mt-10 sm:mt-16">
          <div className="horizon-arc flex flex-col items-center pt-6 sm:pt-10">
            {/* Genuine Technical Specs of the Project Inside the Curve */}
            <div className="max-w-4xl mx-auto px-4 text-center">
              <p className="text-[10px] sm:text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-3 sm:mb-4">
                Core System Architecture
              </p>
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-x-6 gap-y-2.5 sm:gap-8 text-zinc-300 text-xs font-medium">
                <div className="flex items-center justify-center sm:justify-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C8521C]" />
                  <span>25 Job Categories</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C8521C]" />
                  <span>TF-IDF Vectorization</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C8521C]" />
                  <span>Random Forest Model</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C8521C]" />
                  <span>PDF, DOCX &amp; TXT Parser</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Interactive Workspace Dashboard (Embedded Below the Arc) */}
      <section
        ref={workspaceRef}
        className="relative z-10 -mt-16 sm:-mt-24 md:-mt-32 max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 pb-16 sm:pb-20 w-full"
      >
        <div className="rounded-2xl sm:rounded-3xl border border-white/[0.08] bg-[#0c0d12] shadow-2xl p-4 sm:p-7">
          {/* Workspace Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/[0.07] gap-3 mb-5 sm:mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#C8521C]/20 border border-[#C8521C]/30 text-[#E06629] flex items-center justify-center">
                <Brain className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-white">
                  Resume Screener &amp; Skill Matcher
                </h3>
                <p className="text-xs text-zinc-400">
                  Select a sample profile or upload a document to run inference
                </p>
              </div>
            </div>

            {/* Quick Sample Selector Pills */}
            <div className="flex items-center flex-wrap gap-1.5 text-xs">
              <span className="text-zinc-500 text-[11px] font-medium mr-0.5">Try sample:</span>
              <button
                type="button"
                onClick={() => loadSample("data_scientist")}
                className="px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-[#C8521C]/20 text-zinc-300 hover:text-white border border-white/10 hover:border-[#C8521C]/40 text-[11px] font-medium transition cursor-pointer"
              >
                Alex (Data Science)
              </button>
              <button
                type="button"
                onClick={() => loadSample("java_developer")}
                className="px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-[#C8521C]/20 text-zinc-300 hover:text-white border border-white/10 hover:border-[#C8521C]/40 text-[11px] font-medium transition cursor-pointer"
              >
                Marcus (Java)
              </button>
              <button
                type="button"
                onClick={() => loadSample("devops_engineer")}
                className="px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-[#C8521C]/20 text-zinc-300 hover:text-white border border-white/10 hover:border-[#C8521C]/40 text-[11px] font-medium transition cursor-pointer"
              >
                Sarah (DevOps)
              </button>
            </div>
          </div>

          {/* Dual Column Workspace Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-7 items-start">
            {/* Left Column: Input Form (7 cols) */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5">
              {/* Tab Selector: Upload Document vs Paste Text */}
              <div className="flex items-center justify-between gap-2 border-b border-white/[0.06] pb-3.5">
                <div className="flex p-1 bg-black/40 rounded-xl border border-white/[0.08] w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setActiveTab("upload")}
                    className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeTab === "upload"
                        ? "bg-[#C8521C] text-white"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <UploadCloud className="w-3.5 h-3.5" /> Upload Document
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("paste")}
                    className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeTab === "paste"
                        ? "bg-[#C8521C] text-white"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" /> Paste Text
                  </button>
                </div>
              </div>

              {/* Upload Tab View */}
              {activeTab === "upload" && (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border border-dashed border-white/15 hover:border-[#C8521C]/70 rounded-xl sm:rounded-2xl p-6 sm:p-9 text-center cursor-pointer transition bg-black/30 hover:bg-black/50 group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 rounded-xl bg-white/[0.04] group-hover:bg-[#C8521C]/20 text-zinc-400 group-hover:text-[#E06629] flex items-center justify-center transition border border-white/10 group-hover:border-[#C8521C]/40">
                    <UploadCloud className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  {selectedFile ? (
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-1">
                        <FileCheck className="w-3.5 h-3.5" /> File Selected
                      </div>
                      <p className="text-sm font-bold text-white break-all px-2">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-zinc-400">
                        {(selectedFile.size / 1024).toFixed(1)} KB • Click to replace file
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-white">
                        Drop resume file here, or <span className="text-[#D45B1E] underline underline-offset-4">browse</span>
                      </p>
                      <p className="text-[11px] sm:text-xs text-zinc-500 mt-1">
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
                    placeholder="Paste resume text here (Summary, Work Experience, Technical Skills, Education)..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl sm:rounded-2xl p-3.5 text-xs sm:text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#C8521C] font-mono transition resize-y min-h-[150px]"
                  />
                  <div className="flex justify-between items-center text-xs text-zinc-500 mt-1.5 px-1 font-mono">
                    <span>{resumeText.split(/\s+/).filter(Boolean).length} words</span>
                    <span>{resumeText.length} characters</span>
                  </div>
                </div>
              )}

              {/* ATS Job Description Matching Section */}
              <div className="pt-3.5 border-t border-white/[0.07]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2.5">
                  <label className="flex items-center gap-2 text-xs font-semibold text-zinc-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={includeAts}
                      onChange={(e) => setIncludeAts(e.target.checked)}
                      className="rounded border-white/20 bg-black text-[#C8521C] focus:ring-[#C8521C] h-4 w-4 shrink-0 cursor-pointer accent-[#C8521C]"
                    />
                    <span>Compare with Target Job Description (Skill Matching)</span>
                  </label>
                  {includeAts && (
                    <button
                      type="button"
                      onClick={() => setJobDescription(SAMPLE_JOB_DESCRIPTION)}
                      className="text-xs text-[#D45B1E] hover:underline transition cursor-pointer font-medium self-end sm:self-auto"
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
                      placeholder="Paste target job description to measure keyword overlap and missing competencies..."
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs sm:text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#C8521C] font-mono transition resize-y min-h-[90px]"
                    />
                  </div>
                )}
              </div>

              {/* Error Message Alert */}
              {error && (
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span className="font-medium">{error}</span>
                </div>
              )}

              {/* Action Buttons: Clean Dark Warm Styling */}
              <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleScreenResume}
                  disabled={isLoading}
                  className="flex-1 py-2.5 sm:py-3 px-5 rounded-full font-semibold text-xs sm:text-sm bg-[#C8521C] hover:bg-[#D95B22] text-white transition-colors border border-[#E06629]/40 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Evaluating Profile...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      Classify Resume
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={resetAll}
                  className="py-2.5 sm:py-3 px-5 rounded-full border border-white/10 hover:bg-white/[0.06] text-zinc-400 hover:text-white text-xs font-medium transition cursor-pointer text-center"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Right Column: Results Dashboard (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              {result ? (
                <div className="space-y-4 animate-fadeIn">
                  {/* Model Classification Result Card */}
                  {result.assessment && (
                    <div className="bg-[#101217] border border-[#C8521C]/40 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
                      <div className="flex items-center justify-between text-xs font-semibold mb-2.5 gap-2 flex-wrap">
                        <span className="flex items-center gap-1.5 text-[#E06629] text-xs font-bold uppercase tracking-wider">
                          <CheckCircle2 className="w-4 h-4" /> Classification Result
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[11px]">
                          {result.assessment.verdict}
                        </span>
                      </div>

                      <div className="mt-1">
                        <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-zinc-500 font-bold">
                          Predicted Job Category
                        </span>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5 tracking-tight break-words">
                          {result.predicted_category}
                        </h3>
                      </div>

                      {/* Model Narrative */}
                      <p className="mt-3 text-xs text-zinc-300 leading-relaxed bg-black/40 p-3 rounded-lg border border-white/[0.06]">
                        {result.assessment.narrative}
                      </p>

                      {/* Technical Focus Areas */}
                      <div className="mt-3.5 space-y-1.5">
                        <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1">
                          <Lightbulb className="w-3.5 h-3.5 text-zinc-400 shrink-0" /> Suggested Focus Areas:
                        </span>
                        <ul className="space-y-1 text-xs text-zinc-400 pl-1">
                          {result.assessment.actionable_tips.map((tip, idx) => (
                            <li key={idx} className="flex items-start gap-1.5 text-xs">
                              <span className="text-[#C8521C] font-bold">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Model Confidence Progress Bar */}
                      <div className="mt-4 pt-3.5 border-t border-white/[0.08]">
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="text-zinc-300 font-medium">Model Confidence</span>
                          <span className="text-[#E06629] font-bold font-mono text-xs sm:text-sm">
                            {result.confidence}%
                          </span>
                        </div>
                        <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden border border-white/10">
                          <div
                            className="bg-[#C8521C] h-full rounded-full transition-all duration-700"
                            style={{ width: `${Math.max(result.confidence, 8)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ATS Job Match Card (If calculated) */}
                  {result.ats_match && (
                    <div className="bg-[#101217] border border-white/10 rounded-xl sm:rounded-2xl p-4 shadow-md">
                      <div className="flex items-center justify-between mb-3 gap-2">
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                          <h4 className="text-xs sm:text-sm font-bold text-white">Job Alignment</h4>
                        </div>
                        <span
                          className={`text-xs font-bold font-mono px-2 py-0.5 rounded-full border ${
                            result.ats_match.score >= 50
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                              : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                          }`}
                        >
                          {result.ats_match.score}% Skill Overlap
                        </span>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div>
                          <span className="text-zinc-400 block mb-1 font-semibold text-xs">
                            Matched Skills ({result.ats_match.matched_skills.length}):
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {result.ats_match.matched_skills.length > 0 ? (
                              result.ats_match.matched_skills.map((s) => (
                                <span
                                  key={s}
                                  className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-medium"
                                >
                                  ✓ {s}
                                </span>
                              ))
                            ) : (
                              <span className="text-zinc-500 italic">No keyword overlap detected.</span>
                            )}
                          </div>
                        </div>

                        {result.ats_match.missing_skills.length > 0 && (
                          <div>
                            <span className="text-zinc-400 block mb-1 font-semibold text-xs">
                              Missing Role Keywords ({result.ats_match.missing_skills.length}):
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {result.ats_match.missing_skills.map((s) => (
                                <span
                                  key={s}
                                  className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-medium"
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

                  {/* Top 5 Probability Distribution */}
                  <div className="bg-[#101217] border border-white/10 rounded-xl sm:rounded-2xl p-4 shadow-md">
                    <div className="flex items-center gap-1.5 mb-3">
                      <BarChart3 className="w-4 h-4 text-[#C8521C] shrink-0" />
                      <h4 className="text-xs sm:text-sm font-bold text-white">Top Role Probabilities</h4>
                    </div>
                    <div className="space-y-2.5">
                      {result.top_categories.map((cat, idx) => (
                        <div key={cat.category}>
                          <div className="flex justify-between items-center text-xs mb-1">
                            <span className="text-zinc-300 font-medium truncate mr-2">
                              {idx + 1}. {cat.category}
                            </span>
                            <span className="text-zinc-400 font-mono font-bold shrink-0">{cat.probability}%</span>
                          </div>
                          <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden border border-white/[0.06]">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                idx === 0
                                  ? "bg-[#C8521C]"
                                  : idx === 1
                                  ? "bg-[#C8521C]/60"
                                  : "bg-zinc-700"
                              }`}
                              style={{ width: `${Math.max(cat.probability, 4)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Extracted Skills Section */}
                  <div className="bg-[#101217] border border-white/10 rounded-xl sm:rounded-2xl p-4 shadow-md">
                    <div className="flex items-center gap-1.5 mb-3">
                      <Layers className="w-4 h-4 text-[#C8521C] shrink-0" />
                      <h4 className="text-xs sm:text-sm font-bold text-white">Extracted Skills</h4>
                    </div>

                    {Object.keys(result.detected_skills).length > 0 ? (
                      <div className="space-y-2.5 text-xs">
                        {Object.entries(result.detected_skills).map(([group, skills]) => (
                          <div key={group}>
                            <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider block mb-1">
                              {group}
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {skills.map((skill) => (
                                <span
                                  key={skill}
                                  className="px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-zinc-300 text-[11px] font-medium"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-zinc-500 italic">
                        No standardized domain skills detected in text.
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                /* Empty State Workspace Placeholder */
                <div className="h-full min-h-[280px] sm:min-h-[380px] bg-black/30 border border-dashed border-white/10 rounded-xl sm:rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white/[0.04] flex items-center justify-center text-zinc-500 mb-3 border border-white/10">
                    <Briefcase className="w-6 h-6 text-[#C8521C]/60" />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white">Profile Evaluation Ready</h3>
                  <p className="text-xs text-zinc-400 max-w-xs mt-1.5 leading-relaxed">
                    Upload a resume file or load a sample profile on the left to view the predicted role classification and extracted skills.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Technical Highlights Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-5 mt-6 sm:mt-8">
          <div className="bg-[#0c0d12] border border-white/[0.07] rounded-xl sm:rounded-2xl p-4 sm:p-5 flex items-start gap-3 shadow-lg">
            <div className="p-2 rounded-lg bg-[#C8521C]/20 border border-[#C8521C]/30 text-[#E06629] shrink-0">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-white">NLP Text Processing</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Cleans resume content using regex patterns, tokenization, stopword filtering, and TF-IDF matrix generation.
              </p>
            </div>
          </div>
          <div className="bg-[#0c0d12] border border-white/[0.07] rounded-xl sm:rounded-2xl p-4 sm:p-5 flex items-start gap-3 shadow-lg">
            <div className="p-2 rounded-lg bg-[#C8521C]/20 border border-[#C8521C]/30 text-[#E06629] shrink-0">
              <Target className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-white">25 Career Classifications</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Categorizes candidate documents across Engineering, Data Science, Cloud, Management, and IT tracks.
              </p>
            </div>
          </div>
          <div className="bg-[#0c0d12] border border-white/[0.07] rounded-xl sm:rounded-2xl p-4 sm:p-5 flex items-start gap-3 shadow-lg">
            <div className="p-2 rounded-lg bg-[#C8521C]/20 border border-[#C8521C]/30 text-[#E06629] shrink-0">
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-white">Skill &amp; Keyword Alignment</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Compares candidate competencies against target job descriptions using cosine similarity and keyword extraction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Minimal Footer */}
      <footer className="border-t border-white/[0.06] bg-[#08080a] py-6 sm:py-7 text-center text-xs text-zinc-500 w-full px-4 mt-auto">
        <div className="max-w-7xl mx-auto space-y-1.5">
          <div className="flex items-center justify-center gap-2">
            <span className="font-semibold text-zinc-300">ResumeScreening.ai</span>
            <span>• Machine Learning &amp; Natural Language Processing Project</span>
          </div>
          <p className="text-zinc-500 text-[11px]">
            Trained with Python, Scikit-Learn &amp; FastAPI • Next.js &amp; Tailwind CSS Frontend
          </p>
        </div>
      </footer>
    </div>
  );
}
