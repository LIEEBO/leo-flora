/* Prepare a message only. WhatsApp still requires the visitor to press Send. */
(() => {
  'use strict';
  const form = document.getElementById('enquiry-form');
  if (!form) return;
  const name = document.getElementById('enquiry-name');
  name.addEventListener('input', () => name.setCustomValidity(''));
  form.addEventListener('submit', (event) => {
    const customer = name.value.trim();
    if (!customer) {
      event.preventDefault();
      name.setCustomValidity('Please enter your name or company.');
      name.reportValidity();
      return;
    }
    const market = document.getElementById('enquiry-market').value.trim();
    const category = document.getElementById('enquiry-category').value;
    const requirements = document.getElementById('enquiry-message').value.trim();
    document.getElementById('enquiry-text').value = [
      'Hello LEO FAUX, I would like a wholesale quotation.',
      'Name / Company: ' + customer,
      market ? 'Country / Region: ' + market : '',
      'Interested in: ' + category,
      requirements ? 'Requirements: ' + requirements : ''
    ].filter(Boolean).join('\n');
    // Let the native GET form encode the message and open WhatsApp.
  });
})();
