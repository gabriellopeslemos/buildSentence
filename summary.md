# TOEFL Build a Sentence Simulator

## Objective

Create a TOEFL-style Build a Sentence practice tool where users provide a prompt and a correct answer sentence.

The system automatically:

* Splits the answer into meaningful fragments
* Randomizes the fragment order
* Displays the fragments
* Allows the student to rearrange them
* Grades the final answer

No data persistence is required.

---

# Tech Stack

## Frontend

* React
* TypeScript
* Tailwind CSS
* dnd-kit (drag-and-drop)

## Optional Libraries

* compromise.js (sentence chunking)
* react-hook-form (form management)

---

# No Backend

The entire application runs in the browser.

No FastAPI.

No Node.js server.

No database.

No authentication.

No user accounts.

No storage.

---

# Input Methods

## Method 1 - Manual Input

The user provides:

### Prompt

What was the highlight of your trip?

### Answer

The tour guides who showed us around the old city were fantastic.

---

## Method 2 - TXT File Upload

The user uploads a TXT file.

Example:

```txt id="zg2z0s"
PROMPT: What was the highlight of your trip?
ANSWER: The tour guides who showed us around the old city were fantastic.

PROMPT: Who helped you prepare for the exam?
ANSWER: The tutor who worked with me every weekend was incredibly patient.
```

The application reads the file locally in the browser.

No server upload is required.

---

# Question Generation

Given:

Prompt:

What was the highlight of your trip?

Answer:

The tour guides who showed us around the old city were fantastic.

The system automatically generates:

Fragments:

* were fantastic
* the old city
* who showed us around
* The tour guides

---

# Fragment Rules

The system should split answers into meaningful chunks.

Bad:

* The
* tour
* guides
* who
* showed
* us
* around

Good:

* The tour guides
* who showed us around
* the old city
* were fantastic

Goal:

Test grammar and sentence structure rather than vocabulary recognition.

---

# Student Experience

Display:

Prompt:

What was the highlight of your trip?

Fragments:

* were fantastic
* the old city
* who showed us around
* The tour guides

Student uses drag-and-drop to arrange the fragments.

---

# Grading

Binary scoring only.

Score = 1

* Sentence matches the expected answer.

Score = 0

* Any other result.

No partial credit.

---

# Validation

Before comparing:

1. Convert to lowercase.
2. Remove extra spaces.
3. Remove ending punctuation.

Example:

"The Tour Guides Who Showed Us Around The Old City Were Fantastic."

equals

"the tour guides who showed us around the old city were fantastic"

---

# Frontend Flow

1. User enters Prompt.
2. User enters Answer.
3. User clicks Generate.
4. System creates fragments.
5. System shuffles fragments.
6. Student rearranges fragments.
7. Student clicks Submit.
8. System validates answer.
9. Display score:

   * Correct (1)
   * Incorrect (0)

---

# Suggested Components

```text id="hrv7pa"
App
├── QuestionForm
├── QuestionGenerator
├── FragmentList
├── DragDropBoard
├── AnswerValidator
└── ResultCard
```

---

# Future Features

* Difficulty levels
* Better chunking logic
* Multiple questions in a TXT file
* Timer
* Score summary
* TOEFL Writing simulator
* TOEFL Speaking simulator

These features should not require changing the core architecture.
