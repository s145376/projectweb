/* =====================================================================
   calculate.js  –  Study Hours Calculator (pages/calculate.html)

   RATIONALE
   STM helps students manage their time. This calculator estimates how
   many hours a student must study in one week and compares the result
   with the hours the student really has.

   FORMULA
     course hours     = credit hours x 2
     assignment hours = assignments x 1.5
     exam hours       = exams x 4        (+1 per exam if the courses are hard)
     project hours    = 4 if there is a group project, otherwise 0
     subtotal         = course + assignment + exam + project hours
     total            = subtotal x difficulty factor
                        (easy 0.9, medium 1.0, hard 1.2)
     hours per day    = total / study days
   ===================================================================== */

var calcForm = document.getElementById('calcForm');

// When the form is sent: check the numbers first, then calculate
calcForm.addEventListener('submit', function (event) {
  event.preventDefault();
  if (!calcForm.checkValidity()) {    // validation.js shows the red messages
    return;
  }
  calculate();
});

// Clear the result when the form is reset
document.getElementById('calcReset').addEventListener('click', function () {
  document.getElementById('calcResult').classList.add('d-none');
});

function calculate() {

  /* ---- Step 1: read the values from the form (Number() makes them numbers) ---- */
  var credits = Number(document.getElementById('calc_credits').value);
  var assignments = Number(document.getElementById('calc_assignments').value);
  var exams = Number(document.getElementById('calc_exams').value);
  var difficulty = document.getElementById('calc_difficulty').value;
  var available = Number(document.getElementById('calc_available').value);
  var days = Number(document.getElementById('calc_days').value);
  var hasProject = document.getElementById('calc_project').checked;   // true or false

  /* ---- Step 2: calculate the hours with the mathematical operators ---- */
  var courseHours = credits * 2;
  var assignmentHours = assignments * 1.5;
  var examHours = exams * 4;

  // Condition: hard courses need one extra hour for each exam
  if (difficulty === 'hard' && exams > 0) {
    examHours = examHours + exams;
  }

  // Condition: a group project adds 4 hours
  var projectHours = 0;
  if (hasProject) {
    projectHours = 4;
  }

  var subtotal = courseHours + assignmentHours + examHours + projectHours;

  // switch statement: the difficulty factor
  var factor;
  switch (difficulty) {
    case 'easy':
      factor = 0.9;
      break;
    case 'medium':
      factor = 1.0;
      break;
    default:            // "hard"
      factor = 1.2;
  }

  var total = subtotal * factor;
  var perDay = total / days;
  var difference = available - total;      // positive = free hours, negative = missing hours

  /* ---- Step 3: decide the status with if / else if / else ---- */
  var color, title, advice;

  if (total > available) {
    color = 'danger';
    title = 'Overloaded week';
    advice = 'You need ' + Math.abs(difference).toFixed(1) + ' more hours than you have. ' +
      'Move some tasks to next week or ask for more time.';
  } else if (total >= 0.8 * available) {
    color = 'warning';
    title = 'Busy but possible';
    advice = 'You have ' + difference.toFixed(1) + ' free hours left. Plan your days carefully.';
  } else {
    color = 'success';
    title = 'Light week';
    advice = 'You have ' + difference.toFixed(1) + ' free hours left. You can add a personal goal.';
  }

  /* ---- Step 4: extra warnings using logical operators (&&  ||) ---- */
  var warnings = [];

  // && means "and": both conditions must be true
  if (credits > 18 && exams >= 2) {
    warnings.push('Heavy semester: more than 18 credit hours and 2 or more exams.');
  }
  // || means "or": one condition is enough
  if (hasProject || assignments >= 5) {
    warnings.push('Start early: a project or 5 or more assignments need extra planning.');
  }
  if (perDay > 6 || (difficulty === 'hard' && perDay > 4)) {
    warnings.push('Studying more than 6 hours a day (or 4 hours for hard courses) is tiring. Add breaks.');
  }

  /* ---- Step 5: show the result on the page ---- */
  var html = '<div class="alert alert-' + color + '" role="alert">' +
    '<h2 class="h5">' + title + '</h2><p class="mb-0">' + advice + '</p></div>' +
    '<div class="card shadow-sm"><div class="card-body">' +
    '<h2 class="h5">Your calculation</h2>' +
    '<table class="table table-bordered table-sm mb-3"><tbody>' +
    '<tr><th scope="row">Course hours (' + credits + ' x 2)</th><td>' + courseHours.toFixed(1) + ' h</td></tr>' +
    '<tr><th scope="row">Assignment hours (' + assignments + ' x 1.5)</th><td>' + assignmentHours.toFixed(1) + ' h</td></tr>' +
    '<tr><th scope="row">Exam hours</th><td>' + examHours.toFixed(1) + ' h</td></tr>' +
    '<tr><th scope="row">Project hours</th><td>' + projectHours.toFixed(1) + ' h</td></tr>' +
    '<tr><th scope="row">Subtotal</th><td>' + subtotal.toFixed(1) + ' h</td></tr>' +
    '<tr><th scope="row">Difficulty factor</th><td>x ' + factor.toFixed(1) + '</td></tr>' +
    '<tr class="table-primary"><th scope="row">Total study hours</th><td><strong>' + total.toFixed(1) + ' h</strong></td></tr>' +
    '<tr><th scope="row">Hours available</th><td>' + available.toFixed(1) + ' h</td></tr>' +
    '<tr><th scope="row">Hours per day (' + days + ' days)</th><td>' + perDay.toFixed(1) + ' h</td></tr>' +
    '</tbody></table>';

  if (warnings.length > 0) {
    html = html + '<ul class="mb-0">';
    for (var i = 0; i < warnings.length; i++) {
      html = html + '<li>' + warnings[i] + '</li>';
    }
    html = html + '</ul>';
  }
  html = html + '</div></div>';

  var resultBox = document.getElementById('calcResult');
  resultBox.innerHTML = html;
  resultBox.classList.remove('d-none');
  resultBox.scrollIntoView();
}
