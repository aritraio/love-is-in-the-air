/**
 * =============================================
 *  VALENTINE PROPOSAL — INTERACTIVE EXPERIENCE
 * =============================================
 *
 *  Vanilla JS, no frameworks. State-machine driven
 *  "No" button with 6 stages, localStorage persistence,
 *  particle effects, and a cinematic success screen.
 */

(function () {
  "use strict";

  // =========================================
  // CONSTANTS & CONFIGURATION
  // =========================================

  const STORAGE_KEY = "valentine_accepted";

  /** "No" button stages — text for each click */
  const NO_STAGES = [
    "No",
    "Are you sure?",
    "Think carefully 😔",
    "This feels statistically incorrect.",
    "System recommendation: Click Yes.",
    // Stage 6 = escaping mode (text stays the same)
    "Nice try 😏",
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
  const successScreen = document.getElementById("success-screen");
  const btnYes = document.getElementById("btn-yes");
  const btnNo = document.getElementById("btn-no");
  const particleCanvas = document.getElementById("particle-canvas");
  const heartCanvas = document.getElementById("heart-canvas");

  // =========================================
  // STATE
  // =========================================

  let noClickCount = 0;
  let isEscaping = false;

  // =========================================
  // PERSISTENCE — CHECK ON LOAD
  // =========================================

  if (localStorage.getItem(STORAGE_KEY) === "true") {
    showSuccessImmediately();
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
    localStorage.setItem(STORAGE_KEY, "true");

    // Fade out proposal card
    proposalCard.style.opacity = "0";
    proposalCard.style.transform = "translateY(-20px) scale(0.95)";

    setTimeout(function () {
      proposalScreen.classList.add("hidden");

      // Show success screen
      successScreen.classList.remove("hidden");

      // Trigger heart/particle celebration
      if (!prefersReducedMotion) {
        startHeartCelebration();
      }
    }, 500);
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

    // Shrink the No button progressively
    var shrinkFactor = 1 - noClickCount * 0.1;
    shrinkFactor = Math.max(shrinkFactor, 0.5); // don't shrink beyond 50%
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
    var yesScale = 1 + noClickCount * 0.06;
    yesScale = Math.min(yesScale, 1.4);
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
    var padding = 16; // viewport padding

    var maxX = window.innerWidth - btnW - padding;
    var maxY = window.innerHeight - btnH - padding;

    // Generate random position ensuring full visibility
    var newX = padding + Math.random() * Math.max(maxX - padding, 0);
    var newY = padding + Math.random() * Math.max(maxY - padding, 0);

    // Ensure it moves at least 30% of viewport away from current position
    var attempts = 0;
    while (attempts < 10) {
      var dx = Math.abs(newX - rect.left);
      var dy = Math.abs(newY - rect.top);
      if (dx > window.innerWidth * 0.2 || dy > window.innerHeight * 0.2) {
        break;
      }
      newX = padding + Math.random() * Math.max(maxX - padding, 0);
      newY = padding + Math.random() * Math.max(maxY - padding, 0);
      attempts++;
    }

    btnNo.style.left = newX + "px";
    btnNo.style.top = newY + "px";
  }

  // =========================================
  // IMMEDIATE SUCCESS (localStorage recall)
  // =========================================

  function showSuccessImmediately() {
    proposalScreen.classList.add("hidden");
    proposalScreen.style.display = "none";
    successScreen.classList.remove("hidden");

    if (!prefersReducedMotion) {
      startHeartCelebration();
    }
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
      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3 - 0.15, // slight upward drift
        opacity: Math.random() * 0.3 + 0.05,
        hue: Math.random() > 0.5 ? 340 : 35, // rose or gold
      };
    }

    function animate() {
      ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < -10) p.x = particleCanvas.width + 10;
        if (p.x > particleCanvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = particleCanvas.height + 10;
        if (p.y > particleCanvas.height + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle =
          "hsla(" + p.hue + ", 60%, 70%, " + p.opacity + ")";
        ctx.fill();
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
    var totalHearts = 35;
    var totalDots = 20;

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
        y: window.innerHeight + Math.random() * 200 + 50,
        size: Math.random() * 16 + 8,
        speed: Math.random() * 1.2 + 0.4,
        drift: (Math.random() - 0.5) * 0.8,
        opacity: Math.random() * 0.5 + 0.2,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
      });
    }

    // Create soft glow dots
    for (var j = 0; j < totalDots; j++) {
      glowDots.push({
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + Math.random() * 300 + 100,
        radius: Math.random() * 3 + 1,
        speed: Math.random() * 0.6 + 0.2,
        drift: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.4 + 0.1,
        hue: Math.random() > 0.6 ? 340 : 40,
      });
    }

    function drawHeart(ctx, x, y, size, rotation, opacity) {
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

      ctx.fillStyle = "rgba(212, 87, 122, 0.8)";
      ctx.fill();

      // Soft glow
      ctx.shadowColor = "rgba(212, 87, 122, 0.3)";
      ctx.shadowBlur = 15;
      ctx.fill();

      ctx.restore();
    }

    function animate() {
      ctx.clearRect(0, 0, heartCanvas.width, heartCanvas.height);

      // Draw hearts
      for (var i = 0; i < hearts.length; i++) {
        var h = hearts[i];
        h.y -= h.speed;
        h.x += h.drift;
        h.rotation += h.rotSpeed;

        // Recycle when off top
        if (h.y < -40) {
          h.y = heartCanvas.height + 40;
          h.x = Math.random() * heartCanvas.width;
        }

        drawHeart(ctx, h.x, h.y, h.size, h.rotation, h.opacity);
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

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
        ctx.fillStyle =
          "hsla(" + d.hue + ", 60%, 75%, " + d.opacity + ")";
        ctx.fill();
      }

      requestAnimationFrame(animate);
    }

    animate();
  }
})();
