
  // Show upload field when user selects "Upload"
  document.querySelectorAll('input[name="resumeOption"]').forEach(radio => {
    radio.addEventListener('change', function () {
      document.getElementById("uploadSection").style.display = this.value === "upload" ? "block" : "none";
    });
  });

  // Extract keywords from Job Description
  function extractKeywords(text) {
    return text
      .toLowerCase()
      .match(/\b([a-zA-Z]{4,})\b/g)
      ?.filter((word, i, self) => self.indexOf(word) === i) || [];
  }

  // Extract resume text from local storage or file upload
  async function getResumeText() {
    const usePlatform = document.querySelector('input[value="platform"]').checked;
    if (usePlatform) {
      return localStorage.getItem("userResumeText") || "example resume text from platform";
    } else {
      const file = document.getElementById("resumeUpload").files[0];
      if (!file) return "";

      const fileType = file.type;

      if (fileType === "text/plain") {
        return await file.text();

      } else if (fileType === "application/pdf") {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let text = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items.map(item => item.str);
          text += strings.join(" ") + "\n";
        }
        return text;

      } else if (fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        return result.value;

      } else {
        alert("Unsupported file type. Please upload .txt, .pdf, or .docx");
        return "";
      }
    }
  }

  // ATS Matching Score
  document.getElementById("checkScoreBtn").addEventListener("click", async () => {
    const jdText = document.getElementById("jobDescription").value.trim();
    if (!jdText) {
      alert("Please paste a Job Description first.");
      return;
    }

    const jdKeywords = extractKeywords(jdText);
    const resumeText = await getResumeText();
    const resumeWords = extractKeywords(resumeText);

    const matched = jdKeywords.filter(word => resumeWords.includes(word));
    const missing = jdKeywords.filter(word => !resumeWords.includes(word));
    const score = Math.round((matched.length / jdKeywords.length) * 100);

    document.getElementById("atsScoreText").textContent = `${score}% match`;
    document.getElementById("matchedKeywords").textContent = matched.join(", ") || "None";
    document.getElementById("missingKeywords").textContent = missing.join(", ") || "None";
    document.getElementById("atsResult").style.display = "block";
  });
