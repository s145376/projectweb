/* =====================================================================
   courses.js  –  Courses page (pages/courses.html)

   This file does four things:
   1. Defines the object type "Course" (constructor function).
   2. Keeps all courses in an array called "courses".
   3. Shows the array in the (empty) workload table using displayCourses().
   4. Lets the user ADD a course and SEARCH the courses.
   ===================================================================== */


/* ---------------------------------------------------------------------
   1. OBJECT TYPE
   --------------------------------------------------------------------- */
function Course(semester, code, name, instructor, credits, assignments, exams, projects, open, done) {
  this.semester = semester;       // for example "Fall 2026"
  this.code = code;               // for example "COMP3700"
  this.name = name;               // course name
  this.instructor = instructor;   // instructor name or "TBA"
  this.credits = credits;         // credit hours (number)
  this.assignments = assignments; // number of assignments
  this.exams = exams;             // number of exams
  this.projects = projects;       // number of projects
  this.open = open;               // tasks still open
  this.done = done;               // tasks finished
}


/* ---------------------------------------------------------------------
   2. ARRAY OF OBJECTS (the real data of the old XHTML table)
   --------------------------------------------------------------------- */
var courses = [
  new Course('Fall 2026', 'COMP3700', 'Web Computing', 'Dr. Ahmed Soleimani', 3, 2, 2, 2, 2, 4),
  new Course('Fall 2026', 'COMP3600', 'Intelligent Systems', 'TBA', 3, 1, 3, 1, 2, 3),
  new Course('Fall 2026', 'COMP3205', 'Database Systems', 'TBA', 3, 2, 1, 1, 3, 1),
  new Course('Fall 2026', 'MATH2108', 'Calculus II', 'TBA', 4, 4, 3, 0, 2, 5)
];


/* ---------------------------------------------------------------------
   3. FUNCTION THAT DISPLAYS AN ARRAY IN THE TABLE
   It deletes the old rows, adds one row for each course, and writes a
   "Total" row at the bottom of the table.
   --------------------------------------------------------------------- */

// Add one cell (td) with a text to a row
function addCourseCell(row, text) {
  var cell = document.createElement('td');
  cell.textContent = text;
  row.appendChild(cell);
}

// THE FUNCTION: show a list of courses in the table
function displayCourses(list) {
  var body = document.getElementById('courseBody');
  var foot = document.getElementById('courseFoot');
  body.innerHTML = '';   // remove the old rows
  foot.innerHTML = '';

  // the totals are calculated while we add the rows
  var totalCredits = 0, totalAssignments = 0, totalExams = 0;
  var totalProjects = 0, totalOpen = 0, totalDone = 0;

  for (var i = 0; i < list.length; i++) {
    var c = list[i];
    var row = document.createElement('tr');
    addCourseCell(row, c.semester);
    addCourseCell(row, c.code);
    addCourseCell(row, c.name);
    addCourseCell(row, c.instructor);
    addCourseCell(row, c.credits);
    addCourseCell(row, c.assignments);
    addCourseCell(row, c.exams);
    addCourseCell(row, c.projects);
    addCourseCell(row, c.open);
    addCourseCell(row, c.done);
    body.appendChild(row);

    // add this course to the totals
    totalCredits = totalCredits + c.credits;
    totalAssignments = totalAssignments + c.assignments;
    totalExams = totalExams + c.exams;
    totalProjects = totalProjects + c.projects;
    totalOpen = totalOpen + c.open;
    totalDone = totalDone + c.done;
  }

  // if the list is empty, show a message
  if (list.length === 0) {
    var emptyRow = document.createElement('tr');
    var emptyCell = document.createElement('td');
    emptyCell.colSpan = 10;
    emptyCell.className = 'text-center text-muted';
    emptyCell.textContent = 'No courses found.';
    emptyRow.appendChild(emptyCell);
    body.appendChild(emptyRow);
  }

  // the "Total" row
  var totalRow = document.createElement('tr');
  var label = document.createElement('th');
  label.colSpan = 4;
  label.textContent = 'Total';
  totalRow.appendChild(label);
  addCourseCell(totalRow, totalCredits);
  addCourseCell(totalRow, totalAssignments);
  addCourseCell(totalRow, totalExams);
  addCourseCell(totalRow, totalProjects);
  addCourseCell(totalRow, totalOpen);
  addCourseCell(totalRow, totalDone);
  foot.appendChild(totalRow);

  // tell the user how many courses are shown
  document.getElementById('courseCount').textContent =
    'Showing ' + list.length + ' of ' + courses.length + ' courses.';
}


/* ---------------------------------------------------------------------
   4a. ADD A NEW COURSE
   We read the form, create a new Course object, push it into the array
   and show the array again. A new course has no assessments yet, so the
   numbers are 0.
   --------------------------------------------------------------------- */
var courseForm = document.getElementById('addCourseForm');

courseForm.addEventListener('submit', function (event) {
  event.preventDefault();
  if (!courseForm.checkValidity()) {    // validation.js shows the red messages
    return;
  }

  // the text of the chosen semester, for example "Spring 2027"
  var select = courseForm.elements['course_semester'];
  var semesterName = select.options[select.selectedIndex].text;

  // code in capital letters; if it is empty use a dash
  var code = courseForm.elements['course_code'].value.trim().toUpperCase();
  if (code === '') {
    code = '-';
  }

  // instructor: use "TBA" (to be announced) if the box is empty
  var instructor = courseForm.elements['course_instructor'].value.trim();
  if (instructor === '') {
    instructor = 'TBA';
  }

  var newCourse = new Course(
    semesterName,
    code,
    courseForm.elements['course_name'].value.trim(),
    instructor,
    Number(courseForm.elements['course_credits'].value),
    0, 0, 0, 0, 0
  );
  courses.push(newCourse);

  displayCourses(courses);

  courseForm.reset();
  courseForm.classList.remove('was-validated');

  var message = document.getElementById('courseMessage');
  message.textContent = 'The course "' + newCourse.name + '" was added to the workload table.';
  message.classList.remove('d-none');
});


/* ---------------------------------------------------------------------
   4b. SEARCH THE COURSES
   searchCourses() returns a NEW array with the courses whose semester,
   code, name or instructor contains the text.
   --------------------------------------------------------------------- */
function searchCourses(text) {
  var result = [];
  text = text.trim().toLowerCase();

  for (var i = 0; i < courses.length; i++) {
    var c = courses[i];
    var words = (c.semester + ' ' + c.code + ' ' + c.name + ' ' + c.instructor).toLowerCase();
    if (words.indexOf(text) !== -1) {      // -1 means "not found"
      result.push(c);
    }
  }
  return result;
}

document.getElementById('courseSearchForm').addEventListener('submit', function (event) {
  event.preventDefault();
  displayCourses(searchCourses(document.getElementById('course_search').value));
});

// "Show all" button
document.getElementById('showAllCourses').addEventListener('click', function () {
  document.getElementById('course_search').value = '';
  displayCourses(courses);
});


/* ---------------------------------------------------------------------
   5. START: show all courses when the page opens
   --------------------------------------------------------------------- */
displayCourses(courses);
