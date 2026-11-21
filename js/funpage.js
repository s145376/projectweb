/* =====================================================================
   funpage.js  –  Fun page (pages/funpage.html): "Sentence builder"

   THE GAME
   The page shows the words of a sentence about studying in a random
   order. The player clicks the words in the right order. A clicked word
   moves from the "Words" box to the "Your sentence" box. Clicking a
   word in the answer box sends it back.

   DYNAMIC HTML
   The buttons are created with JavaScript (document.createElement),
   moved from one box to the other (appendChild) and their colour is
   changed (classList) while the page is open.
   ===================================================================== */

// The sentences of the game (all about planning and studying)
var sentences = [
  'Plan your tasks every day before the deadline',
  'Good students review their goals every week',
  'Check the calendar for exams and project dates',
  'Small daily steps beat last minute marathons',
  'Finish the hardest assignment first'
];

var current = 0;   // number of the sentence that is shown now
var score = 0;     // how many sentences were correct
var rounds = 0;    // how many times the player pressed Check

var wordPool = document.getElementById('wordPool');       // box with the free words
var answerBox = document.getElementById('answerBox');     // box with the chosen words
var message = document.getElementById('gameMessage');     // message under the boxes


/* ---------------------------------------------------------------------
   shuffle(): mixes the words of an array in a random order
   (Fisher-Yates idea: go from the end and swap each word with a random
   word that is before it)
   --------------------------------------------------------------------- */
function shuffle(list) {
  for (var i = list.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));   // random number from 0 to i
    var temp = list[i];
    list[i] = list[j];
    list[j] = temp;
  }
  return list;
}


/* ---------------------------------------------------------------------
   makeWordButton(): creates one button for one word
   --------------------------------------------------------------------- */
function makeWordButton(word) {
  var button = document.createElement('button');
  button.type = 'button';
  button.className = 'btn btn-outline-primary m-1';
  button.textContent = word;

  // When the word is clicked: if it is in the pool move it to the
  // answer box, otherwise move it back to the pool.
  button.addEventListener('click', function () {
    if (button.parentNode === wordPool) {
      answerBox.appendChild(button);
      button.className = 'btn btn-primary m-1';          // chosen = filled colour
    } else {
      wordPool.appendChild(button);
      button.className = 'btn btn-outline-primary m-1';  // free = outline colour
    }
  });
  return button;
}


/* ---------------------------------------------------------------------
   startSentence(): shows the words of the current sentence
   --------------------------------------------------------------------- */
function startSentence() {
  wordPool.innerHTML = '';     // empty both boxes
  answerBox.innerHTML = '';

  var words = sentences[current].split(' ');    // "Plan your tasks" -> ["Plan", "your", "tasks"]
  shuffle(words);

  for (var i = 0; i < words.length; i++) {
    wordPool.appendChild(makeWordButton(words[i]));
  }

  message.className = 'alert alert-info';
  message.textContent = 'Build the sentence, then press Check.';
}


/* ---------------------------------------------------------------------
   Check button: compare the answer with the real sentence
   --------------------------------------------------------------------- */
document.getElementById('checkButton').addEventListener('click', function () {
  var buttons = answerBox.querySelectorAll('button');
  var answer = [];
  for (var i = 0; i < buttons.length; i++) {
    answer.push(buttons[i].textContent);     // collect the chosen words in order
  }

  // the answer must use all the words
  if (wordPool.querySelectorAll('button').length > 0) {
    message.className = 'alert alert-warning';
    message.textContent = 'Use all the words first.';
    return;
  }

  rounds = rounds + 1;
  if (answer.join(' ') === sentences[current]) {
    score = score + 1;
    message.className = 'alert alert-success';
    message.textContent = 'Correct! Well done. Press "Next sentence".';
  } else {
    message.className = 'alert alert-danger';
    message.textContent = 'Not correct. Press "Reset words" and try again.';
  }
  document.getElementById('score').textContent = score;
  document.getElementById('rounds').textContent = rounds;
});


/* ---------------------------------------------------------------------
   Reset button: put the same words in a new random order
   --------------------------------------------------------------------- */
document.getElementById('resetButton').addEventListener('click', startSentence);


/* ---------------------------------------------------------------------
   Next button: go to the next sentence (after the last one, go to the first)
   --------------------------------------------------------------------- */
document.getElementById('nextButton').addEventListener('click', function () {
  current = current + 1;
  if (current >= sentences.length) {
    current = 0;
  }
  startSentence();
});


// Start the game when the page opens
startSentence();
