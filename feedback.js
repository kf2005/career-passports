  // --- Feedback ---
function bindFeedback() {
  const form = document.querySelector('#feedback form');
  const submitBtn = form.querySelector('button[type="button"]');

  if (!form || !submitBtn) return;

  submitBtn.addEventListener('click', () => {
    const name = form.querySelector('input[type="text"]').value.trim();
    const email = form.querySelector('input[type="email"]').value.trim();
    const topic = form.querySelector('select').value;
    const message = form.querySelector('textarea').value.trim();

    if (!name) {
      alert("Please enter your name.");
      form.querySelector('input[type="text"]').focus();
      return;
    }

    if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
      form.querySelector('input[type="email"]').focus();
      return;
    }

    if (!topic) {
      alert("Please select a topic.");
      form.querySelector('select').focus();
      return;
    }

    if (!message) {
      alert("Please enter your message.");
      form.querySelector('textarea').focus();
      return;
    }

    alert("Thank you for your feedback! We appreciate it.");
    form.reset();
  });

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
}

// Run after DOM is ready
document.addEventListener('DOMContentLoaded', bindFeedback);

