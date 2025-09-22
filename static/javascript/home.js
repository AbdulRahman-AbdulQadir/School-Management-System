// static/javascript/home.js
// Homepage-specific interactions — runs after load (defer).
document.addEventListener('DOMContentLoaded', function () {
  // Example: smooth scroll focus when clicking Quick actions
  const quickAction = document.querySelector('a[href="#quick-actions"]');
  if (quickAction) {
    quickAction.addEventListener('click', (e) => {
      // custom behaviour if needed
    });
  }

  // Placeholder for homepage-only initializers
});