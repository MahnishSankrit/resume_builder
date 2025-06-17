// ===== PREVIEW SECTION =====

function clearAllPreviews() {
  const allPreviews = document.querySelectorAll("[id^='preview-']");
  allPreviews.forEach(preview => preview.style.display = "none");
}

document.getElementById("btn-1").addEventListener("click", function () {
  const selectedTemplate = document.getElementById("templateSelect").value;
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
  if (!selectedResume) return alert("Selected template preview not found!");
  selectedResume.style.display = "block";

  document.getElementById(previewIds.name).textContent = document.getElementById("nameinput").value;
  document.getElementById(previewIds.email).textContent = document.getElementById("emailinput").value;
  document.getElementById(previewIds.phone).textContent = document.getElementById("phoneinput").value;
  document.getElementById(previewIds.summary).textContent = document.getElementById("suminput").value;
  document.getElementById(previewIds.edu).textContent = document.getElementById("eduinput").value;
  document.getElementById(previewIds.skills).textContent = document.getElementById("skillinput").value;
  document.getElementById(previewIds.aboutme).textContent = document.getElementById("aboutmeinput").value;

  const expArray = Array.from(document.querySelectorAll(".expinput")).map(input => input.value.trim()).filter(Boolean).map(exp => `<li>${exp}</li>`).join("");
  const projectArray = Array.from(document.querySelectorAll(".projectinput")).map(input => input.value.trim()).filter(Boolean).map(proj => `<li>${proj}</li>`).join("");

  document.getElementById(previewIds.exp).innerHTML = expArray;
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

  // ✅ Save entire resume to localStorage
  saveResumeToLocal();
});

// ===== PDF GENERATION =====

document.getElementById("btn-2").addEventListener("click", function (e) {
  e.preventDefault();
  const selectedTemplate = document.getElementById("templateSelect").value;
  const resume = document.getElementById(`preview-${selectedTemplate}`);
  if (!resume) return alert("Selected resume not found!");

  resume.style.display = "block";
  const originalColor = resume.style.color;
  const originalBg = resume.style.backgroundColor;
  resume.style.color = "black";
  resume.style.backgroundColor = "white";

  const name = document.getElementById(`${selectedTemplate}-name`)?.textContent?.trim()?.replace(/\s+/g, "_") || "resume";

  const opt = {
    margin: [20, 15, 20, 15],
    filename: `${name}_resume.pdf`,
    html2canvas: { scale: 2, useCORS: true, scrollX: 0, scrollY: 0, logging: true },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
  };

  html2pdf().set(opt).from(resume).save().then(() => {
    resume.style.color = originalColor;
    resume.style.backgroundColor = originalBg;
  }).catch(err => {
    console.error("PDF generation error:", err);
    resume.style.color = originalColor;
    resume.style.backgroundColor = originalBg;
  });
});

// ===== ADD EXPERIENCE & PROJECTS =====

document.getElementById("add-exp").addEventListener("click", function () {
  const explist = document.getElementById("experience-list");
  const newTextarea = document.createElement("textarea");
  newTextarea.className = "expinput";
  newTextarea.rows = 2;
  explist.appendChild(newTextarea);
  attachDynamicStorageSync(".expinput");
  updateATSResumeStorage();
});

document.getElementById("add-project").addEventListener("click", function () {
  const prolist = document.getElementById("project-list");
  const newTextarea = document.createElement("textarea");
  newTextarea.className = "projectinput";
  newTextarea.rows = 2;
  prolist.appendChild(newTextarea);
  attachDynamicStorageSync(".projectinput");
  updateATSResumeStorage();
});

// ===== ATS STORAGE SYNC =====

function updateATSResumeStorage() {
  const fullResume = `
    Name: ${document.getElementById("nameinput")?.value || ""}
    Email: ${document.getElementById("emailinput")?.value || ""}
    Phone: ${document.getElementById("phoneinput")?.value || ""}
    Summary: ${document.getElementById("suminput")?.value || ""}
    Education: ${document.getElementById("eduinput")?.value || ""}
    Skills: ${document.getElementById("skillinput")?.value || ""}
    About Me: ${document.getElementById("aboutmeinput")?.value || ""}
    Experience:\n${Array.from(document.querySelectorAll(".expinput")).map(el => el.value.trim()).filter(Boolean).join("\n")}
    Projects:\n${Array.from(document.querySelectorAll(".projectinput")).map(el => el.value.trim()).filter(Boolean).join("\n")}
  `.trim();

  localStorage.setItem("userResumeText", fullResume);
}

// Auto-sync fields
function attachStorageSync(selector) {
  document.querySelectorAll(selector).forEach(el => {
    el.addEventListener("input", updateATSResumeStorage);
  });
}
attachStorageSync("#nameinput, #emailinput, #phoneinput, #suminput, #eduinput, #skillinput, #aboutmeinput");

function attachDynamicStorageSync(className) {
  document.querySelectorAll(className).forEach(el => {
    if (!el.dataset.synced) {
      el.addEventListener("input", updateATSResumeStorage);
      el.dataset.synced = "true";
    }
  });
}
attachDynamicStorageSync(".expinput");
attachDynamicStorageSync(".projectinput");
updateATSResumeStorage(); // Initial load

// ===== ✅ STORE FULL RESUME (for persistent load) =====

function saveResumeToLocal() {
  const resumeData = {
    name: document.getElementById("nameinput").value,
    email: document.getElementById("emailinput").value,
    phone: document.getElementById("phoneinput").value,
    summary: document.getElementById("suminput").value,
    education: document.getElementById("eduinput").value,
    skills: document.getElementById("skillinput").value,
    aboutme: document.getElementById("aboutmeinput").value,
    linkedin: document.getElementById("linkedininput").value,
    github: document.getElementById("githubinput").value,
    portfolio: document.getElementById("portfoliourlinput").value,
    experience: Array.from(document.querySelectorAll(".expinput")).map(el => el.value),
    projects: Array.from(document.querySelectorAll(".projectinput")).map(el => el.value),
    imageSrc: document.getElementById("preview-image").src,
    selectedTemplate: document.getElementById("templateSelect").value
  };
  localStorage.setItem("userResumeData", JSON.stringify(resumeData));
}

// ===== ✅ LOAD RESUME ON PAGE LOAD =====

function loadResumeFromLocal() {
  const saved = localStorage.getItem("userResumeData");
  if (!saved) return;

  const data = JSON.parse(saved);
  document.getElementById("nameinput").value = data.name || "";
  document.getElementById("emailinput").value = data.email || "";
  document.getElementById("phoneinput").value = data.phone || "";
  document.getElementById("suminput").value = data.summary || "";
  document.getElementById("eduinput").value = data.education || "";
  document.getElementById("skillinput").value = data.skills || "";
  document.getElementById("aboutmeinput").value = data.aboutme || "";
  document.getElementById("linkedininput").value = data.linkedin || "";
  document.getElementById("githubinput").value = data.github || "";
  document.getElementById("portfoliourlinput").value = data.portfolio || "";
  document.getElementById("templateSelect").value = data.selectedTemplate || "classic";

  const expList = document.getElementById("experience-list");
  expList.innerHTML = "";
  data.experience?.forEach(val => {
    const textarea = document.createElement("textarea");
    textarea.className = "expinput";
    textarea.rows = 2;
    textarea.value = val;
    expList.appendChild(textarea);
  });

  const proList = document.getElementById("project-list");
  proList.innerHTML = "";
  data.projects?.forEach(val => {
    const textarea = document.createElement("textarea");
    textarea.className = "projectinput";
    textarea.rows = 2;
    textarea.value = val;
    proList.appendChild(textarea);
  });

  if (data.imageSrc?.startsWith("data:image")) {
    const img = document.getElementById("preview-image");
    img.src = data.imageSrc;
    img.style.display = "block";
  }

  // Re-attach sync after loading
  attachDynamicStorageSync(".expinput");
  attachDynamicStorageSync(".projectinput");
  updateATSResumeStorage();
}

window.addEventListener("DOMContentLoaded", loadResumeFromLocal);
