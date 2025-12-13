import confetti from "canvas-confetti";

/**
 * Fire gold-themed confetti for successful buy orders
 */
export function fireGoldConfetti() {
  // Gold color palette matching HD Investing Corp theme
  const goldColors = ["#d4af37", "#c9a962", "#f5d742", "#ffd700", "#e8c252"];

  // First burst - center
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: goldColors,
    disableForReducedMotion: true,
  });

  // Second burst - left side (delayed)
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
      colors: goldColors,
      disableForReducedMotion: true,
    });
  }, 150);

  // Third burst - right side (delayed)
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.6 },
      colors: goldColors,
      disableForReducedMotion: true,
    });
  }, 300);
}

/**
 * Fire a more subtle confetti for smaller wins
 */
export function fireSubtleConfetti() {
  const goldColors = ["#d4af37", "#c9a962", "#ffd700"];

  confetti({
    particleCount: 50,
    spread: 60,
    origin: { y: 0.7 },
    colors: goldColors,
    gravity: 1.2,
    scalar: 0.8,
    disableForReducedMotion: true,
  });
}
