/* =====================================================================
   index.js  –  Dashboard page (index.html)

   This file does these things:
   1. Defines the object type "Task" (constructor function).
   2. Keeps all tasks in an array called "tasks".
   3. Shows the array in the (empty) table using the function displayTasks().
   4. Lets the user SEARCH / FILTER the tasks (text, status, workspace, timeframe).
   5. Lets the user ADD, EDIT and DELETE a task and CHANGE ITS STATUS from the table.
   6. Moves the welcome banner at the bottom of the page.
   ===================================================================== */


/* ---------------------------------------------------------------------
   1. OBJECT TYPE
   A constructor function creates an object with its properties.
   date is written as "YYYY-MM-DD" and time as "HH:MM" (24 hours), the same
   format that the date and time boxes of the form use.
   --------------------------------------------------------------------- */
var nextTaskId = 1;   // every task gets its own number, so we can find it later

function Task(title, course, workspace, date, time, priority, status) {
  this.id = nextTaskId++;     // unique number of the task
  this.title = title;         // name of the task
  this.course = course;       // course or category
  this.workspace = workspace; // "Academic" or "General"
  this.date = date;           // due date, for example "2026-10-26"
  this.time = time;           // due time, for example "23:59"
  this.priority = priority;   // High, Medium or Low
  this.status = status;       // only "Completed" or "Not completed"
}


/* ---------------------------------------------------------------------
   2. ARRAY OF OBJECTS
   The array starts with the real tasks of the old XHTML table.
   --------------------------------------------------------------------- */
var tasks = [
  new Task('Term project Part II – static website', 'Web Computing', 'Academic', '2026-10-26', '23:59', 'High', 'Not completed'),
  new Task('Quiz 3 – search algorithms', 'Intelligent Systems', 'Academic', '2026-10-21', '10:00', 'High', 'Not completed'),
  new Task('ER diagram – rental system', 'Database Systems', 'Academic', '2026-10-28', '17:00', 'Medium', 'Not completed'),
  new Task('Problem set 6', 'Calculus II', 'Academic', '2026-10-19', '08:00', 'Medium', 'Not completed'),
  new Task('Project Part I – game README', 'Intelligent Systems', 'Academic', '2026-10-15', '23:59', 'Low', 'Completed'),
  new Task('Lab 4 – SQL joins', 'Database Systems', 'Academic', '2026-10-30', '14:00', 'Medium', 'Not completed'),
  new Task('Midterm revision – integrals', 'Calculus II', 'Academic', '2026-10-27', '09:00', 'High', 'Not completed'),
  new Task('Read chapter 7 – knowledge representation', 'Intelligent Systems', 'Academic', '2026-11-01', '20:00', 'Low', 'Not completed'),
  new Task('Read Quran – 1 juz', 'Religious', 'General', '2026-10-21', '21:00', 'Medium', 'Not completed'),
  new Task('Gym session', 'Wellness', 'General', '2026-10-20', '18:00', 'Low', 'Completed'),
  new Task('Computer club meeting', 'Club activity', 'General', '2026-10-18', '13:00', 'Low', 'Completed'),
  new Task('Call family', 'Personal', 'General', '2026-10-22', '19:00', 'Low', 'Not completed'),
  new Task('Pay mobile bill', 'Personal', 'General', '2026-10-20', '12:00', 'Medium', 'Completed')
];

// "Today" for the demo. It is the same day that the calendar page highlights.
var TODAY = new Date(2026, 9, 21);   // month 9 = October (months start from 0)


/* ---------------------------------------------------------------------
   Small helper functions for dates and times
   --------------------------------------------------------------------- */
var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// "2026-10-26" -> a Date object
function isoToDate(text) {
  var parts = text.split('-');
  return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
}

// "2026-10-26" -> "26 Oct"
function formatDate(text) {
  var parts = text.split('-');
  return Number(parts[2]) + ' ' + monthNames[Number(parts[1]) - 1];
}

// "23:59" -> "11:59 PM"
function formatTime(text) {
  var parts = text.split(':');
  var hour = Number(parts[0]);
  var suffix = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  if (hour === 0) {
    hour = 12;
  }
  return hour + ':' + parts[1] + ' ' + suffix;
}

// Return the Bootstrap colour name for a priority
function priorityColor(priority) {
  if (priority === 'High') {
    return 'danger';
  } else if (priority === 'Medium') {
    return 'warning';
  }
  return 'success';   // Low
}

// Show a green message above the table
function showMessage(text) {
  var message = document.getElementById('taskMessage');
  message.textContent = text;
  message.classList.remove('d-none');
}


/* ---------------------------------------------------------------------
   3. FUNCTION THAT DISPLAYS AN ARRAY IN THE TABLE
   It receives an array (all tasks, or only the filtered tasks), deletes
   the old rows of the table and adds one new row for each task.
   Columns: Priority, Status, Task, Course / Category, Date, Time, Actions.
   --------------------------------------------------------------------- */

// Add one cell (td) with a text to a row
function addCell(row, text) {
  var cell = document.createElement('td');
  cell.textContent = text;
  row.appendChild(cell);
  return cell;
}

// Create a small Bootstrap button that knows its task (data-id) and its job (data-action)
function makeButton(text, className, action, id) {
  var button = document.createElement('button');
  button.type = 'button';
  button.className = 'btn btn-sm ' + className;
  button.textContent = text;
  button.setAttribute('data-action', action);
  button.setAttribute('data-id', id);
  return button;
}

// THE FUNCTION: show a list of tasks in the table
function displayTasks(list) {
  var body = document.getElementById('taskBody');
  body.innerHTML = '';   // remove the old rows

  for (var i = 0; i < list.length; i++) {
    var task = list[i];
    var done = task.status === 'Completed';
    var row = document.createElement('tr');

    // 1st column: priority (a coloured badge)
    var priorityCell = document.createElement('td');
    var badge = document.createElement('span');
    badge.className = 'badge text-bg-' + priorityColor(task.priority);
    badge.textContent = task.priority;
    priorityCell.appendChild(badge);
    row.appendChild(priorityCell);

    // 2nd column: status. The button changes the status when it is clicked.
    var statusCell = document.createElement('td');
    if (done) {
      statusCell.appendChild(makeButton('Completed', 'btn-success', 'status', task.id));
    } else {
      statusCell.appendChild(makeButton('Not completed', 'btn-outline-secondary', 'status', task.id));
    }
    row.appendChild(statusCell);

    // the other columns (a finished task has a line through its title)
    var titleCell = addCell(row, task.title);
    if (done) {
      titleCell.className = 'text-decoration-line-through text-muted';
    }
    addCell(row, task.course);
    addCell(row, formatDate(task.date));
    addCell(row, formatTime(task.time));

    // last column: Edit and Delete buttons
    var actionCell = document.createElement('td');
    actionCell.className = 'text-nowrap';
    actionCell.appendChild(makeButton('Edit', 'btn-outline-primary me-1', 'edit', task.id));
    actionCell.appendChild(makeButton('Delete', 'btn-outline-danger', 'delete', task.id));
    row.appendChild(actionCell);

    body.appendChild(row);
  }

  // if the list is empty, show one row with a message
  if (list.length === 0) {
    var emptyRow = document.createElement('tr');
    var emptyCell = document.createElement('td');
    emptyCell.colSpan = 7;
    emptyCell.className = 'text-center text-muted';
    emptyCell.textContent = 'No tasks found.';
    emptyRow.appendChild(emptyCell);
    body.appendChild(emptyRow);
  }

  // tell the user how many tasks are shown
  document.getElementById('taskCount').textContent =
    'Showing ' + list.length + ' of ' + tasks.length + ' tasks.';
}


/* ---------------------------------------------------------------------
   4. SEARCH AND FILTER
   searchTasks() returns a NEW array that contains only the tasks that
   pass ALL four filters:
     - text      : found in the title or the course
     - status    : "all", "Completed" or "Not completed"
     - workspace : "all", "General" or "Academic"
     - timeframe : "all", "today", or the number of days (7, 15, 30)
                   A task passes if it is due from today until that many days later.
   --------------------------------------------------------------------- */
function searchTasks(text, status, workspace, timeframe) {
  var result = [];
  text = text.trim().toLowerCase();

  // the last day of the chosen timeframe
  var limit = null;
  if (timeframe !== 'all') {
    var days = (timeframe === 'today') ? 0 : Number(timeframe);
    limit = new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate() + days);
  }

  for (var i = 0; i < tasks.length; i++) {
    var task = tasks[i];
    var words = (task.title + ' ' + task.course).toLowerCase();

    var textMatches = words.indexOf(text) !== -1;                    // -1 means "not found"
    var statusMatches = (status === 'all') || (task.status === status);
    var workspaceMatches = (workspace === 'all') || (task.workspace === workspace);

    var timeMatches = true;
    if (limit !== null) {
      var due = isoToDate(task.date);
      timeMatches = (due >= TODAY) && (due <= limit);
    }

    if (textMatches && statusMatches && workspaceMatches && timeMatches) {
      result.push(task);
    }
  }
  return result;
}

// Read the four filters from the page and show the result
function applyFilters() {
  var timeframe = document.querySelector('input[name="search_timeframe"]:checked').value;
  var found = searchTasks(
    document.getElementById('search_text').value,
    document.getElementById('search_status').value,
    document.getElementById('search_workspace').value,
    timeframe
  );
  displayTasks(found);
}

var searchForm = document.getElementById('searchForm');
searchForm.addEventListener('submit', function (event) {
  event.preventDefault();
  applyFilters();
});

// The table also updates at once when a select box or a radio button changes
document.getElementById('search_status').addEventListener('change', applyFilters);
document.getElementById('search_workspace').addEventListener('change', applyFilters);
var timeframeRadios = document.querySelectorAll('input[name="search_timeframe"]');
for (var r = 0; r < timeframeRadios.length; r++) {
  timeframeRadios[r].addEventListener('change', applyFilters);
}

// "Show all" button: clear every filter
document.getElementById('showAllButton').addEventListener('click', function () {
  searchForm.reset();          // text box empty, selects on "All", radio on "All"
  applyFilters();
});


/* ---------------------------------------------------------------------
   5a. STATUS, EDIT and DELETE buttons inside the table
   Instead of adding one listener to every button, we add ONE listener to
   the table body. When a button is clicked we read its data-action
   ("status", "edit" or "delete") and its data-id (the task number).
   --------------------------------------------------------------------- */
var editingId = null;   // the id of the task that is being edited (null = adding a new task)

// Return the position of a task in the array, or -1 if it does not exist
function findTask(id) {
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === id) {
      return i;
    }
  }
  return -1;
}

document.getElementById('taskBody').addEventListener('click', function (event) {
  var button = event.target.closest('button');       // the button that was clicked
  if (button === null) {
    return;                                          // something else was clicked
  }
  var id = Number(button.getAttribute('data-id'));
  var action = button.getAttribute('data-action');
  var index = findTask(id);
  var task = tasks[index];

  if (action === 'status') {
    // change the status: Completed <-> Not completed
    task.status = (task.status === 'Completed') ? 'Not completed' : 'Completed';
    applyFilters();

  } else if (action === 'delete') {
    // ask first, then remove the task from the array
    if (confirm('Delete the task "' + task.title + '"?')) {
      tasks.splice(index, 1);                        // remove 1 element at this position
      applyFilters();
      showMessage('The task "' + task.title + '" was deleted.');
    }

  } else if (action === 'edit') {
    openEditForm(task);
  }
});


/* ---------------------------------------------------------------------
   5b. ADD and EDIT a task (the form inside the Bootstrap modal)
   The same form is used for both jobs:
     - editingId === null  -> create a new Task and push it into the array
     - editingId = a number -> change the properties of that task
   --------------------------------------------------------------------- */
var addForm = document.getElementById('addTaskForm');
var modalElement = document.getElementById('addTaskModal');

// Fill the form with the values of a task and open the modal
function openEditForm(task) {
  editingId = task.id;
  addForm.elements['task_title'].value = task.title;
  addForm.elements['task_workspace'].value = task.course;
  addForm.elements['task_due_date'].value = task.date;
  addForm.elements['task_due_time'].value = task.time;
  addForm.elements['task_priority'].value = task.priority;

  document.getElementById('addTaskTitle').textContent = 'Edit task';
  document.getElementById('saveTaskButton').textContent = 'Save changes';
  bootstrap.Modal.getOrCreateInstance(modalElement).show();
}

// When the modal is closed, go back to "add" mode
modalElement.addEventListener('hidden.bs.modal', function () {
  editingId = null;
  addForm.reset();
  addForm.classList.remove('was-validated');
  document.getElementById('addTaskTitle').textContent = 'Quick add a task';
  document.getElementById('saveTaskButton').textContent = 'Save task';
});

addForm.addEventListener('submit', function (event) {
  event.preventDefault();            // do not reload the page
  if (!addForm.checkValidity()) {    // validation.js shows the red messages
    return;
  }

  // read the chosen course: its data-workspace says "Academic" or "General"
  var select = addForm.elements['task_workspace'];
  var chosen = select.options[select.selectedIndex];
  var title = addForm.elements['task_title'].value.trim();

  if (editingId === null) {
    // ADD: create the new object and put it in the array
    tasks.push(new Task(
      title,
      chosen.value,
      chosen.getAttribute('data-workspace'),
      addForm.elements['task_due_date'].value,
      addForm.elements['task_due_time'].value,
      addForm.elements['task_priority'].value,
      'Not completed'
    ));
    showMessage('The task "' + title + '" was added.');

  } else {
    // EDIT: change the properties of the existing task
    var task = tasks[findTask(editingId)];
    task.title = title;
    task.course = chosen.value;
    task.workspace = chosen.getAttribute('data-workspace');
    task.date = addForm.elements['task_due_date'].value;
    task.time = addForm.elements['task_due_time'].value;
    task.priority = addForm.elements['task_priority'].value;
    showMessage('The task "' + title + '" was updated.');
  }

  applyFilters();                                              // show the updated array
  bootstrap.Modal.getOrCreateInstance(modalElement).hide();    // close the modal (this also resets the form)
});


/* ---------------------------------------------------------------------
   5. MOVING WELCOME BANNER (bottom of the page)
   - updateMessage() writes the welcome text with today's date and the
     current time. It runs every second.
   - moveBanner() moves the text from right to left. It runs every 20
     milliseconds. When the text leaves the screen it starts again from
     the right side.
   --------------------------------------------------------------------- */
var bannerBox = document.getElementById('bannerBox');
var bannerText = document.getElementById('bannerText');
var bannerPosition = bannerBox.offsetWidth;   // start at the right edge

function updateMessage() {
  var now = new Date();                       // current date and time
  bannerText.textContent = 'Welcome to the STM website! Today is ' + now.toDateString() +
    ', and the time is ' + now.toLocaleTimeString() + '.';
}

function moveBanner() {
  bannerPosition = bannerPosition - 2;                        // move 2 pixels to the left
  if (bannerPosition < -bannerText.offsetWidth) {             // the text is completely out
    bannerPosition = bannerBox.offsetWidth;                   // start again from the right
  }
  bannerText.style.left = bannerPosition + 'px';              // the span has position-relative
}

updateMessage();
setInterval(updateMessage, 1000);
setInterval(moveBanner, 20);


/* ---------------------------------------------------------------------
   6. START: show all tasks when the page opens
   --------------------------------------------------------------------- */
applyFilters();
