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
  GitBranch
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
  const [scrollY, setScrollY] = useState(0);

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

  // Smooth scroll listener for scrollable background colors
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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
    <div
      className={`min-h-screen relative flex flex-col font-sans selection:bg-[#9C27B0] selection:text-white transition-colors duration-300 antialiased w-full max-w-full overflow-x-hidden ${
        theme === "dark" ? "base-dark-bg text-zinc-100" : "base-light-bg text-slate-900"
      }`}
    >
      {/* Scrollable Dynamic Ambient Background Colors (Vibrant Purple #9C27B0 & Electric Cyan #00BCD4) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Vibrant Purple Glow in Middle (moves down dynamically as you scroll) */}
        <div
          className={`absolute left-1/2 w-[520px] sm:w-[720px] h-[450px] sm:h-[600px] rounded-full transition-transform duration-100 ease-out ${
            theme === "dark" ? "ambient-orb-purple" : "ambient-orb-purple-light"
          }`}
          style={{
            top: "5%",
            transform: `translate3d(-65%, ${scrollY * 0.42}px, 0)`,
          }}
        />

        {/* Electric Cyan Glow in Middle (moves down dynamically as you scroll with smooth parallax) */}
        <div
          className={`absolute left-1/2 w-[520px] sm:w-[720px] h-[450px] sm:h-[600px] rounded-full transition-transform duration-100 ease-out ${
            theme === "dark" ? "ambient-orb-cyan" : "ambient-orb-cyan-light"
          }`}
          style={{
            top: "20%",
            transform: `translate3d(-35%, ${scrollY * 0.68}px, 0)`,
          }}
        />

        {/* Third Deep Harmonizing Glow Bloom that descends further down into the workspace */}
        <div
          className={`absolute left-1/2 w-[600px] sm:w-[850px] h-[400px] sm:h-[550px] rounded-full transition-transform duration-100 ease-out ${
            theme === "dark" ? "ambient-orb-purple" : "ambient-orb-purple-light"
          }`}
          style={{
            top: "52%",
            opacity: 0.6,
            transform: `translate3d(-50%, ${scrollY * 0.32}px, 0)`,
          }}
        />
      </div>

      {/* 1. Clean Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-white/[0.07] bg-white/80 dark:bg-[#06070a]/80 backdrop-blur-xl transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-3 relative z-10">
          {/* Clean Elegant Text Logo */}
          <div className="flex items-center gap-2">
            <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
              Resume<span className="bg-gradient-to-r from-[#9C27B0] to-[#00BCD4] bg-clip-text text-transparent">Screening</span>
            </span>
          </div>

          {/* Genuine Project Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-slate-600 dark:text-zinc-400">
            <button
              onClick={() => setShowRolesModal(true)}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5 text-[#9C27B0]" />
              <span>25 Categories</span>
            </button>
            <button
              onClick={() => setShowArchModal(true)}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Cpu className="w-3.5 h-3.5 text-[#00BCD4]" />
              <span>Model Specs</span>
            </button>
            <a
              href="https://github.com/weirdswizard/ResumeScreening-.git"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1.5"
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          </nav>

          {/* Right Action Items */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Roles Drawer Trigger for Mobile */}
            <button
              type="button"
              onClick={() => setShowRolesModal(!showRolesModal)}
              className="md:hidden px-2.5 py-1.5 rounded-full bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/[0.1] text-xs text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-white/10 transition flex items-center gap-1 cursor-pointer"
            >
              <Compass className="w-3 h-3 text-[#9C27B0]" />
              <span className="text-[11px]">Roles</span>
            </button>

            {/* Light / Dark Mode Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-white/10 transition flex items-center justify-center cursor-pointer shadow-sm group"
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-purple-600 group-hover:-rotate-12 transition-transform duration-300" />
              )}
            </button>

            {/* Screener CTA Button */}
            <button
              type="button"
              onClick={scrollToWorkspace}
              className="px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-[#9C27B0] to-[#00BCD4] hover:opacity-90 text-white font-semibold text-xs sm:text-sm tracking-wide transition-all shadow-md shadow-purple-500/20 cursor-pointer active:scale-95"
            >
              Screen Resume
            </button>
          </div>
        </div>
      </header>

      {/* 25 Supported Job Tracks Modal */}
      {showRolesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-[#0e1015] border border-slate-200 dark:border-white/10 rounded-2xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-[#9C27B0]">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                    25 Trained Job Categories
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    Pre-trained NLP multi-class model categories
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowRolesModal(false)}
                className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.08] rounded-lg transition cursor-pointer"
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
                  className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-zinc-300 text-xs font-medium"
                >
                  {role}
                </span>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/10 flex justify-end">
              <button
                onClick={() => setShowRolesModal(false)}
                className="px-5 py-2 rounded-full bg-gradient-to-r from-[#9C27B0] to-[#00BCD4] text-white text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Model Architecture Modal */}
      {showArchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-[#0e1015] border border-slate-200 dark:border-white/10 rounded-2xl max-w-xl w-full p-5 sm:p-7 shadow-2xl relative max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-[#00BCD4]" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Model &amp; Pipeline Architecture</h3>
              </div>
              <button
                onClick={() => setShowArchModal(false)}
                className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.08] rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
              <p><strong className="text-slate-900 dark:text-white">Dataset:</strong> Kaggle UpdatedResumeDataSet comprising 962 resumes across 25 distinct job classifications.</p>
              <p><strong className="text-slate-900 dark:text-white">Preprocessing:</strong> URL removal, punctuation cleaning, symbol stripping, extra whitespace trimming, and lowercasing via Python regex.</p>
              <p><strong className="text-slate-900 dark:text-white">Feature Representation:</strong> Scikit-Learn TF-IDF vectorizer (Term Frequency-Inverse Document Frequency) with English stopword filtering.</p>
              <p><strong className="text-slate-900 dark:text-white">Classifier:</strong> Multi-class Random Forest with 100 estimators achieving 100% test evaluation score.</p>
              <p><strong className="text-slate-900 dark:text-white">Document Parsing:</strong> PDF extraction via pypdf, Word document parsing via python-docx, and UTF-8 plain text handling.</p>
            </div>
            <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex justify-end">
              <button
                onClick={() => setShowArchModal(false)}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-[#9C27B0] to-[#00BCD4] text-white text-xs font-semibold cursor-pointer"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Hero Section */}
      <section className="relative pt-12 sm:pt-16 pb-0 overflow-hidden flex flex-col items-center text-center px-4 sm:px-6 lg:px-8 z-10">
        {/* Project Tag Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs text-slate-700 dark:text-zinc-300 mb-5 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#9C27B0]" />
          <span>Machine Learning &amp; NLP Project</span>
          <span className="text-slate-400 dark:text-zinc-500">•</span>
          <span className="text-slate-600 dark:text-zinc-400">25 Career Categories</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15] max-w-3xl mx-auto px-2">
          Resume Screening &amp; Classification
        </h1>

        {/* Description */}
        <p className="mt-4 sm:mt-5 text-sm sm:text-base text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed px-2">
          An automated machine learning system trained on resume text to predict job category fit across 25 career domains, extract key technical competencies, and measure alignment with target job requisitions.
        </p>

        {/* Action Buttons */}
        <div className="mt-7 sm:mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4 w-full px-4">
          <button
            type="button"
            onClick={() => loadSample("data_scientist")}
            className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-900 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] dark:text-white font-medium text-xs sm:text-sm border border-slate-300 dark:border-white/10 transition-colors flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Load Sample Resume</span>
          </button>

          <button
            type="button"
            onClick={scrollToWorkspace}
            className="px-6 sm:px-7 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#9C27B0] to-[#00BCD4] hover:opacity-90 text-white font-semibold text-xs sm:text-sm transition-all shadow-md shadow-purple-500/25 flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <span>Analyze Resume</span>
          </button>
        </div>

        {/* Clean Architecture Badges */}
        <div className="mt-9 sm:mt-12 flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-3xl mx-auto px-4">
          <span className="px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-300 text-xs font-medium flex items-center gap-2 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9C27B0]" />
            25 Job Categories
          </span>
          <span className="px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-300 text-xs font-medium flex items-center gap-2 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00BCD4]" />
            TF-IDF Vectorization
          </span>
          <span className="px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-300 text-xs font-medium flex items-center gap-2 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9C27B0]" />
            Random Forest Model
          </span>
          <span className="px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-300 text-xs font-medium flex items-center gap-2 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00BCD4]" />
            PDF, DOCX &amp; TXT Parser
          </span>
        </div>
      </section>

      {/* 3. Interactive Workspace Dashboard (With Full Light & Dark Support) */}
      <section
        ref={workspaceRef}
        className="relative z-10 mt-8 sm:mt-12 max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 pb-16 sm:pb-20 w-full"
      >
        <div className="rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-white/[0.08] bg-white/90 dark:bg-[#0c0d12]/95 shadow-xl dark:shadow-2xl p-4 sm:p-7 backdrop-blur-md transition-colors duration-200">
          {/* Workspace Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-white/[0.07] gap-3 mb-5 sm:mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 text-[#9C27B0] flex items-center justify-center">
                <Brain className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  Resume Screener &amp; Skill Matcher
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Select a sample profile or upload a document to run inference
                </p>
              </div>
            </div>

            {/* Quick Sample Selector Pills */}
            <div className="flex items-center flex-wrap gap-1.5 text-xs">
              <span className="text-slate-500 dark:text-zinc-500 text-[11px] font-medium mr-0.5">Try sample:</span>
              <button
                type="button"
                onClick={() => loadSample("data_scientist")}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-white/[0.04] dark:hover:bg-purple-500/20 dark:text-zinc-300 dark:hover:text-white border border-slate-200 dark:border-white/10 text-[11px] font-medium transition cursor-pointer"
              >
                Alex (Data Science)
              </button>
              <button
                type="button"
                onClick={() => loadSample("java_developer")}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-white/[0.04] dark:hover:bg-cyan-500/20 dark:text-zinc-300 dark:hover:text-white border border-slate-200 dark:border-white/10 text-[11px] font-medium transition cursor-pointer"
              >
                Marcus (Java)
              </button>
              <button
                type="button"
                onClick={() => loadSample("devops_engineer")}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-white/[0.04] dark:hover:bg-purple-500/20 dark:text-zinc-300 dark:hover:text-white border border-slate-200 dark:border-white/10 text-[11px] font-medium transition cursor-pointer"
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
              <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-white/[0.06] pb-3.5">
                <div className="flex p-1 bg-slate-100 dark:bg-black/40 rounded-xl border border-slate-200 dark:border-white/[0.08] w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setActiveTab("upload")}
                    className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeTab === "upload"
                        ? "bg-gradient-to-r from-[#9C27B0] to-[#7B1FA2] text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
                    }`}
                  >
                    <UploadCloud className="w-3.5 h-3.5" /> Upload Document
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("paste")}
                    className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeTab === "paste"
                        ? "bg-gradient-to-r from-[#9C27B0] to-[#7B1FA2] text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
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
                  className="border border-dashed border-slate-300 hover:border-[#9C27B0] dark:border-white/15 dark:hover:border-[#9C27B0]/70 rounded-xl sm:rounded-2xl p-6 sm:p-9 text-center cursor-pointer transition bg-slate-50/70 hover:bg-slate-100/70 dark:bg-black/30 dark:hover:bg-black/50 group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 rounded-xl bg-white dark:bg-white/[0.04] group-hover:bg-purple-50 dark:group-hover:bg-purple-500/20 text-slate-500 dark:text-zinc-400 group-hover:text-[#9C27B0] flex items-center justify-center transition border border-slate-200 dark:border-white/10 shadow-sm">
                    <UploadCloud className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  {selectedFile ? (
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-1">
                        <FileCheck className="w-3.5 h-3.5" /> File Selected
                      </div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white break-all px-2">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-zinc-400">
                        {(selectedFile.size / 1024).toFixed(1)} KB • Click to replace file
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-white">
                        Drop resume file here, or <span className="text-[#9C27B0] underline underline-offset-4 font-semibold">browse</span>
                      </p>
                      <p className="text-[11px] sm:text-xs text-slate-500 dark:text-zinc-500 mt-1">
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
                    className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl sm:rounded-2xl p-3.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-[#9C27B0] font-mono transition resize-y min-h-[150px]"
                  />
                  <div className="flex justify-between items-center text-xs text-slate-500 dark:text-zinc-500 mt-1.5 px-1 font-mono">
                    <span>{resumeText.split(/\s+/).filter(Boolean).length} words</span>
                    <span>{resumeText.length} characters</span>
                  </div>
                </div>
              )}

              {/* ATS Job Description Matching Section */}
              <div className="pt-4 border-t border-slate-200 dark:border-white/[0.07]">
                {/* Modern Interactive Switch Card (Replaces the raw checkbox, styled to Purple & Cyan theme) */}
                <div
                  onClick={() => setIncludeAts(!includeAts)}
                  className={`p-3 sm:p-3.5 rounded-xl border transition-all duration-200 cursor-pointer select-none flex items-center justify-between gap-3 ${
                    includeAts
                      ? "bg-slate-100/90 dark:bg-white/[0.06] border-purple-300 dark:border-purple-500/40 shadow-sm"
                      : "bg-slate-50/50 hover:bg-slate-100/60 dark:bg-white/[0.02] dark:hover:bg-white/[0.04] border-slate-200 dark:border-white/10"
                  }`}
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        includeAts
                          ? "bg-gradient-to-br from-[#9C27B0]/20 to-[#00BCD4]/20 text-[#00BCD4] dark:text-[#00BCD4]"
                          : "bg-slate-200/70 dark:bg-white/[0.05] text-slate-500 dark:text-zinc-400"
                      }`}
                    >
                      <Target className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-white">
                          Compare with Target Job Description
                        </span>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-zinc-300 hidden xs:inline-block">
                          ATS Matching
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">
                        Evaluate keyword alignment and missing competencies
                      </p>
                    </div>
                  </div>

                  {/* Modern Toggle Switch Knob (Purple to Cyan Gradient) */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div
                      className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
                        includeAts
                          ? "bg-gradient-to-r from-[#9C27B0] to-[#00BCD4] shadow-sm shadow-purple-500/25"
                          : "bg-slate-300 dark:bg-white/15"
                      }`}
                    >
                      <div
                        className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                          includeAts ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {includeAts && (
                  <div className="animate-fadeIn mt-3 space-y-2">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                        Target Job Requisition
                      </span>
                      <button
                        type="button"
                        onClick={() => setJobDescription(SAMPLE_JOB_DESCRIPTION)}
                        className="text-xs text-[#00BCD4] hover:underline font-semibold transition cursor-pointer"
                      >
                        Paste Sample Job Req
                      </button>
                    </div>
                    <textarea
                      rows={4}
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste target job description to measure keyword overlap and missing competencies..."
                      className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl p-3 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-[#9C27B0] font-mono transition resize-y min-h-[90px]"
                    />
                  </div>
                )}
              </div>

              {/* Error Message Alert */}
              {error && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span className="font-medium">{error}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleScreenResume}
                  disabled={isLoading}
                  className="flex-1 py-2.5 sm:py-3 px-5 rounded-full font-semibold text-xs sm:text-sm bg-gradient-to-r from-[#9C27B0] to-[#00BCD4] hover:opacity-90 text-white transition-all shadow-md shadow-purple-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95"
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
                  className="py-2.5 sm:py-3 px-5 rounded-full border border-slate-300 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/[0.06] text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white text-xs font-medium transition cursor-pointer text-center"
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
                    <div className="bg-slate-50 dark:bg-[#101217] border border-purple-200 dark:border-purple-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-md relative overflow-hidden transition-colors">
                      <div className="flex items-center justify-between text-xs font-semibold mb-2.5 gap-2 flex-wrap">
                        <span className="flex items-center gap-1.5 text-[#9C27B0] text-xs font-bold uppercase tracking-wider">
                          <CheckCircle2 className="w-4 h-4" /> Classification Result
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                          {result.assessment.verdict}
                        </span>
                      </div>

                      <div className="mt-1">
                        <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-slate-500 dark:text-zinc-500 font-bold">
                          Predicted Job Category
                        </span>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5 tracking-tight break-words">
                          {result.predicted_category}
                        </h3>
                      </div>

                      {/* Model Narrative */}
                      <p className="mt-3 text-xs text-slate-700 dark:text-zinc-300 leading-relaxed bg-white dark:bg-black/40 p-3 rounded-lg border border-slate-200 dark:border-white/[0.06]">
                        {result.assessment.narrative}
                      </p>

                      {/* Technical Focus Areas */}
                      <div className="mt-3.5 space-y-1.5">
                        <span className="text-[11px] font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1">
                          <Lightbulb className="w-3.5 h-3.5 text-[#00BCD4] shrink-0" /> Suggested Focus Areas:
                        </span>
                        <ul className="space-y-1 text-xs text-slate-600 dark:text-zinc-400 pl-1">
                          {result.assessment.actionable_tips.map((tip, idx) => (
                            <li key={idx} className="flex items-start gap-1.5 text-xs">
                              <span className="text-[#9C27B0] font-bold">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Model Confidence Progress Bar */}
                      <div className="mt-4 pt-3.5 border-t border-slate-200 dark:border-white/[0.08]">
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="text-slate-700 dark:text-zinc-300 font-medium">Model Confidence</span>
                          <span className="text-[#00BCD4] font-bold font-mono text-xs sm:text-sm">
                            {result.confidence}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-black/60 h-2 rounded-full overflow-hidden border border-slate-300 dark:border-white/10">
                          <div
                            className="bg-gradient-to-r from-[#9C27B0] to-[#00BCD4] h-full rounded-full transition-all duration-700"
                            style={{ width: `${Math.max(result.confidence, 8)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ATS Job Match Card (If calculated) */}
                  {result.ats_match && (
                    <div className="bg-slate-50 dark:bg-[#101217] border border-slate-200 dark:border-white/10 rounded-xl sm:rounded-2xl p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-3 gap-2">
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Job Alignment</h4>
                        </div>
                        <span
                          className={`text-xs font-bold font-mono px-2 py-0.5 rounded-full border ${
                            result.ats_match.score >= 50
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                              : "bg-cyan-500/10 border-cyan-500/30 text-cyan-600 dark:text-cyan-400"
                          }`}
                        >
                          {result.ats_match.score}% Skill Overlap
                        </span>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div>
                          <span className="text-slate-600 dark:text-zinc-400 block mb-1 font-semibold text-xs">
                            Matched Skills ({result.ats_match.matched_skills.length}):
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {result.ats_match.matched_skills.length > 0 ? (
                              result.ats_match.matched_skills.map((s) => (
                                <span
                                  key={s}
                                  className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[11px] font-medium"
                                >
                                  ✓ {s}
                                </span>
                              ))
                            ) : (
                              <span className="text-slate-500 dark:text-zinc-500 italic">No keyword overlap detected.</span>
                            )}
                          </div>
                        </div>

                        {result.ats_match.missing_skills.length > 0 && (
                          <div>
                            <span className="text-slate-600 dark:text-zinc-400 block mb-1 font-semibold text-xs">
                              Missing Role Keywords ({result.ats_match.missing_skills.length}):
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {result.ats_match.missing_skills.map((s) => (
                                <span
                                  key={s}
                                  className="px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-purple-700 dark:text-purple-300 text-[11px] font-medium"
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
                  <div className="bg-slate-50 dark:bg-[#101217] border border-slate-200 dark:border-white/10 rounded-xl sm:rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-1.5 mb-3">
                      <BarChart3 className="w-4 h-4 text-[#9C27B0] shrink-0" />
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Top Role Probabilities</h4>
                    </div>
                    <div className="space-y-2.5">
                      {result.top_categories.map((cat, idx) => (
                        <div key={cat.category}>
                          <div className="flex justify-between items-center text-xs mb-1">
                            <span className="text-slate-800 dark:text-zinc-300 font-medium truncate mr-2">
                              {idx + 1}. {cat.category}
                            </span>
                            <span className="text-slate-500 dark:text-zinc-400 font-mono font-bold shrink-0">{cat.probability}%</span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-black/60 h-2 rounded-full overflow-hidden border border-slate-300 dark:border-white/[0.06]">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                idx === 0
                                  ? "bg-gradient-to-r from-[#9C27B0] to-[#00BCD4]"
                                  : idx === 1
                                  ? "bg-[#9C27B0]/70"
                                  : "bg-slate-400 dark:bg-zinc-700"
                              }`}
                              style={{ width: `${Math.max(cat.probability, 4)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Extracted Skills Section */}
                  <div className="bg-slate-50 dark:bg-[#101217] border border-slate-200 dark:border-white/10 rounded-xl sm:rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-1.5 mb-3">
                      <Layers className="w-4 h-4 text-[#00BCD4] shrink-0" />
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Extracted Skills</h4>
                    </div>

                    {Object.keys(result.detected_skills).length > 0 ? (
                      <div className="space-y-2.5 text-xs">
                        {Object.entries(result.detected_skills).map(([group, skills]) => (
                          <div key={group}>
                            <span className="text-slate-500 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-wider block mb-1">
                              {group}
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {skills.map((skill) => (
                                <span
                                  key={skill}
                                  className="px-2 py-0.5 rounded-full bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-300 text-[11px] font-medium shadow-2xs"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 dark:text-zinc-500 italic">
                        No standardized domain skills detected in text.
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                /* Empty State Workspace Placeholder */
                <div className="h-full min-h-[280px] sm:min-h-[380px] bg-slate-50/50 dark:bg-black/30 border border-dashed border-slate-300 dark:border-white/10 rounded-xl sm:rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white dark:bg-white/[0.04] flex items-center justify-center text-slate-400 dark:text-zinc-500 mb-3 border border-slate-200 dark:border-white/10 shadow-sm">
                    <Briefcase className="w-6 h-6 text-[#9C27B0]/70" />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-white">Profile Evaluation Ready</h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-xs mt-1.5 leading-relaxed">
                    Upload a resume file or load a sample profile on the left to view the predicted role classification and extracted skills.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Technical Highlights Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-5 mt-6 sm:mt-8">
          <div className="bg-white/90 dark:bg-[#0c0d12] border border-slate-200/90 dark:border-white/[0.07] rounded-xl sm:rounded-2xl p-4 sm:p-5 flex items-start gap-3 shadow-sm dark:shadow-lg transition-colors">
            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-[#9C27B0] shrink-0">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">NLP Text Processing</h4>
              <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1 leading-relaxed">
                Cleans resume content using regex patterns, tokenization, stopword filtering, and TF-IDF matrix generation.
              </p>
            </div>
          </div>
          <div className="bg-white/90 dark:bg-[#0c0d12] border border-slate-200/90 dark:border-white/[0.07] rounded-xl sm:rounded-2xl p-4 sm:p-5 flex items-start gap-3 shadow-sm dark:shadow-lg transition-colors">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-[#00BCD4] shrink-0">
              <Target className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">25 Career Classifications</h4>
              <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1 leading-relaxed">
                Categorizes candidate documents across Engineering, Data Science, Cloud, Management, and IT tracks.
              </p>
            </div>
          </div>
          <div className="bg-white/90 dark:bg-[#0c0d12] border border-slate-200/90 dark:border-white/[0.07] rounded-xl sm:rounded-2xl p-4 sm:p-5 flex items-start gap-3 shadow-sm dark:shadow-lg transition-colors">
            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-[#9C27B0] shrink-0">
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">Skill &amp; Keyword Alignment</h4>
              <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1 leading-relaxed">
                Compares candidate competencies against target job descriptions using cosine similarity and keyword extraction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Minimal Footer */}
      <footer className="border-t border-slate-200 dark:border-white/[0.06] bg-white/70 dark:bg-[#08080a] py-6 sm:py-7 text-center text-xs text-slate-500 dark:text-zinc-500 w-full px-4 mt-auto transition-colors relative z-10">
        <div className="max-w-7xl mx-auto space-y-1.5">
          <div className="flex items-center justify-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-zinc-300">ResumeScreening</span>
            <span>• Machine Learning &amp; Natural Language Processing Project</span>
          </div>
          <p className="text-slate-500 dark:text-zinc-500 text-[11px]">
            Trained with Python, Scikit-Learn &amp; FastAPI • Next.js &amp; Tailwind CSS Frontend
          </p>
        </div>
      </footer>
    </div>
  );
}
