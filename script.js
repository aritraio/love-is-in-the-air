/**
 * =============================================
 *  VALENTINE PROPOSAL — INTERACTIVE EXPERIENCE
 * =============================================
 *
 *  Vanilla JS, no frameworks. State-machine driven
 *  "No" button with 6 stages, particle effects,
 *  theme toggle, mood reactions, and a cinematic
 *  success screen.
 *
 *  No localStorage persistence — always asks fresh.
 */

(function () {
  "use strict";

  // =========================================
  // CONSTANTS & CONFIGURATION
  // =========================================

  const THEME_KEY = "valentine_theme";

  /** "No" button stages — text + emoji for each click */
  const NO_STAGES = [
    "No 🙅",
    "Are you sure? 🤨",
    "Think carefully 😔",
    "This feels statistically incorrect 📊",
    "System recommendation: Click Yes 💡",
    // Stage 6 = escaping mode
    "Nice try 😏",
  ];

  /** Mood emojis corresponding to each No stage */
  const MOOD_STAGES = [
    "🥰",  // default — hopeful
    "😊",  // still optimistic
    "🥺",  // getting worried
    "😢",  // sad
    "😤",  // frustrated
    "💀",  // dramatically dead
    "👻",  // ghost mode — escaping
  ];

  /** Subtext that changes with each No click */
  const SUBTEXT_STAGES = [
    "This is a one-time, non-refundable, emotionally binding question. 📜",
    "Okay, I'll ask again... but with more feeling this time. 🎭",
    "My heart is loading a counterargument... 💭",
    "Even my algorithm didn't predict this outcome. 🤖",
    "At this point, Yes is the path of least resistance. ⚡",
    "I'm not saying it's a bug, but... 🐛",
    "You've unlocked: desperation mode. 🔓",
  ];

  /** Maximum particles for the ambient background */
  const MAX_PARTICLES = 20;

  /** Whether the user prefers reduced motion */
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // =========================================
  // DOM REFERENCES
  // =========================================

  const proposalScreen = document.getElementById("proposal-screen");
  const proposalCard = document.getElementById("proposal-card");
  const proposalSubtext = document.getElementById("proposal-subtext");
  const successScreen = document.getElementById("success-screen");
  const btnYes = document.getElementById("btn-yes");
  const btnNo = document.getElementById("btn-no");
  const particleCanvas = document.getElementById("particle-canvas");
  const heartCanvas = document.getElementById("heart-canvas");
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = themeToggle.querySelector(".theme-icon");
  const moodEmoji = document.getElementById("mood-emoji");
  const stageDots = document.querySelectorAll(".dot");

  // =========================================
  // STATE
  // =========================================

  let noClickCount = 0;
  let isEscaping = false;
  let currentTheme = "dark";

  // =========================================
  // THEME — INIT & TOGGLE
  // =========================================

  // Load saved theme preference
  var savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === "light" || savedTheme === "dark") {
    currentTheme = savedTheme;
  }
  applyTheme(currentTheme);

  themeToggle.addEventListener("click", function () {
    currentTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(currentTheme);
    localStorage.setItem(THEME_KEY, currentTheme);
  });

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    if (theme === "light") {
      themeIcon.textContent = "☀️";
      themeToggle.setAttribute("aria-label", "Switch to dark theme");
    } else {
      themeIcon.textContent = "🌙";
      themeToggle.setAttribute("aria-label", "Switch to light theme");
    }
  }

  // =========================================
  // EVENT LISTENERS
  // =========================================

  btnYes.addEventListener("click", handleYesClick);
  btnNo.addEventListener("click", handleNoClick);

  // Desktop: dodge on hover when in escaping mode
  btnNo.addEventListener("mouseenter", function () {
    if (isEscaping) {
      dodgeButton();
    }
  });

  // =========================================
  // HANDLER — YES CLICK
  // =========================================

  function handleYesClick() {
    // Animate the card out with a satisfying scale-up pop
    proposalCard.style.opacity = "0";
    proposalCard.style.transform = "translateY(-30px) scale(1.05)";
    proposalCard.style.filter = "blur(8px)";

    // Hide escaping No button if it exists
    if (isEscaping) {
      btnNo.style.opacity = "0";
      btnNo.style.pointerEvents = "none";
    }

    setTimeout(function () {
      proposalScreen.classList.add("hidden");

      // Show success screen
      successScreen.classList.remove("hidden");

      // Trigger heart/particle celebration
      if (!prefersReducedMotion) {
        startHeartCelebration();
      }
    }, 550);
  }

  // =========================================
  // HANDLER — NO CLICK
  // =========================================

  function handleNoClick() {
    noClickCount++;

    // Clamp to max stage
    var stageIndex = Math.min(noClickCount, NO_STAGES.length - 1);

    // Update button text
    btnNo.textContent = NO_STAGES[stageIndex];

    // Update subtext with new witty message
    var subtextIndex = Math.min(noClickCount, SUBTEXT_STAGES.length - 1);
    proposalSubtext.textContent = SUBTEXT_STAGES[subtextIndex];

    // Update mood emoji with flip animation
    var moodIndex = Math.min(noClickCount, MOOD_STAGES.length - 1);
    moodEmoji.classList.add("mood-change");
    setTimeout(function () {
      moodEmoji.textContent = MOOD_STAGES[moodIndex];
    }, 150);
    setTimeout(function () {
      moodEmoji.classList.remove("mood-change");
    }, 500);

    // Light up progress dots
    for (var d = 0; d < stageDots.length; d++) {
      if (d < noClickCount) {
        stageDots[d].classList.add("active");
      }
    }

    // Shake the card
    if (!prefersReducedMotion) {
      proposalCard.classList.remove("card-shake");
      // Force reflow to restart animation
      void proposalCard.offsetWidth;
      proposalCard.classList.add("card-shake");
    }

    // Shrink the No button progressively
    var shrinkFactor = 1 - noClickCount * 0.1;
    shrinkFactor = Math.max(shrinkFactor, 0.5);
    btnNo.style.transform = "scale(" + shrinkFactor + ")";

    // Reduce padding
    var paddingV = Math.max(14 - noClickCount * 1.5, 6);
    var paddingH = Math.max(32 - noClickCount * 3, 12);
    btnNo.style.padding = paddingV + "px " + paddingH + "px";

    // Reduce font size
    var fontSize = Math.max(1 - noClickCount * 0.05, 0.72);
    btnNo.style.fontSize = fontSize + "rem";

    // Fade the No button slightly
    var opacity = Math.max(1 - noClickCount * 0.08, 0.45);
    btnNo.style.opacity = opacity;

    // Grow Yes button — increase glow & scale
    var yesScale = 1 + noClickCount * 0.07;
    yesScale = Math.min(yesScale, 1.45);
    document.documentElement.style.setProperty("--yes-scale", yesScale);

    var glowIntensity = 0.4 + noClickCount * 0.1;
    glowIntensity = Math.min(glowIntensity, 0.95);
    document.documentElement.style.setProperty(
      "--yes-glow-intensity",
      glowIntensity
    );

    // Speed up pulse
    var pulseSpeed = Math.max(2.8 - noClickCount * 0.35, 0.8);
    document.documentElement.style.setProperty(
      "--yes-pulse-speed",
      pulseSpeed + "s"
    );

    // Stage 6: enter escaping mode
    if (noClickCount >= NO_STAGES.length - 1 && !isEscaping) {
      enterEscapingMode();
    } else if (isEscaping) {
      // Already escaping — dodge on every tap (mobile)
      dodgeButton();
    }
  }

  // =========================================
  // ESCAPING MODE
  // =========================================

  function enterEscapingMode() {
    isEscaping = true;

    // Get the current position before switching to fixed
    var rect = btnNo.getBoundingClientRect();

    btnNo.classList.add("escaping");
    btnNo.style.top = rect.top + "px";
    btnNo.style.left = rect.left + "px";
    btnNo.style.width = rect.width + "px";

    // Immediately dodge once
    requestAnimationFrame(function () {
      dodgeButton();
    });
  }

  /**
   * Move the No button to a random safe position
   * within the viewport, ensuring it never clips.
   */
  function dodgeButton() {
    var rect = btnNo.getBoundingClientRect();
    var btnW = rect.width;
    var btnH = rect.height;
    var padding = 20;

    var maxX = window.innerWidth - btnW - padding;
    var maxY = window.innerHeight - btnH - padding;

    // Generate random position ensuring full visibility
    var newX = padding + Math.random() * Math.max(maxX - padding, 0);
    var newY = padding + Math.random() * Math.max(maxY - padding, 0);

    // Ensure it moves at least 25% of viewport away from current position
    var attempts = 0;
    while (attempts < 12) {
      var dx = Math.abs(newX - rect.left);
      var dy = Math.abs(newY - rect.top);
      if (dx > window.innerWidth * 0.2 || dy > window.innerHeight * 0.2) {
        break;
      }
      newX = padding + Math.random() * Math.max(maxX - padding, 0);
      newY = padding + Math.random() * Math.max(maxY - padding, 0);
      attempts++;
    }

    // Add a slight random rotation for personality
    var rotation = (Math.random() - 0.5) * 12;
    btnNo.style.left = newX + "px";
    btnNo.style.top = newY + "px";
    btnNo.style.transform = "scale(" + Math.max(0.5, 1 - noClickCount * 0.1) + ") rotate(" + rotation + "deg)";
  }

  // =========================================
  // PARTICLE BACKGROUND (AMBIENT)
  // =========================================

  if (!prefersReducedMotion) {
    initParticles();
  }

  function initParticles() {
    var ctx = particleCanvas.getContext("2d");
    var particles = [];
    var connections = [];

    function resize() {
      particleCanvas.width = window.innerWidth;
      particleCanvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    // Create particles
    for (var i = 0; i < MAX_PARTICLES; i++) {
      particles.push(createParticle());
    }

    function createParticle() {
      var isSpecial = Math.random() > 0.85; // 15% chance of being a sparkle
      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: isSpecial ? Math.random() * 3 + 1.5 : Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35 - 0.12,
        opacity: Math.random() * 0.35 + 0.08,
        baseOpacity: 0,
        hue: Math.random() > 0.6 ? 340 : (Math.random() > 0.5 ? 35 : 270),
        isSpecial: isSpecial,
        pulseOffset: Math.random() * Math.PI * 2,
      };
    }

    var time = 0;

    function animate() {
      ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
      time += 0.01;

      // Check dark/light theme to adjust particle appearance
      var isDark = document.documentElement.getAttribute("data-theme") !== "light";

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Pulsing opacity for special particles
        if (p.isSpecial) {
          p.baseOpacity = p.opacity + Math.sin(time * 2 + p.pulseOffset) * 0.15;
        } else {
          p.baseOpacity = p.opacity;
        }

        // Wrap around edges
        if (p.x < -10) p.x = particleCanvas.width + 10;
        if (p.x > particleCanvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = particleCanvas.height + 10;
        if (p.y > particleCanvas.height + 10) p.y = -10;

        // Draw glow for special particles
        if (p.isSpecial) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
          var glowAlpha = p.baseOpacity * 0.15;
          if (!isDark) glowAlpha *= 0.5;
          ctx.fillStyle = "hsla(" + p.hue + ", 70%, 70%, " + glowAlpha + ")";
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        var alpha = isDark ? p.baseOpacity : p.baseOpacity * 0.6;
        var lightness = isDark ? 70 : 50;
        ctx.fillStyle = "hsla(" + p.hue + ", 65%, " + lightness + "%, " + alpha + ")";
        ctx.fill();
      }

      // Draw faint connection lines between nearby particles
      if (isDark) {
        for (var a = 0; a < particles.length; a++) {
          for (var b = a + 1; b < particles.length; b++) {
            var dx = particles[a].x - particles[b].x;
            var dy = particles[a].y - particles[b].y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
              ctx.beginPath();
              ctx.moveTo(particles[a].x, particles[a].y);
              ctx.lineTo(particles[b].x, particles[b].y);
              var lineAlpha = (1 - dist / 120) * 0.06;
              ctx.strokeStyle = "rgba(200, 180, 220, " + lineAlpha + ")";
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }

      requestAnimationFrame(animate);
    }

    animate();
  }

  // =========================================
  // HEART CELEBRATION (SUCCESS SCREEN)
  // =========================================

  function startHeartCelebration() {
    var ctx = heartCanvas.getContext("2d");
    var hearts = [];
    var glowDots = [];
    var sparkles = [];
    var totalHearts = 40;
    var totalDots = 25;
    var totalSparkles = 15;

    function resize() {
      heartCanvas.width = window.innerWidth;
      heartCanvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    // Create floating hearts
    for (var i = 0; i < totalHearts; i++) {
      hearts.push({
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + Math.random() * 300 + 50,
        size: Math.random() * 18 + 8,
        speed: Math.random() * 1.4 + 0.3,
        drift: (Math.random() - 0.5) * 1,
        opacity: Math.random() * 0.5 + 0.15,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.025,
        hue: 330 + Math.random() * 30, // rose range
      });
    }

    // Create soft glow dots
    for (var j = 0; j < totalDots; j++) {
      glowDots.push({
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + Math.random() * 400 + 100,
        radius: Math.random() * 3.5 + 1,
        speed: Math.random() * 0.7 + 0.15,
        drift: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.45 + 0.1,
        hue: Math.random() > 0.5 ? 340 : (Math.random() > 0.5 ? 40 : 270),
      });
    }

    // Create sparkle bursts
    for (var k = 0; k < totalSparkles; k++) {
      sparkles.push({
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + Math.random() * 200,
        size: Math.random() * 4 + 2,
        speed: Math.random() * 1.8 + 0.5,
        drift: (Math.random() - 0.5) * 0.6,
        opacity: Math.random() * 0.7 + 0.3,
        pulseSpeed: Math.random() * 3 + 1,
        phase: Math.random() * Math.PI * 2,
      });
    }

    var time = 0;

    function drawHeart(ctx, x, y, size, rotation, opacity, hue) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.scale(size / 30, size / 30);
      ctx.globalAlpha = opacity;

      ctx.beginPath();
      ctx.moveTo(0, -8);
      ctx.bezierCurveTo(-15, -25, -30, -5, 0, 15);
      ctx.moveTo(0, -8);
      ctx.bezierCurveTo(15, -25, 30, -5, 0, 15);

      var h = hue || 340;
      ctx.fillStyle = "hsla(" + h + ", 65%, 55%, 0.85)";
      ctx.fill();

      ctx.shadowColor = "hsla(" + h + ", 65%, 55%, 0.3)";
      ctx.shadowBlur = 18;
      ctx.fill();

      ctx.restore();
    }

    function drawSparkle(ctx, x, y, size, opacity) {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.fillStyle = "rgba(255, 240, 200, 0.9)";
      ctx.shadowColor = "rgba(255, 215, 0, 0.5)";
      ctx.shadowBlur = 10;

      // 4-point star
      ctx.beginPath();
      ctx.moveTo(x, y - size);
      ctx.lineTo(x + size * 0.3, y - size * 0.3);
      ctx.lineTo(x + size, y);
      ctx.lineTo(x + size * 0.3, y + size * 0.3);
      ctx.lineTo(x, y + size);
      ctx.lineTo(x - size * 0.3, y + size * 0.3);
      ctx.lineTo(x - size, y);
      ctx.lineTo(x - size * 0.3, y - size * 0.3);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }

    function animate() {
      ctx.clearRect(0, 0, heartCanvas.width, heartCanvas.height);
      time += 0.016;

      // Draw hearts
      for (var i = 0; i < hearts.length; i++) {
        var h = hearts[i];
        h.y -= h.speed;
        h.x += h.drift + Math.sin(time + i) * 0.3;
        h.rotation += h.rotSpeed;

        if (h.y < -40) {
          h.y = heartCanvas.height + 40;
          h.x = Math.random() * heartCanvas.width;
        }

        drawHeart(ctx, h.x, h.y, h.size, h.rotation, h.opacity, h.hue);
      }

      // Draw glow dots
      for (var j = 0; j < glowDots.length; j++) {
        var d = glowDots[j];
        d.y -= d.speed;
        d.x += d.drift;

        if (d.y < -20) {
          d.y = heartCanvas.height + 20;
          d.x = Math.random() * heartCanvas.width;
        }

        // Outer glow
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.radius * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "hsla(" + d.hue + ", 60%, 75%, " + (d.opacity * 0.2) + ")";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
        ctx.fillStyle = "hsla(" + d.hue + ", 60%, 75%, " + d.opacity + ")";
        ctx.fill();
      }

      // Draw sparkles
      for (var k = 0; k < sparkles.length; k++) {
        var s = sparkles[k];
        s.y -= s.speed;
        s.x += s.drift;
        var sparkleOpacity = s.opacity * (0.5 + Math.sin(time * s.pulseSpeed + s.phase) * 0.5);

        if (s.y < -20) {
          s.y = heartCanvas.height + 20;
          s.x = Math.random() * heartCanvas.width;
        }

        drawSparkle(ctx, s.x, s.y, s.size, sparkleOpacity);
      }

      requestAnimationFrame(animate);
    }

    animate();
  }
})();
