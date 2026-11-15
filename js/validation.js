/* =====================================================================
   validation.js  –  Bootstrap form validation (used by most pages)

   How it works
   1. Every form that has the class "needs-validation" is found.
   2. When the user presses the submit button, the browser checks the
      rules written in the HTML (required, minlength, pattern, min, max,
      type="email" ...) with form.checkValidity().
   3. If something is wrong, the form is NOT sent. Bootstrap shows the
      red messages (class "invalid-feedback") because we add the class
      "was-validated" to the form.
   4. If everything is correct, the form is sent as normal.
   ===================================================================== */

(function () {
  'use strict';

  // Find all the forms that need validation
  var forms = document.querySelectorAll('.needs-validation');

  for (var i = 0; i < forms.length; i++) {
    setUpForm(forms[i]);
  }

  // Add the validation events to one form
  function setUpForm(form) {

    // "Confirm password" boxes have data-match="id of the first password".
    // The browser cannot compare two boxes, so we do it here.
    var matchBox = form.querySelector('[data-match]');
    if (matchBox) {
      var firstBox = document.getElementById(matchBox.getAttribute('data-match'));
      var checkMatch = function () {
        if (matchBox.value !== firstBox.value) {
          matchBox.setCustomValidity('The passwords are different');   // makes the box invalid
        } else {
          matchBox.setCustomValidity('');                              // makes the box valid again
        }
      };
      matchBox.addEventListener('input', checkMatch);
      firstBox.addEventListener('input', checkMatch);
      checkMatch();
    }

    // When the form is submitted
    form.addEventListener('submit', function (event) {
      if (!form.checkValidity()) {
        event.preventDefault();    // stop sending the form
        event.stopPropagation();
      }
      form.classList.add('was-validated');   // show the green / red feedback
    });

    // When the user presses "Reset" / "Clear", remove the colours
    form.addEventListener('reset', function () {
      form.classList.remove('was-validated');
    });
  }
})();
