# 🧠 Smart Resume + Portfolio Builder (Frontend Only)

This is a **Frontend-Only Resume and Portfolio Builder Web App** that allows users to create a professional resume using editable templates, check ATS compatibility, and correct grammar in real time — all without a backend!

---

## 🚀 Live Features

✅ Multiple resume templates (Classic, Elegant, Modern, Creative)  
✅ Live preview as you type  
✅ Upload `.txt`, `.pdf`, `.docx` resumes and extract content  
✅ ATS Score checker based on job description  
✅ Grammar and spelling suggestions using LanguageTool API  
✅ Export resume as PDF with one click  
✅ Optional profile photo upload  
✅ Responsive design for all screen sizes

---

## 🛠️ Tech Stack

- **HTML, CSS, JavaScript (Vanilla)**
- `html2pdf.js` – for PDF download
- `pdf.js` – to extract text from PDFs
- `mammoth.js` – to extract text from `.docx` files
- `LanguageTool API` – grammar & spelling suggestions

---

## 📁 Project Structure

All project files are in the root folder: `resume-builder`
pro12/
├── index.html # Resume builder UI
├── ats-check.html # Separate page for ATS scoring
├── script.js # Main template logic and resume preview
├── script1.js # Grammar check logic
├── ats.js # ATS functionality
├── style.css # Global and template styling
├── ats.css # ATS result styling
├── html2pdf.bundle.min.js # Library to export as PDF
├── pdf.js # For extracting text from PDFs
├── mammoth.browser.min.js # For extracting text from DOCX


