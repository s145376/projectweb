# STM – Student Task Management (Part 3)

COMP3700 – Introduction to Web Computing – Fall 2026  
Team: Abdulrhman Khalfan Al-Degheishi (143052), Hamed Hilal Al-Shekaili (145376)

## Folders

```
index.html                 Dashboard (home page)
pages/
  calendar.html            Calendar
  courses.html             Courses (dynamic table + add/search)
  goals.html               Goals
  profile.html             Profile
  aboutus.html             About Us
  contact.html             Contact Us
  login.html               Login / Sign up
  questionnaire.html       NEW – Feedback questionnaire (JavaScript validation)
  calculate.html           NEW – Study hours calculator
  funpage.html             NEW – Sentence builder game
js/
  validation.js            Bootstrap form validation (all forms)
  index.js                 Task object + array + table, add, search, banner
  courses.js               Course object + array + table, add, search
  questionnaire.js         Regular-expression validation
  calculate.js             Calculator logic
  funpage.js               Game
images/                    Logo and illustrations
```

There is no CSS file: all styling and layout use Bootstrap 5.3.8 from a CDN
(it needs an Internet connection).

## Part 3 requirements

| Requirement | Where |
|---|---|
| Bootstrap grid, utilities, typography | all pages (`container`, `row`, `col-*`, spacing and text classes) |
| Bootstrap forms and validation | every form (`needs-validation`, `validation.js`) |
| Interactive components | carousel (home), modal (add task), accordion (FAQ), navbar collapse and dropdown |
| Responsive navbar | all pages |
| Two object types, two arrays, two display functions | `Task` in `index.js`, `Course` in `courses.js` |
| Add and search | dashboard and courses page |
| Questionnaire | `pages/questionnaire.html` |
| Calculator | `pages/calculate.html` |
| Fun page | `pages/funpage.html` |
| Moving banner, photo gallery, links to the new pages | `index.html` |
