import os
import io
import requests

BASE = "http://127.0.0.1:8000"

def run_tests():
    print("=" * 60)
    print("BACKEND BUG & ROBUSTNESS TEST SUITE")
    print("=" * 60)

    # Test 1: Health
    r = requests.get(f"{BASE}/api/health")
    assert r.status_code == 200, f"Health failed: {r.status_code}"
    print("[PASS] Test 1: Health check endpoint is 200 OK")

    # Test 2: Categories
    r = requests.get(f"{BASE}/api/categories")
    assert r.status_code == 200, f"Categories failed: {r.status_code}"
    cats = r.json()["categories"]
    assert len(cats) == 25, f"Expected 25 categories, got {len(cats)}"
    print(f"[PASS] Test 2: Successfully loaded {len(cats)} categories")

    # Test 3: Empty text submission
    r = requests.post(f"{BASE}/api/screen", data={"text": "   "})
    assert r.status_code == 400, f"Expected 400 for empty text, got {r.status_code}"
    print("[PASS] Test 3: Empty text correctly rejected with 400 Bad Request")

    # Test 4: Empty file submission (0 bytes)
    r = requests.post(f"{BASE}/api/screen", files={"file": ("empty.pdf", io.BytesIO(b""), "application/pdf")})
    assert r.status_code == 400, f"Expected 400 for empty file, got {r.status_code}"
    print("[PASS] Test 4: Empty file (0 bytes) correctly rejected with 400 Bad Request")

    # Test 5: Gibberish with no alphanumeric words
    r = requests.post(f"{BASE}/api/screen", data={"text": "@@@ ### $$$ %%%"})
    assert r.status_code == 400, f"Expected 400 for gibberish, got {r.status_code}"
    print("[PASS] Test 5: Gibberish symbols correctly rejected with 400 Bad Request")

    # Test 6: Valid PDF file upload
    with open("sample_resumes/data_scientist_resume.pdf", "rb") as f:
        r = requests.post(f"{BASE}/api/screen", files={"file": ("data_scientist_resume.pdf", f, "application/pdf")})
    assert r.status_code == 200, f"PDF upload failed: {r.status_code}"
    res = r.json()
    assert res["predicted_category"] == "Data Science", f"Expected Data Science, got {res['predicted_category']}"
    print("[PASS] Test 6: PDF extraction and screening passed (Predicted Data Science)")

    # Test 7: Valid TXT file upload
    with open("sample_resumes/java_developer_resume.txt", "rb") as f:
        r = requests.post(f"{BASE}/api/screen", files={"file": ("java_developer_resume.txt", f, "text/plain")})
    assert r.status_code == 200, f"TXT upload failed: {r.status_code}"
    res = r.json()
    assert res["predicted_category"] == "Java Developer", f"Expected Java Developer, got {res['predicted_category']}"
    print("[PASS] Test 7: TXT extraction and screening passed (Predicted Java Developer)")

    # Test 8: ATS Matcher with Job Description
    jd = "Looking for Senior Data Scientist with Python, PyTorch, Deep Learning, NLP, and Machine Learning experience."
    with open("sample_resumes/data_scientist_resume.txt", "r", encoding="utf-8") as f:
        text = f.read()
    r = requests.post(f"{BASE}/api/screen", data={"text": text, "job_description": jd})
    assert r.status_code == 200, f"Screen with JD failed: {r.status_code}"
    res = r.json()
    assert res["ats_match"] is not None, "ATS match should be present"
    score = res["ats_match"]["score"]
    assert score > 0, f"ATS match score should be > 0, got {score}"
    assert len(res["ats_match"]["matched_skills"]) > 0, "Should detect matched skills"
    print(f"[PASS] Test 8: ATS Matcher passed with {score}% alignment")

    # Test 9: Human assessment narrative & verdict
    assert "assessment" in res, "Assessment block missing"
    assert "verdict" in res["assessment"], "Verdict missing"
    assert len(res["assessment"]["actionable_tips"]) > 0, "Actionable tips missing"
    print(f"[PASS] Test 9: Human Assessment passed (Verdict: {res['assessment']['verdict']})")

    # Test 10: DOCX File Parsing
    # Let's generate a temporary docx file and test parsing
    import docx
    doc = docx.Document()
    doc.add_heading("DevOps Engineer Resume", 0)
    doc.add_paragraph("Skills: Docker, Kubernetes, AWS, Terraform, Jenkins, CI/CD, Linux, Python")
    doc.add_paragraph("4 years experience managing cloud infrastructure.")
    docx_buf = io.BytesIO()
    doc.save(docx_buf)
    docx_buf.seek(0)
    r = requests.post(f"{BASE}/api/screen", files={"file": ("devops_test.docx", docx_buf.getvalue(), "application/vnd.openxmlformats-officedocument.wordprocessingml.document")})
    assert r.status_code == 200, f"DOCX upload failed: {r.status_code}"
    res = r.json()
    assert res["predicted_category"] == "DevOps Engineer", f"Expected DevOps Engineer, got {res['predicted_category']}"
    print("[PASS] Test 10: DOCX extraction and screening passed (Predicted DevOps Engineer)")

    print("\n" + "=" * 60)
    print("ALL 10 TESTS PASSED WITH 100% SUCCESS!")
    print("=" * 60)

if __name__ == "__main__":
    run_tests()
