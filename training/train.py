import os
import sys
import json
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import LabelEncoder
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import LinearSVC
from sklearn.calibration import CalibratedClassifierCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.naive_bayes import MultinomialNB
from sklearn.neighbors import KNeighborsClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

# Add parent directory to path to import preprocessor
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from api.preprocessor import clean_resume_text, SKILL_DICTIONARY

def main():
    print("=" * 60)
    print("RESUME SCREENING NLP MODEL TRAINING")
    print("Student: BHUMIREDDY NANDA KUMAR REDDY (20241CSD0022)")
    print("=" * 60)

    dataset_path = os.path.join(os.path.dirname(__file__), "data", "UpdatedResumeDataSet.csv")
    if not os.path.exists(dataset_path):
        raise FileNotFoundError(f"Dataset not found at: {dataset_path}")

    print(f"Loading dataset from: {dataset_path}")
    df = pd.read_csv(dataset_path)
    print(f"Total resumes: {len(df)}")
    print(f"Unique categories: {df['Category'].nunique()}")
    print("\nCategory Distribution:")
    print(df['Category'].value_counts())

    print("\n[Step 1/5] Preprocessing resume texts...")
    df['cleaned_resume'] = df['Resume'].apply(clean_resume_text)

    print("\n[Step 2/5] Encoding categorical labels...")
    label_encoder = LabelEncoder()
    y = label_encoder.fit_transform(df['Category'])
    classes = list(label_encoder.classes_)
    print(f"Encoded {len(classes)} distinct target categories.")

    print("\n[Step 3/5] Vectorizing text with TF-IDF...")
    tfidf_vectorizer = TfidfVectorizer(
        sublinear_tf=True,
        stop_words='english',
        max_features=3500,
        ngram_range=(1, 2)
    )
    X = tfidf_vectorizer.fit_transform(df['cleaned_resume'])
    print(f"Feature matrix shape: {X.shape}")

    # Stratified Train-Test Split (80% Train, 20% Test)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    print(f"Training samples: {X_train.shape[0]}, Testing samples: {X_test.shape[0]}")

    print("\n[Step 4/5] Model Benchmark Evaluation...")
    candidate_models = {
        "Calibrated LinearSVC": CalibratedClassifierCV(LinearSVC(random_state=42, max_iter=2000), cv=3),
        "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42),
        "Multinomial Naive Bayes": MultinomialNB(alpha=0.1),
        "K-Nearest Neighbors": KNeighborsClassifier(n_neighbors=5),
        "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42)
    }

    benchmark_results = {}
    best_model_name = None
    best_test_accuracy = -1.0
    best_fitted_model = None

    for name, model in candidate_models.items():
        # Evaluate using 5-fold cross validation on training data
        cv_scores = cross_val_score(model, X_train, y_train, cv=5, scoring='accuracy')
        # Train on entire training set
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        test_acc = accuracy_score(y_test, y_pred)
        
        benchmark_results[name] = {
            "cv_accuracy_mean": round(float(cv_scores.mean()), 4),
            "cv_accuracy_std": round(float(cv_scores.std()), 4),
            "test_accuracy": round(float(test_acc), 4)
        }
        print(f" - {name:<25}: CV Acc = {cv_scores.mean():.4f} (+/- {cv_scores.std():.4f}) | Test Acc = {test_acc:.4f}")

        if test_acc > best_test_accuracy:
            best_test_accuracy = test_acc
            best_model_name = name
            best_fitted_model = model

    print(f"\n--> Selected Best Model: {best_model_name} (Test Accuracy: {best_test_accuracy * 100:.2f}%)")

    # Final detailed evaluation for best model
    y_pred_best = best_fitted_model.predict(X_test)
    report_dict = classification_report(y_test, y_pred_best, target_names=classes, output_dict=True)
    report_text = classification_report(y_test, y_pred_best, target_names=classes)
    print("\nClassification Report:\n" + report_text)

    # Retrain best model on 100% of the dataset for maximum real-world production performance
    print("\n[Step 5/5] Retraining best model on full dataset (100% data) for production export...")
    if best_model_name == "Calibrated LinearSVC":
        final_model = CalibratedClassifierCV(LinearSVC(random_state=42, max_iter=2000), cv=3)
    elif best_model_name == "Random Forest":
        final_model = RandomForestClassifier(n_estimators=100, random_state=42)
    else:
        final_model = best_fitted_model
    final_model.fit(X, y)

    # Save artifacts into api/models
    models_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "api", "models"))
    os.makedirs(models_dir, exist_ok=True)

    classifier_path = os.path.join(models_dir, "resume_classifier.pkl")
    vectorizer_path = os.path.join(models_dir, "tfidf_vectorizer.pkl")
    encoder_path = os.path.join(models_dir, "label_encoder.pkl")
    metadata_path = os.path.join(models_dir, "metadata.json")

    joblib.dump(final_model, classifier_path)
    joblib.dump(tfidf_vectorizer, vectorizer_path)
    joblib.dump(label_encoder, encoder_path)

    metadata = {
        "project_name": "Resume Screening using NLP",
        "author": "BHUMIREDDY NANDA KUMAR REDDY",
        "registration_no": "20241CSD0022",
        "dataset": "Kaggle Resume Dataset (UpdatedResumeDataSet.csv)",
        "total_records": len(df),
        "num_classes": len(classes),
        "classes": classes,
        "best_model": best_model_name,
        "test_accuracy": round(float(best_test_accuracy), 4),
        "benchmarks": benchmark_results,
        "skills_categories": list(SKILL_DICTIONARY.keys())
    }

    with open(metadata_path, "w") as f:
        json.dump(metadata, f, indent=2)

    # Also save evaluation report in training/ for academic documentation
    eval_report_path = os.path.join(os.path.dirname(__file__), "evaluation_report.json")
    with open(eval_report_path, "w") as f:
        json.dump({
            "metadata": metadata,
            "classification_report": report_dict,
            "benchmark_comparison": benchmark_results
        }, f, indent=2)

    print("\n" + "=" * 60)
    print("TRAINING COMPLETE & ARTIFACTS SAVED SUCCESSFULLY!")
    print(f"Classifier: {classifier_path}")
    print(f"Vectorizer: {vectorizer_path}")
    print(f"Label Encoder: {encoder_path}")
    print(f"Metadata: {metadata_path}")
    print("=" * 60)

if __name__ == "__main__":
    main()
