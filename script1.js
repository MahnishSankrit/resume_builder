const grammarCheckEnabled = () => document.getElementById("toggleGrammarCheck")?.checked;

// Individual field grammar correction
function attachAutoCorrection(inputElement) {
  let timer;
  inputElement.addEventListener("input", function () {
    clearTimeout(timer);
    const text = this.value;

    if (!grammarCheckEnabled()) return;

    timer = setTimeout(() => {
      correctGrammar(text, inputElement);
    }, 500);
  });
}

// Correct grammar for a single textarea
async function correctGrammar(text, textarea) {
  if (!text.trim()) return;

  try {
    const response = await fetch("https://api.languagetool.org/v2/check", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        text: text,
        language: "en-US",
      }),
    });

    const result = await response.json();
    if (!result.matches || result.matches.length === 0) return;

    let offset = 0;
    for (let match of result.matches) {
      if (!match.replacements?.length) continue;

      const replacement = match.replacements[0].value;
      const start = match.offset + offset;
      const end = start + match.length;

      text = text.slice(0, start) + replacement + text.slice(end);
      offset += replacement.length - match.length;
    }

    textarea.value = text;
  } catch (error) {
    console.warn("Grammar check error:", error);
  }
}

// Attach to static fields
attachAutoCorrection(document.getElementById("suminput"));
attachAutoCorrection(document.getElementById("aboutmeinput"));

// Attach to Experience fields (including dynamically added)
function attachExperienceAutoCorrection() {
  document.querySelectorAll(".expinput").forEach((textarea) => {
    if (!textarea.dataset.attached) {
      attachAutoCorrection(textarea);
      textarea.dataset.attached = "true";
    }
  });
}
attachExperienceAutoCorrection();

// Support dynamic experience fields
document.getElementById("add-exp").addEventListener("click", () => {
  const newTextArea = document.createElement("textarea");
  newTextArea.className = "expinput";
  newTextArea.rows = 2;
  document.getElementById("experience-list").appendChild(newTextArea);
  attachExperienceAutoCorrection();
});

// Optional: re-enable grammar check after toggle
document.getElementById("toggleGrammarCheck").addEventListener("change", () => {
  attachExperienceAutoCorrection();
});

// ✅ Global button for correcting all grammar at once
document.getElementById("correctAllGrammarBtn").addEventListener("click", async () => {
  if (!grammarCheckEnabled()) {
    alert("Grammar check is disabled. Please enable it first ✅.");
    return;
  }

  // Fields to correct
  const fieldsToCorrect = [
    document.getElementById("suminput"),
    document.getElementById("aboutmeinput"),
    ...document.querySelectorAll(".expinput")
  ];

  for (let field of fieldsToCorrect) {
    await correctGrammar(field.value, field);
  }

  alert("✅ All fields corrected.");
});
