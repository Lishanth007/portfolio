document.addEventListener("DOMContentLoaded", function () {
  const menu = document.getElementById("menu");
  const cmdInput = document.getElementById("cmd-input");
  const terminal = document.querySelector(".cmd-terminal");
  const prompt = document.getElementById("prompt");

  cmdInput.focus();

  terminal.addEventListener("click", () => {
    cmdInput.focus();
  });

  menu.addEventListener("click", function (e) {
    if (e.target.tagName === "LI") {
      cmdInput.textContent = e.target.textContent.trim();
      placeCursorAtEnd(cmdInput);
      cmdInput.focus();
    }
  });

  cmdInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      const command = cmdInput.textContent.trim().toLowerCase();
      cmdInput.textContent = "";

      if (command === "clear") {
        Array.from(terminal.children).forEach((line) => {
          if (line.id !== "prompt") terminal.removeChild(line);
        });
        return;
      }

      const commandLine = document.createElement("p");
      commandLine.innerHTML = formatPrompt() + ` ${command}`;
      terminal.insertBefore(commandLine, prompt);

      const knownCommands = Object.keys(commandResponses);

      if (knownCommands.includes(command)) {
        const lines = commandResponses[command];
        typeText(lines, terminal, prompt);
      } else {
        const errorLine1 = document.createElement("p");
        errorLine1.textContent = `'${command}' is not recognized as an internal or external command,`;
        const errorLine2 = document.createElement("p");
        errorLine2.textContent = "operable program or batch file.";
        terminal.insertBefore(errorLine1, prompt);
        terminal.insertBefore(errorLine2, prompt);
        placeCursorAtEnd(cmdInput);
      }

      // Scroll terminal to bottom
      terminal.scrollTop = terminal.scrollHeight;
    }
  });

  function placeCursorAtEnd(el) {
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(el);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
    el.focus();
  }

  function typeText(lines, terminal, prompt) {
    let i = 0;
    prompt.style.display = "none";

    function typeNextLine() {
      if (i >= lines.length) {
        prompt.style.display = "block";
        placeCursorAtEnd(document.getElementById("cmd-input"));
        return;
      }

      const text = lines[i];
      const line = document.createElement("p");
      terminal.insertBefore(line, prompt);

      let charIndex = 0;

      function typeChar() {
        charIndex++;
        line.textContent = text.slice(0, charIndex);

        if (charIndex < text.length) {
          setTimeout(typeChar, 10);
        } else {
          // Render full line as HTML so <a> tags are clickable
          line.innerHTML = text;
          i++;
          terminal.scrollTop = terminal.scrollHeight; // auto-scroll
          setTimeout(typeNextLine, 200);
        }
      }

      typeChar();
    }

    typeNextLine();
  }

  function formatPrompt() {
    return `
      <span class="path-green">C:</span>\\
      <span class="path-cyan">portfolio</span>\\
      <span class="path-yellow">Users</span>\\
      <span class="path-magenta">lishanth</span>
      <span class="path-gray">></span>
    `;
  }

  const commandResponses = {
    "about": [
      "Hi, I'm Lishanth.",
      "I'm a passionate developer and designer.",
      "I build modern, responsive portfolio websites using HTML, CSS, and JavaScript.",
      "I enjoy crafting terminal-style user interfaces like this one.",
      "Type 'projects' to see what I've built!"
    ],
    "home": [
      "Welcome to my portfolio homepage.",
      "Use the commands above or type directly and give enter.",
      "Try 'about' or 'projects' to get started!"
    ],
    "intro": [
      "Hello! I'm Lishanth — a fresher Java Full Stack Developer",
      "I completed BCA in Computer Application from University of Madras collage (UG Graduated in 2023).",
      "I'm currently pursuing my MCA (Master of Computer Applications) at University of Madras (2025–2026).",
      "I've trained in Java, Spring Boot, HTML, CSS, JavaScript, and SQL.",
      "This portfolio showcases the projects I’ve built and the skills I’ve gained.",
      "Type 'projects' to check out my work or 'contact' to connect with me.",
    ],
    "contact": [
      "You can reach me at:",
      '<i class="fas fa-envelope"></i> Email: <a href="mailto:lishanth487@example.com">lishanth487@example.com</a>',
      '<i class="fas fa-phone"></i> Phone: +91 6382900306',
      '<i class="fab fa-linkedin"></i> LinkedIn: <a href="https://www.linkedin.com/in/lishanth/" target="_blank">linkedin.com/in/lishanth</a>',
      '<i class="fab fa-github"></i> GitHub: <a href="https://github.com/Lishanth007" target="_blank">github.com/Lishanth007</a>'
    ],
    "projects": [
      "Here are some of my key projects:",
  
  "<strong>🖱️ Virtual Mouse using Python & OpenCV</strong>",
  "- Controlled the mouse cursor using hand gestures via webcam.",
  "- Used Computer Vision (OpenCV, Mediapipe) for real-time tracking.",
  "- Eliminates need for physical mouse — a gesture-based interaction system.",
  
  "<strong>🛒 E-Commerce Website (Java + Spring Boot + Angular)</strong>",
  "- Built a full-stack e-commerce app with product listings, cart, and admin panel.",
  "- Backend: Spring Boot, REST APIs, MySQL; Frontend: Angular.",
  "- Implemented authentication, product CRUD, and responsive UI.",
  
  "<strong>🎙️ Voice Assistant using Python</strong>",
  "- Created a desktop voice assistant that performs system tasks via voice.",
  "- Integrated speech recognition and text-to-speech libraries.",
  "- Handles tasks like web search, opening apps, telling time, etc.",
  
  "<strong>💻 Terminal Portfolio (this website!)</strong>",
  "- Designed this interactive terminal-style portfolio using HTML, CSS, and JavaScript.",
  "- Inspired by command-line interfaces to create a unique web experience.",
  
  "More projects coming soon..."
    ],
    "help": [
      "Available commands:",
      "- home",
      "- intro",
      "- about",
      "- contact",
      "- projects",
      "- clear",
      "- help"
    ]
  };
});
