// gsap animation for startScreenGsap
export function startScreenGsap(timeline, elements) {
  timeline
    .set(elements.startScreen, { display: "flex", opacity: 0 })
    .set(elements.tournamentLogo, { scale: 0, opacity: 0, rotation: -30 }) // Rotated and scaled to zero
    .set(elements.tournamentName, { y: -30, opacity: 0 }) // Shifted 30px upward
    .set(".matchup-container", { y: 60, opacity: 0 }) // Shifted 60px downward
    .set(".team-block.home", { x: -50, opacity: 0 }) // Off-screen to the left
    .set(".team-block.away", { x: 50, opacity: 0 }) // Off-screen to the right
    .set(".vs-container", { scale: 0, rotation: -180, opacity: 0 }) // Fully spun and collapsed
    .set(".card-footer", { y: 25, opacity: 0 }) // Shifted downward
    .to(elements.startScreen, {
      opacity: 1,
      duration: 0.8,
      ease: "power2.out", // Smooth deceleration — feels like a light reveal
    })
    .to(
      elements.tournamentLogo,
      {
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: 1.2,
        ease: "elastic.out(1, 0.6)", // 1=amplitude, 0.6=period — controls bounce intensity
      },
      "-=0.3",
    ) // Start 0.3s before the fade finishes (they overlap slightly)
    .to(
      elements.tournamentName,
      {
        y: 0, // Move back to its natural vertical position
        opacity: 1,
        duration: 0.8,
        ease: "power3.out", // Fast start, elegant deceleration
      },
      "-=0.7",
    ) // Overlaps with the bouncing logo animation
    .to(
      ".matchup-container",
      {
        y: 0,
        opacity: 1,
        duration: 1.1,
        ease: "power4.out",
      },
      "-=0.6",
    )
    .to(
      ".team-block.home",
      {
        x: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
      },
      "-=0.7",
    )
    .to(
      ".team-block.away",
      {
        x: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
      },
      "-=0.6",
    )
    .to(
      ".vs-container",
      {
        scale: 1,
        rotation: 0,
        opacity: 1,
        duration: 0.9,
        ease: "back.out(2)", // 2 = stronger overshoot
      },
      "-=0.5",
    )
    .to(
      ".card-footer",
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
      },
      "-=0.4",
    );
}

// gsap animation for tournamentMatchGsap
export function tournamentMatchGsap(timeline, elements) {
  timeline
    .set(elements.tournamentBug, {
      opacity: 0,
      display: "flex",
      scale: 0,
      rotation: -180, // Full half-spin starting position
    })
    .set(elements.tournamentMatchLogo, { scale: 0.5, opacity: 0 }) // Logo starts at half size
    .set(elements.tournamentMatchName, { y: 30, opacity: 0 }) // Name starts 30px below
    .to(elements.tournamentBug, {
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 1.1,
      ease: "elastic.out(1, 0.75)",
    })
    .to(
      elements.tournamentMatchLogo,
      {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        ease: "back.out(1.5)",
      },
      "-=0.8",
    )
    .to(
      elements.tournamentMatchName,
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: "power3.out",
      },
      "-=0.6",
    );
}

// gsap animation for sponsorsGsap
export function sponsorsGsap(timeline, elements) {
  timeline
    .set(elements.sponsorsTicker, {
      opacity: 0,
      display: "flex",
      y: 100, // 100px below its final position
      scale: 0.9, // Slightly compressed — expands as it slides up
    })
    .to(elements.sponsorsTicker, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: "power3.out",
    });
}
let sponsorCycleTimeout = null; // setTimeout reference — needed to cancel the loop
let activeAnimations = []; // Tracks currently animating sponsor items for cleanup

// gsap animation for startSponsorsCarousel
export function startSponsorsCarousel(sponsors, index = 0) {
  const currentItem = document.getElementById(`sponsor-item-${index}`);
  if (!currentItem) return; // Safety guard: stop if no element found
  gsap.fromTo(
    currentItem,
    { opacity: 0, y: 20, visibility: "hidden" }, // FROM: hidden below
    {
      opacity: 1,
      y: 0,
      visibility: "visible", // Must set to visible so the element is rendered
      duration: 0.6,
      ease: "power2.out",
      onStart: () => {
        activeAnimations.push(currentItem);
      },
    },
  );
  if (sponsors.length > 1) {
    sponsorCycleTimeout = setTimeout(() => {
      gsap.to(currentItem, {
        opacity: 0,
        y: -20, // Slides upward as it exits
        duration: 0.5,
        ease: "power2.in", // Accelerate into exit — feels like it's being pulled away
        onComplete: () => {
          gsap.set(currentItem, { visibility: "hidden" }); // Hide after exit completes
          activeAnimations = activeAnimations.filter(
            (item) => item !== currentItem,
          );
          const nextIndex = (index + 1) % sponsors.length;
          startSponsorsCarousel(sponsors, nextIndex);
        },
      });
    }, 2000); // Display each sponsor logo for 3 seconds before transitioning
  }
}

// gsap animation for clearSponsorsCarousel
export function clearSponsorsCarousel() {
  if (sponsorCycleTimeout) {
    clearTimeout(sponsorCycleTimeout);
    sponsorCycleTimeout = null;
  }
  activeAnimations.forEach((item) => {
    gsap.killTweensOf(item); // Stop any running animation immediately
    gsap.set(item, { opacity: 0, visibility: "hidden", y: 0 }); // Reset to initial state
  });
  activeAnimations = [];
}

// gsap animation for renderAndStartSponsors
export function renderAndStartSponsors(elements, sponsors, sponsorsTimeline) {
  const urlLogos = "/uploads/misc/";
  elements.sponsorsListWrapper.innerHTML = "";
  sponsors.forEach((sponsor, idx) => {
    const sponsorItem = document.createElement("div");
    sponsorItem.className = "ticker-sponsor-item";
    sponsorItem.id = `sponsor-item-${idx}`; // ID used by startSponsorsCarousel()
    sponsorItem.innerHTML = `
      <img class="ticker-sponsor-logo" src="${urlLogos + sponsor.logoUrl}" alt="${sponsor.name}">
      <span class="ticker-sponsor-name">${sponsor.name}</span>
    `;
    elements.sponsorsListWrapper.appendChild(sponsorItem);
  });
  sponsorsTimeline.play();
  setTimeout(() => {
    startSponsorsCarousel(sponsors);
  }, 800); // 800ms matches the sponsorsGsap entrance duration
}

// gsap animation for weatherGsap
export function weatherGsap(timeline, elements) {
  timeline
    .set(elements.weatherOverlay, { display: "flex", opacity: 0, x: -150 })
    .set(
      [".weather-card-header", ".weather-temp-block", ".weather-stat-item"],
      { opacity: 0, y: 20 },
    )
    .to(elements.weatherOverlay, {
      opacity: 1,
      x: 0, // Moves to its natural horizontal position
      duration: 0.8,
      ease: "power3.out",
    })
    .to(
      [".weather-card-header", ".weather-temp-block", ".weather-stat-item"],
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.12, // Each element starts 0.12s after the previous
        ease: "power2.out",
      },
      "-=0.3", // Starts 0.3s before the card slide finishes
    );
}

// gsap animation for lineupGsap
export function lineupGsap(timeline, elements) {
  timeline
    .set(elements.lineupOverlay, {
      display: "flex",
      opacity: 0,
      x: -500, // Far off-screen left
    })
    .set(
      [
        ".lineup-team-identity",
        ".lineup-formation-badge",
        ".starters-col .column-title",
        "#lineup-list-starters .lineup-player-row",
        ".bench-col .column-title",
        "#lineup-list-bench .lineup-player-row",
      ],
      {
        opacity: 0,
        x: -40, // Offset to the left — they'll slide right when revealed
      },
    )
    .to(elements.lineupOverlay, {
      opacity: 1,
      x: 0,
      duration: 0.8,
      ease: "power3.out",
    })
    .to(
      [
        ".lineup-team-identity",
        ".lineup-formation-badge",
        ".starters-col .column-title",
        "#lineup-list-starters .lineup-player-row",
        ".bench-col .column-title",
        "#lineup-list-bench .lineup-player-row",
      ],
      {
        opacity: 1,
        x: 0,
        duration: 0.5,
        stagger: 0.04, // 40ms between each row — smooth sequential cascade
        ease: "power2.out",
      },
      "-=0.5",
    ); // Starts while the card is still sliding in
}

// gsap animation for tacticalLineupGsap
export function tacticalLineupGsap(timeline, elements) {
  timeline
    .set(elements.tacticalOverlay, {
      display: "flex",
      opacity: 0,
      x: -500, // Far off-screen to the left
    })
    .set([".tactical-team-identity", ".tactical-formation-badge"], {
      opacity: 0,
      y: -20, // Start 20px above their final position
    })
    .set(".pitch-markings", {
      opacity: 0,
      scale: 0.98, // Almost full size — gives a subtle "breathe in" entry
    })
    .set(".tactical-player-node", {
      opacity: 0,
      scale: 0, // Nodes start completely invisible and zero size
    })
    .to(elements.tacticalOverlay, {
      opacity: 1,
      x: 0,
      duration: 1.2,
      ease: "power3.out",
    })
    .to(
      [".tactical-team-identity", ".tactical-formation-badge"],
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: "power2.out",
      },
      "-=0.9",
    )
    .to(
      ".pitch-markings",
      {
        opacity: 1,
        scale: 1,
        duration: 0.7,
        ease: "power2.out",
      },
      "-=0.8",
    )
    .to(
      ".tactical-player-node",
      {
        opacity: 1,
        scale: 1,
        duration: 0.85,
        stagger: 0.06,
        ease: "elastic.out(1.1, 0.75)",
      },
      "-=0.7",
    );
}

// gsap animation for scoreBugGsap
export function scoreBugGsap(timeline, overlay) {
  const center = overlay.querySelector(".scorebug-center");
  const homeTeam = overlay.querySelector(".scorebug-home");
  const awayTeam = overlay.querySelector(".scorebug-away");
  const scores = overlay.querySelectorAll(".scorebug-score");
  const dash = overlay.querySelector(".scorebug-dash");
  const period = overlay.querySelector(".scorebug-period");
  const time = overlay.querySelector(".scorebug-time");
  const homeName = overlay.querySelector(".scorebug-home .scorebug-team-name");
  const awayName = overlay.querySelector(".scorebug-away .scorebug-team-name");
  const homeLogo = overlay.querySelector("#scorebug-home-logo");
  const awayLogo = overlay.querySelector("#scorebug-away-logo");
  timeline
    .set(overlay, { display: "flex", opacity: 0, y: 60, scale: 0.92 }) // Card starts 60px below
    .set(center, { opacity: 0, y: -18, scale: 0.85 }) // Center block from above
    .set(homeTeam, { opacity: 0, x: -40 }) // Home from left
    .set(awayTeam, { opacity: 0, x: 40 }) // Away from right
    .set([scores, dash], { opacity: 0, y: 12, scale: 0.7 }) // Scores from below, compressed
    .set(period, { opacity: 0, scale: 0, rotation: -15 }) // Period badge: collapsed + tilted
    .set(time, { opacity: 0 }) // Clock: just fades in last
    .set([homeName, awayName], { opacity: 0, y: 8 }) // Names from slightly below
    .set([homeLogo, awayLogo], { opacity: 0, scale: 0.4, rotation: -20 }) // Logos: small + rotated
    .to(overlay, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.7,
      ease: "expo.out",
    })
    .to(
      center,
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.55,
        ease: "back.out(1.6)",
      },
      "-=0.45",
    )
    .to(
      [homeLogo, awayLogo],
      {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: "back.out(1.8)",
      },
      "-=0.4",
    )
    .to(
      homeTeam,
      {
        opacity: 1,
        x: 0,
        duration: 0.45,
        ease: "power3.out",
      },
      "-=0.35",
    )
    .to(
      awayTeam,
      {
        opacity: 1,
        x: 0,
        duration: 0.45,
        ease: "power3.out",
      },
      "-=0.42",
    )
    .to(
      [homeName, awayName],
      {
        opacity: 1,
        y: 0,
        duration: 0.35,
        stagger: 0.06,
        ease: "power2.out",
      },
      "-=0.3",
    )
    .to(
      [scores, dash],
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        stagger: 0.07,
        ease: "elastic.out(1.2, 0.6)",
      },
      "-=0.3",
    )
    .to(
      period,
      {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.6,
        ease: "elastic.out(1.4, 0.55)",
      },
      "-=0.35",
    )
    .to(
      time,
      {
        opacity: 1,
        duration: 0.4,
        ease: "power1.inOut",
      },
      "-=0.2",
    );
}

// gsap animation for scoreBugGoalFlash
export function scoreBugGoalFlash(overlay, side, teamColor) {
  const scoreElement = overlay.querySelector(
    side === "home" ? "#scorebug-home-score" : "#scorebug-away-score",
  );
  const teamSide = overlay.querySelector(`.scorebug-${side}`);
  const center = overlay.querySelector(".scorebug-center");
  const flashColor = teamColor || "#fbbf24"; // Default to amber if no team color
  const hexToRgba = (hex, alpha) => {
    let c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split("");
      if (c.length === 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]]; // Expand shorthand hex (#abc → #aabbcc)
      }
      c = "0x" + c.join("");
      return (
        "rgba(" +
        [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",") +
        "," +
        alpha +
        ")"
      );
    }
    return `rgba(251,191,36,${alpha})`; // Fallback amber color
  };
  const timeline = gsap.timeline();
  timeline
    .to(scoreElement, {
      scale: 1.7, // Number grows to 170% — very visible impact
      color: flashColor, // Flash to team's primary color
      duration: 0.15,
      ease: "expo.out",
    })
    .to(
      teamSide,
      {
        background: hexToRgba(flashColor, 0.25), // 25% opacity team color bg
        duration: 0.15,
        ease: "power2.out",
      },
      "<",
    ) // "<" = starts AT THE SAME TIME as the score number scale
    .to(
      center,
      {
        background: hexToRgba(flashColor, 0.15), // 15% opacity — more subtle
        duration: 0.15,
      },
      "<",
    )
    .to(
      scoreElement,
      {
        scale: 1.15, // Stays 15% larger than original to draw attention to the updated score
        color: "#ffffff",
        duration: 0.4,
        ease: "elastic.out(1.2, 0.5)",
      },
      "+=0.1",
    ) // 0.1s pause after the initial flash before settling
    .to(
      [teamSide, center],
      {
        background: "transparent",
        duration: 0.3,
        ease: "power2.inOut",
        clearProps: "background", // Remove inline background style entirely when done
      },
      "-=0.3",
    )
    .to(
      scoreElement,
      {
        scale: 1,
        duration: 0.2,
        ease: "power2.out",
      },
      "-=0.1",
    );
}

// gsap animation for qrCodeGsap
export function qrCodeGsap(timeline, elements) {
  timeline
    .set(elements.qrcodeOverlay, {
      display: "block",
      opacity: 0,
      x: 40,
      y: 20,
      scale: 0.88,
    })
    .set(".qrcode-badge", { opacity: 0, y: -8 }) // Badge slides down from above
    .set(".qrcode-title", { opacity: 0, x: -20 }) // Title slides in from left
    .set(".qrcode-subtitle", { opacity: 0, x: -16 }) // Subtitle same as title
    .set(".qrcode-link-row", { opacity: 0, x: -16 }) // Social rows same
    .set(".qrcode-img-wrapper", { opacity: 0, scale: 0.6, rotation: -8 }) // QR: small and slightly tilted
    .to(elements.qrcodeOverlay, {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.7,
      ease: "expo.out",
    })
    .to(
      ".qrcode-badge",
      {
        opacity: 1,
        y: 0,
        duration: 0.35,
        ease: "power2.out",
      },
      "-=0.45",
    )
    .to(
      ".qrcode-title",
      {
        opacity: 1,
        x: 0,
        duration: 0.4,
        ease: "power3.out",
      },
      "-=0.3",
    )
    .to(
      ".qrcode-subtitle",
      {
        opacity: 1,
        x: 0,
        duration: 0.35,
        ease: "power2.out",
      },
      "-=0.25",
    )
    .to(
      ".qrcode-img-wrapper",
      {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.65,
        ease: "elastic.out(1, 0.6)",
      },
      "-=0.45",
    )
    .to(
      ".qrcode-link-row",
      {
        opacity: 1,
        x: 0,
        duration: 0.35,
        stagger: 0.07,
        ease: "back.out(1.2)",
      },
      "-=0.4",
    );
}

// gsap animation for lowerThirdGsap
export function lowerThirdGsap(timeline, elements) {
  timeline
    .set(elements.lowerthirdOverlay, {
      display: "block",
      opacity: 0,
      y: 30,
      scale: 0.95,
    })
    .set(".lowerthird-bar", { scaleY: 0, transformOrigin: "bottom center" })
    .set(".lowerthird-badge", { opacity: 0, x: -15 }) // Badge slides from left
    .set(".lowerthird-title", { opacity: 0, y: 8 }) // Title fades up
    .set(".lowerthird-subtitle", { opacity: 0, y: 8 }) // Subtitle fades up
    .to(elements.lowerthirdOverlay, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      ease: "power3.out",
    })
    .to(
      ".lowerthird-bar",
      {
        scaleY: 1,
        duration: 0.45,
        ease: "expo.out",
      },
      "-=0.35",
    )
    .to(
      ".lowerthird-badge",
      {
        opacity: 1,
        x: 0,
        duration: 0.4,
        ease: "back.out(1.5)",
      },
      "-=0.3",
    )
    .to(
      ".lowerthird-title",
      {
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: "power2.out",
      },
      "-=0.25",
    )
    .to(
      ".lowerthird-subtitle",
      {
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: "power2.out",
      },
      "-=0.35",
    );
}

// gsap animation for notifySubGsap
export function notifySubGsap(timeline, elements) {
  timeline
    .set(elements.overlay, { display: "flex", opacity: 0, y: 40, scale: 0.9 })
    .set(elements.card, { display: "flex", opacity: 0, scale: 0.9 })
    .set(".notify-sub-bar", { scaleY: 0, transformOrigin: "bottom center" }) // Accent bar draws up
    .set(".notify-sub-badge", { opacity: 0, y: -6 }) // Badge drops from above
    .set(".notify-sub-team", { opacity: 0, x: -15 }) // Team name from left
    .set("#notify-sub-out-row", { opacity: 0, x: -30, y: 0 }) // OUT player: from left
    .set("#notify-sub-in-row", { opacity: 0, x: 30, y: 0 }) // IN player: from right
    .to(elements.overlay, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.5,
      ease: "power3.out",
    })
    .to(
      elements.card,
      {
        opacity: 1,
        scale: 1,
        duration: 0.45,
        ease: "power2.out",
      },
      "-=0.35",
    )
    .to(
      ".notify-sub-bar",
      {
        scaleY: 1,
        duration: 0.4,
        ease: "expo.out",
      },
      "-=0.2",
    )
    .to(
      [".notify-sub-badge", ".notify-sub-team"],
      {
        opacity: 1,
        y: 0,
        x: 0,
        duration: 0.35,
        stagger: 0.08,
        ease: "power2.out",
      },
      "-=0.25",
    )
    .to(
      "#notify-sub-out-row",
      {
        opacity: 1,
        x: 0,
        duration: 0.45,
        ease: "back.out(1.2)",
      },
      "-=0.15",
    )
    .to(
      "#notify-sub-in-row",
      {
        opacity: 1,
        x: 0,
        duration: 0.45,
        ease: "back.out(1.2)",
      },
      "-=0.3",
    )
    .to(
      "#notify-sub-out-row",
      {
        y: 76, // Moves DOWN by 76px (updated row height after font increase)
        duration: 0.6,
        ease: "power2.inOut",
      },
      "+=1.5",
    )
    .to(
      "#notify-sub-in-row",
      {
        y: -76, // Moves UP by 76px simultaneously
        duration: 0.6,
        ease: "power2.inOut",
      },
      "<",
    ); // "<" = starts at the SAME TIME as the OUT row movement
}

// gsap animation for notifyCardGsap
export function notifyCardGsap(timeline, elements) {
  timeline
    .set(elements.overlay, { display: "flex", opacity: 0, y: 45, scale: 0.88 })
    .set(elements.card, { display: "flex", opacity: 0, scale: 0.92 })
    .set(".card-visual", { opacity: 0, scale: 0.4, rotationY: -180 }) // Start with back face (Y rotation)
    .set(".card-badge", { opacity: 0, y: -6 })
    .set(".card-player-info", { opacity: 0, x: 20 })
    .set(".card-team-name", { opacity: 0, x: 15 })
    .to(elements.overlay, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.55,
      ease: "power3.out",
    })
    .to(
      elements.card,
      {
        opacity: 1,
        scale: 1,
        duration: 0.45,
        ease: "power2.out",
      },
      "-=0.4",
    )
    .to(
      ".card-visual",
      {
        opacity: 1,
        scale: 1,
        rotationY: 0, // Rotate from -180° back to 0° (fully visible)
        duration: 0.7,
        ease: "back.out(1.5)",
      },
      "-=0.3",
    )
    .to(
      ".card-badge",
      {
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      },
      "-=0.45",
    )
    .to(
      ".card-player-info",
      {
        opacity: 1,
        x: 0,
        duration: 0.4,
        ease: "back.out(1.2)",
      },
      "-=0.35",
    )
    .to(
      ".card-team-name",
      {
        opacity: 1,
        x: 0,
        duration: 0.35,
        ease: "power2.out",
      },
      "-=0.25",
    );
}

// gsap animation for notifyVarGsap
export function notifyVarGsap(timeline, elements) {
  timeline
    .set(elements.overlay, { display: "flex", opacity: 0, y: 50, scale: 0.85 })
    .set(elements.card, { display: "flex", opacity: 0, scale: 0.95 })
    .set(".var-card-bar", { scaleY: 0, transformOrigin: "top center" }) // Bar draws DOWN from top
    .set(".var-badge", { opacity: 0, scale: 0.5 }) // Badge starts at half size
    .set(".var-title", { opacity: 0, y: -10 }) // Title slides from above
    .set(".var-detail", { opacity: 0, y: 10 }) // Detail slides from below
    .to(elements.overlay, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      ease: "power4.out",
    })
    .to(
      elements.card,
      {
        opacity: 1,
        scale: 1,
        duration: 0.5,
      },
      "-=0.45",
    )
    .to(
      ".var-card-bar",
      {
        scaleY: 1,
        duration: 0.4,
        ease: "expo.out",
      },
      "-=0.25",
    )
    .to(
      ".var-badge",
      {
        opacity: 1,
        scale: 1,
        duration: 0.45,
        ease: "elastic.out(1.2, 0.6)",
      },
      "-=0.2",
    )
    .to(
      [".var-title", ".var-detail"],
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.08,
        ease: "power2.out",
      },
      "-=0.3",
    );
}

// gsap animation for notifyPenaltyGsap
export function notifyPenaltyGsap(timeline, elements) {
  timeline
    .set(elements.overlay, { display: "flex", opacity: 0, y: 40, scale: 0.9 })
    .set(elements.card, { display: "flex", opacity: 0, scale: 0.92 })
    .set(".penalty-card-bar", { scaleY: 0, transformOrigin: "bottom center" }) // Bar draws UP
    .set(".penalty-badge", { opacity: 0, y: -8 }) // Badge drops from above
    .set(".penalty-player-name", { opacity: 0, x: -15 }) // Player name from left
    .set(".penalty-team", { opacity: 0, y: 8 }) // Team name from below
    .set(".penalty-goal-net", {
      opacity: 0,
      scale: 0.7,
      transformOrigin: "center right",
    }) // Net expands
    .set(".penalty-shot-dot", { opacity: 0, scale: 0 }) // Shot dots start invisible + collapsed
    .to(elements.overlay, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.55,
      ease: "power3.out",
    })
    .to(
      elements.card,
      {
        opacity: 1,
        scale: 1,
        duration: 0.45,
        ease: "power2.out",
      },
      "-=0.4",
    )
    .to(
      ".penalty-card-bar",
      {
        scaleY: 1,
        duration: 0.4,
        ease: "expo.out",
      },
      "-=0.25",
    )
    .to(
      ".penalty-badge",
      {
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: "back.out(1.4)",
      },
      "-=0.2",
    )
    .to(
      ".penalty-player-name",
      {
        opacity: 1,
        x: 0,
        duration: 0.4,
        ease: "power2.out",
      },
      "-=0.3",
    )
    .to(
      ".penalty-team",
      {
        opacity: 1,
        y: 0,
        duration: 0.35,
        ease: "power2.out",
      },
      "-=0.35",
    )
    .to(
      ".penalty-goal-net",
      {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "back.out(1.2)",
      },
      "-=0.3",
    )
    .to(
      ".penalty-shot-dot",
      {
        opacity: 1,
        scale: 1,
        duration: 0.55,
        stagger: 0.08, // 80ms gap between each dot popping in
        ease: "back.out(1.6)", // Strong overshoot — makes each dot feel impactful
      },
      "-=0.15",
    );
}

// gsap animation for matchStatisticsGsap
export function matchStatisticsGsap(timeline, elements) {
  timeline
    .set(elements.matchStatsOverlay, {
      opacity: 0,
      display: "flex",
      scale: 0.85,
      y: 40,
    })
    .set("#stats-home-logo", { opacity: 0, scale: 0, rotation: -20 }) // Home: tilted left
    .set("#stats-away-logo", { opacity: 0, scale: 0, rotation: 20 }) // Away: tilted right
    .set("#stats-home-name", { opacity: 0, x: -30 }) // Slide from left
    .set("#stats-away-name", { opacity: 0, x: 30 }) // Slide from right
    .set(".stats-score-pill", { opacity: 0, scale: 0.5 }) // Starts at half size
    .set(".stats-badge", { opacity: 0, y: -10 }) // Drops from above
    .set("#stats-period", { opacity: 0, y: 8 }) // Fades up from below
    .set(".stats-row", { opacity: 0, x: -24 })
    .to(elements.matchStatsOverlay, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.75,
      ease: "power3.out",
    })
    .to(
      ".stats-badge",
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
      },
      "-=0.5",
    )
    .to(
      ["#stats-home-logo", "#stats-away-logo"],
      {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.7,
        stagger: 0.1, // 100ms between home and away logo — home appears first
        ease: "back.out(2)",
      },
      "-=0.35",
    )
    .to(
      "#stats-home-name",
      {
        opacity: 1,
        x: 0,
        duration: 0.5,
        ease: "power3.out",
      },
      "-=0.5",
    )
    .to(
      "#stats-away-name",
      {
        opacity: 1,
        x: 0,
        duration: 0.5,
        ease: "power3.out",
      },
      "<",
    ) // "<" = starts at the SAME time as home name — they arrive together
    .to(
      ".stats-score-pill",
      {
        opacity: 1,
        scale: 1,
        duration: 0.55,
        ease: "elastic.out(1, 0.6)",
      },
      "-=0.3",
    )
    .to(
      "#stats-period",
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
      },
      "-=0.3",
    )
    .to(
      ".stats-row",
      {
        opacity: 1,
        x: 0,
        duration: 0.45,
        stagger: 0.07, // 70ms between each row — readable cascade speed
        ease: "back.out(1.2)",
      },
      "-=0.2",
    );
}

// gsap animation for notifyOffsideGsap
export function notifyOffsideGsap(timeline, elements) {
  timeline
    .set(elements.overlay, { display: "flex", opacity: 0, y: 40, scale: 0.92 })
    .set(elements.card, { display: "flex", opacity: 0, scale: 0.9 })
    .set(".offside-card-bar", { scaleY: 0, transformOrigin: "top center" }) // Bar draws DOWN from top
    .set(".offside-badge", { opacity: 0, x: -20 }) // Badge slides from left
    .set(".offside-player-name", { opacity: 0, x: -15 }) // Player name slides from left
    .set(".offside-meta", { opacity: 0, y: 6 }) // Meta fades up from below
    .to(elements.overlay, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.5,
      ease: "power3.out",
    })
    .to(
      elements.card,
      {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: "power2.out",
      },
      "-=0.35",
    )
    .to(
      ".offside-card-bar",
      {
        scaleY: 1,
        duration: 0.4,
        ease: "expo.out",
      },
      "-=0.2",
    )
    .to(
      ".offside-badge",
      {
        opacity: 1,
        x: 0,
        duration: 0.4,
        ease: "back.out(1.3)",
      },
      "-=0.25",
    )
    .to(
      ".offside-player-name",
      {
        opacity: 1,
        x: 0,
        duration: 0.45,
        ease: "power3.out",
      },
      "-=0.3",
    )
    .to(
      ".offside-meta",
      {
        opacity: 1,
        y: 0,
        duration: 0.35,
        ease: "power2.out",
      },
      "-=0.3",
    );
}

// gsap animation for playerSpotlightGsap
export function playerSpotlightGsap(timeline, elements) {
  timeline
    .set(elements.overlay, { display: "block", opacity: 0 })
    .set(elements.card, {
      opacity: 0,
      y: 60,
      rotationY: 25,
      rotationX: 10,
      scale: 0.95,
      transformOrigin: "center left",
    })
    .set(".spotlight-glow", { opacity: 0, scale: 0.6 })
    .set(".spotlight-accent-bar", { scaleY: 0, transformOrigin: "top center" })
    .set([".spotlight-team-info", ".spotlight-position"], {
      opacity: 0,
      y: -10,
    })
    .set(".spotlight-name", { opacity: 0, x: -30 })
    .set(".spotlight-stat-box", { opacity: 0, scale: 0.7, y: 15 })
    .set(".spotlight-player-img", {
      opacity: 0,
      scale: 0.5,
      rotation: 12,
      x: 50,
    })
    .to(elements.overlay, { opacity: 1, duration: 0.3 })
    .to(
      elements.card,
      {
        opacity: 1,
        y: 0,
        rotationY: 0,
        rotationX: 0,
        scale: 1,
        duration: 0.85,
        ease: "power3.out",
      },
      "-=0.2",
    )
    .to(
      ".spotlight-glow",
      {
        opacity: 0.15,
        scale: 1,
        duration: 0.8,
        ease: "power2.out",
      },
      "-=0.6",
    )
    .to(
      ".spotlight-accent-bar",
      {
        scaleY: 1,
        duration: 0.5,
        ease: "expo.out",
      },
      "-=0.7",
    )
    .to(
      [".spotlight-team-info", ".spotlight-position"],
      {
        opacity: 1,
        y: 0,
        duration: 0.45,
        stagger: 0.08,
        ease: "power2.out",
      },
      "-=0.65",
    )
    .to(
      ".spotlight-name",
      {
        opacity: 1,
        x: 0,
        duration: 0.5,
        ease: "power3.out",
      },
      "-=0.5",
    )
    .to(
      ".spotlight-player-img",
      {
        opacity: 1,
        scale: 1.15,
        rotation: 0,
        x: 0,
        duration: 1.1,
        ease: "elastic.out(1, 0.75)",
      },
      "-=0.6",
    )
    .to(
      ".spotlight-stat-box",
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.07, // 70ms cascade spacing
        ease: "back.out(1.5)",
      },
      "-=0.75",
    );
}

// gsap animation for notifyCustomGsap
export function notifyCustomGsap(timeline, elements) {
  timeline
    .set(elements.overlay, { display: "flex", opacity: 0, y: 40, scale: 0.92 })
    .set(elements.card, { display: "flex", opacity: 0, scale: 0.9 })
    .set(".custom-card-bar", { scaleY: 0, transformOrigin: "top center" })
    .set(".custom-badge", { opacity: 0, x: -20 })
    .set(".custom-player-name", { opacity: 0, x: -15 })
    .set(".custom-text", { opacity: 0, y: 6 })
    .to(elements.overlay, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.5,
      ease: "power3.out",
    })
    .to(
      elements.card,
      {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: "power2.out",
      },
      "-=0.35",
    )
    .to(
      ".custom-card-bar",
      {
        scaleY: 1,
        duration: 0.4,
        ease: "expo.out",
      },
      "-=0.2",
    )
    .to(
      ".custom-badge",
      {
        opacity: 1,
        x: 0,
        duration: 0.4,
        ease: "back.out(1.3)",
      },
      "-=0.25",
    )
    .to(
      ".custom-player-name",
      {
        opacity: 1,
        x: 0,
        duration: 0.4,
        ease: "power2.out",
      },
      "-=0.2",
    )
    .to(
      ".custom-text",
      {
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: "power2.out",
      },
      "-=0.25",
    );
}

// gsap animation for notifyHydrationGsap (World Cup Hydration / Cooling Break)
export function notifyHydrationGsap(timeline, elements) {
  timeline
    .set(elements.overlay, { display: "flex", opacity: 0, y: 40, scale: 0.92 })
    .set(elements.card, { display: "flex", opacity: 0, scale: 0.9 })
    .set(".hydration-card-bar", { scaleY: 0, transformOrigin: "top center" })
    .set(".hydration-badge", { opacity: 0, x: -20 })
    .set(".hydration-title", { opacity: 0, x: -15 })
    .set(".hydration-detail", { opacity: 0, y: 6 })
    .set(".hydration-pill", { opacity: 0, scale: 0.5, rotation: -10 })
    .to(elements.overlay, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.5,
      ease: "power3.out",
    })
    .to(
      elements.card,
      {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: "power2.out",
      },
      "-=0.35",
    )
    .to(
      ".hydration-card-bar",
      {
        scaleY: 1,
        duration: 0.4,
        ease: "expo.out",
      },
      "-=0.2",
    )
    .to(
      ".hydration-badge",
      {
        opacity: 1,
        x: 0,
        duration: 0.4,
        ease: "back.out(1.3)",
      },
      "-=0.25",
    )
    .to(
      ".hydration-title",
      {
        opacity: 1,
        x: 0,
        duration: 0.4,
        ease: "power2.out",
      },
      "-=0.2",
    )
    .to(
      ".hydration-detail",
      {
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: "power2.out",
      },
      "-=0.25",
    )
    .to(
      ".hydration-pill",
      {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.5,
        ease: "back.out(1.5)",
      },
      "-=0.3",
    );
}
