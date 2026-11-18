/* =====================================================================
   questionnaire.js  –  Feedback questionnaire (pages/questionnaire.html)

   This page does NOT use the browser's default validation. Every rule is
   written here with JavaScript. Bootstrap only gives the colours:
     - class "is-valid"   -> green border
     - class "is-invalid" -> red border + the red message under the box

   Validation rules (all different):
     1. Full name      -> regular expression: 2 to 4 words, letters only
     2. E-mail         -> regular expression: advanced e-mail pattern
     3. Mobile number  -> regular expression: Omani number
     4. Student ID     -> regular expression: 6 digits starting with 1
     5. Study level    -> a choice must be made (select box)
     6. Satisfaction   -> one radio button must be chosen
     7. Parts used     -> at least one check box must be ticked
     8. Comments       -> at least 8 words and no repeated letters
   ===================================================================== */


/* ---------------------------------------------------------------------
   REGULAR EXPRESSIONS (patterns)
   --------------------------------------------------------------------- */

// NAME: first word of 2+ letters, then 1 to 3 more words of 2+ letters.
// Words are separated by one space, one hyphen or one apostrophe.
//   [A-Za-z\u0621-\u064A]  = English letters or Arabic letters
//   {2,}                   = two or more
//   (?: ... ){1,3}         = a group (not remembered) repeated 1 to 3 times
// Good: "Hamed Al-Shekaili"      Bad: "Hamed" or "H4med Ali"
var namePattern = /^[A-Za-z\u0621-\u064A]{2,}(?:[ '-][A-Za-z\u0621-\u064A]{2,}){1,3}$/;

// E-MAIL: letters/digits/. _ % + - then @ then a domain with at least one dot.
//   (?!.*\.\.)          = "negative look-ahead": two dots in a row are not allowed
//   [A-Za-z0-9]         = must start with a letter or digit
//   (?:...)?            = optional middle part that must end with a letter or digit
//   @(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+  = domain words followed by a dot
//   [A-Za-z]{2,}        = last part (com, om, edu ...) has 2 or more letters
var emailPattern = /^(?!.*\.\.)[A-Za-z0-9](?:[A-Za-z0-9._%+-]*[A-Za-z0-9])?@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/;

// PHONE (Oman): optional +968 or 00968, then 8 digits starting with 7 or 9.
// A space or hyphen is allowed after the prefix and in the middle.
// Good: "+968 9123 4567", "91234567"     Bad: "81234567"
var phonePattern = /^(?:\+968|00968)?[ -]?[79]\d{3}[ -]?\d{4}$/;

// STUDENT ID: exactly 6 digits, the first digit is 1.  Good: "145376"
var idPattern = /^1\d{5}$/;

// REPEATED CHARACTERS: the same character 6 or more times in a row.
//   (.)    = remember one character
//   \1{5,} = the same character again 5 or more times
var repeatedPattern = /(.)\1{5,}/;


/* ---------------------------------------------------------------------
   Page elements
   --------------------------------------------------------------------- */
var form = document.getElementById('feedbackForm');
var nameBox = document.getElementById('fb_name');
var emailBox = document.getElementById('fb_email');
var phoneBox = document.getElementById('fb_phone');
var idBox = document.getElementById('fb_id');
var levelBox = document.getElementById('fb_level');
var commentsBox = document.getElementById('fb_comments');


/* ---------------------------------------------------------------------
   HELPER FUNCTIONS
   --------------------------------------------------------------------- */

// Show a green or a red state on a text box / select / textarea.
//   box     = the form control
//   ok      = true if the value is correct
//   message = the red message to show when it is not correct
function showState(box, ok, message) {
  box.classList.remove('is-valid', 'is-invalid');           // remove the old state
  box.classList.add(ok ? 'is-valid' : 'is-invalid');        // add the new state
  document.getElementById(box.id + '_msg').textContent = message;   // write the message
  return ok;
}

// Show or hide the red message under a group of radio buttons / check boxes
function showGroupMessage(messageId, ok, message) {
  var box = document.getElementById(messageId);
  box.textContent = message;
  if (ok) {
    box.classList.add('d-none');       // hide it
  } else {
    box.classList.remove('d-none');    // show it
  }
  return ok;
}


/* ---------------------------------------------------------------------
   ONE CHECK FUNCTION FOR EACH CONTROL (each returns true or false)
   --------------------------------------------------------------------- */

function checkName() {
  var value = nameBox.value.trim();
  return showState(nameBox, namePattern.test(value),
    'Enter your full name: 2 to 4 words, letters only (example: Hamed Al-Shekaili).');
}

function checkEmail() {
  var value = emailBox.value.trim();
  return showState(emailBox, emailPattern.test(value),
    'Enter a valid e-mail address (example: s145376@student.squ.edu.om).');
}

function checkPhone() {
  var value = phoneBox.value.trim();
  return showState(phoneBox, phonePattern.test(value),
    'Enter an Omani mobile number: 8 digits starting with 7 or 9 (example: +968 9123 4567).');
}

function checkStudentId() {
  var value = idBox.value.trim();
  return showState(idBox, idPattern.test(value),
    'The student ID must have 6 digits and start with 1 (example: 145376).');
}

function checkLevel() {
  return showState(levelBox, levelBox.value !== '', 'Please choose your study level.');
}

// Radio buttons: look for the one that is checked
function checkRating() {
  var chosen = form.querySelector('input[name="fb_rating"]:checked');
  return showGroupMessage('fb_rating_msg', chosen !== null, 'Please choose how satisfied you are.');
}

// Check boxes: count how many are ticked
function checkFeatures() {
  var ticked = form.querySelectorAll('input[name="fb_features"]:checked');
  return showGroupMessage('fb_features_msg', ticked.length > 0, 'Please tick at least one part of STM.');
}

// Comments: at least 8 words, and no letter repeated 6 times in a row
function checkComments() {
  var text = commentsBox.value.trim();
  var words = text === '' ? 0 : text.split(/\s+/).length;   // split on spaces to count words
  var message = '';

  if (words < 8) {
    message = 'Please write at least 8 words (you wrote ' + words + ').';
  } else if (repeatedPattern.test(text)) {
    message = 'Please do not repeat the same character many times.';
  }
  return showState(commentsBox, message === '', message);
}


/* ---------------------------------------------------------------------
   EVENTS
   --------------------------------------------------------------------- */

// Check each control when the user leaves it (blur) or changes it
nameBox.addEventListener('blur', checkName);
emailBox.addEventListener('blur', checkEmail);
phoneBox.addEventListener('blur', checkPhone);
idBox.addEventListener('blur', checkStudentId);
levelBox.addEventListener('change', checkLevel);
commentsBox.addEventListener('blur', checkComments);

var ratingButtons = form.querySelectorAll('input[name="fb_rating"]');
for (var i = 0; i < ratingButtons.length; i++) {
  ratingButtons[i].addEventListener('change', checkRating);
}
var featureBoxes = form.querySelectorAll('input[name="fb_features"]');
for (var j = 0; j < featureBoxes.length; j++) {
  featureBoxes[j].addEventListener('change', checkFeatures);
}

// The slider shows its number in a badge
var easySlider = document.getElementById('fb_ease');
easySlider.addEventListener('input', function () {
  document.getElementById('fb_ease_value').textContent = easySlider.value;
});

// When the form is sent
form.addEventListener('submit', function (event) {
  event.preventDefault();    // we decide ourselves if the form is accepted

  // Run ALL the checks (not only until the first mistake) so that every
  // wrong control gets its red message.
  var results = [
    checkName(), checkEmail(), checkPhone(), checkStudentId(),
    checkLevel(), checkRating(), checkFeatures(), checkComments()
  ];

  // The form is correct only if no result is false
  var allCorrect = results.indexOf(false) === -1;
  var resultBox = document.getElementById('feedbackResult');

  if (allCorrect) {
    resultBox.className = 'alert alert-success';
    resultBox.textContent = 'Thank you, ' + nameBox.value.trim() + '! Your feedback was accepted.';
    clearStates();
    form.reset();
    document.getElementById('fb_ease_value').textContent = '5';
  } else {
    resultBox.className = 'alert alert-danger';
    resultBox.textContent = 'Please correct the red fields and send the form again.';
  }
  resultBox.scrollIntoView();
});

// Remove all green / red states and messages (used after sending and on Clear)
function clearStates() {
  var boxes = [nameBox, emailBox, phoneBox, idBox, levelBox, commentsBox];
  for (var k = 0; k < boxes.length; k++) {
    boxes[k].classList.remove('is-valid', 'is-invalid');
  }
  document.getElementById('fb_rating_msg').classList.add('d-none');
  document.getElementById('fb_features_msg').classList.add('d-none');
}

document.getElementById('fb_reset').addEventListener('click', clearStates);
