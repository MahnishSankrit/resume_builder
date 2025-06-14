// Function to hide all previews
function clearAllPreviews() {
  const allPreviews = document.querySelectorAll("[id^='preview-']");
  allPreviews.forEach(preview => {
    preview.style.display = "none";
  });
}

// Preview Button Logic
document.getElementById("btn-1").addEventListener("click", function () {
  const selectedTemplate = document.getElementById("templateSelect").value;

  // Hide all previews before showing the selected one
  clearAllPreviews();

  const previewIds = {
    name: `${selectedTemplate}-name`,
    email: `${selectedTemplate}-email`,
    phone: `${selectedTemplate}-phone`,
    summary: `${selectedTemplate}-summary`,
    edu: `${selectedTemplate}-edu`,
    exp: `${selectedTemplate}-exp`,
    projects: `${selectedTemplate}-projects`,
    skills: `${selectedTemplate}-skills`,
    aboutme: `${selectedTemplate}-aboutme`,
    linkedin: `${selectedTemplate}-linkedin`,
    github: `${selectedTemplate}-github`,
    portfolio: `${selectedTemplate}-portfolio`,
    image: `${selectedTemplate}-image`,
  };

  const selectedResume = document.getElementById(`preview-${selectedTemplate}`);
  if (!selectedResume) {
    alert("Selected template preview not found!");
    return;
  }

  selectedResume.style.display = "block";

  document.getElementById(previewIds.name).textContent = document.getElementById("nameinput").value;
  document.getElementById(previewIds.email).textContent = document.getElementById("emailinput").value;
  document.getElementById(previewIds.phone).textContent = document.getElementById("phoneinput").value;
  document.getElementById(previewIds.summary).textContent = document.getElementById("suminput").value;
  document.getElementById(previewIds.edu).textContent = document.getElementById("eduinput").value;
  document.getElementById(previewIds.skills).textContent = document.getElementById("skillinput").value;
  document.getElementById(previewIds.aboutme).textContent = document.getElementById("aboutmeinput").value;

  const expArray = Array.from(document.querySelectorAll(".expinput"))
    .map(input => input.value.trim())
    .filter(Boolean)
    .map(exp => `<li>${exp}</li>`).join("");
  document.getElementById(previewIds.exp).innerHTML = expArray;

  const projectArray = Array.from(document.querySelectorAll(".projectinput"))
    .map(input => input.value.trim())
    .filter(Boolean)
    .map(proj => `<li>${proj}</li>`).join("");
  document.getElementById(previewIds.projects).innerHTML = projectArray;

  document.getElementById(previewIds.linkedin).href = document.getElementById("linkedininput").value;
  document.getElementById(previewIds.linkedin).textContent = "LinkedIn";

  document.getElementById(previewIds.github).href = document.getElementById("githubinput").value;
  document.getElementById(previewIds.github).textContent = "GitHub";

  document.getElementById(previewIds.portfolio).href = document.getElementById("portfoliourlinput").value;
  document.getElementById(previewIds.portfolio).textContent = "Portfolio";

  const uploadedImgSrc = document.getElementById("preview-image").src;
  if (uploadedImgSrc && uploadedImgSrc.startsWith("data:image")) {
    const targetImg = document.getElementById(previewIds.image);
    if (targetImg) targetImg.src = uploadedImgSrc;
  }

  selectedResume.className = `resume-preview template-${selectedTemplate}`;

  const profileImage = document.getElementById("preview-image");
  if (profileImage) {
    profileImage.style.display = (selectedTemplate === "elegant" || selectedTemplate === "creative") ? "block" : "none";
  }

  document.getElementById("preview-section").style.display = "block";
});

// PDF Generation


document.getElementById("btn-2").addEventListener("click", function (e) {
  e.preventDefault();

  const selectedTemplate = document.getElementById("templateSelect").value;
  const resume = document.getElementById(`preview-${selectedTemplate}`);

  if (!resume) {
    alert("Selected resume not found!");
    return;
  }

  resume.style.display = "block";

  const originalColor = resume.style.color;
  const originalBg = resume.style.backgroundColor;
  resume.style.color = "black";
  resume.style.backgroundColor = "white";

  const name = document.getElementById(`${selectedTemplate}-name`)?.textContent?.trim()?.replace(/\s+/g, "_") || "resume";

  const opt = {
    margin: [20, 15, 20, 15],
    filename: `${name}_resume.pdf`,
    html2canvas: {
      scale: 2,
      useCORS: true,
      scrollX: 0,
      scrollY: 0,
      logging: true
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait"
    }
  };

  html2pdf()
    .set(opt)
    .from(resume)
    .save()
    .then(() => {
      resume.style.color = originalColor;
      resume.style.backgroundColor = originalBg;
    })
    .catch(err => {
      console.error("PDF generation error:", err);
      resume.style.color = originalColor;
      resume.style.backgroundColor = originalBg;
    });
});

// Add Experience
document.getElementById("add-exp").addEventListener('click', function () {
  const explist = document.getElementById("experience-list");
  const newTextarea = document.createElement("textarea");
  newTextarea.className = "expinput";
  newTextarea.rows = 2;
  explist.appendChild(newTextarea);
});

// Add Project
document.getElementById("add-project").addEventListener('click', function () {
  const prolist = document.getElementById("project-list");
  const newTextarea = document.createElement("textarea");
  newTextarea.className = "projectinput";
  newTextarea.rows = 2;
  prolist.appendChild(newTextarea);
});
