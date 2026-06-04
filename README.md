# TOEFL Build a Sentence

A browser-based drill tool for TOEFL iBT sentence reconstruction practice. Given a prompt and a correct answer, the app splits the answer into shuffled word fragments and challenges you to reassemble them against the clock.

## Features

- **Drag-and-drop interface** — drag fragments from the bank into numbered answer slots; drag between slots to swap
- **Click to remove** — click a filled slot or a used (muted) fragment to return it to the bank
- **Distractor fragments** — 1–2 fake words per question are mixed into the bank to increase difficulty
- **Per-question timer** — 40 seconds per question; time-out is scored as incorrect
- **Session timer** — configurable total session time (default 7 min); ends the session when it runs out
- **Multi-question sets** — navigate through as many questions as you load
- **Score summary** — final screen shows every prompt, the correct answer, and (for wrong questions) your given answer
- **AI prompt generator** — built-in copyable system prompt to generate fresh question sets from any AI chatbot

## Getting started

Open `https://build-sentence.vercel.app/`.

## Input format

Enter questions manually in the textarea using this format:

```
PROMPT: "What was the highlight of your trip?"
ANSWER: "The tour guides who showed us around the old city were fantastic."

PROMPT: "Who helped you prepare for the exam?"
ANSWER: "The tutor who worked with me every weekend was incredibly patient."
```

- `PROMPT:` and `ANSWER:` are case-insensitive
- Surrounding quotes are optional and will be stripped automatically
- Multiple pairs are separated by blank lines

## Generating questions with AI

Click **"Need Questions?"** on the home screen to reveal a ready-made system prompt. Copy it, paste it into any AI chatbot (ChatGPT, Claude, Gemini, etc.), and send any message — the model will return 10 properly formatted PROMPT/ANSWER pairs you can paste straight into the app.

## Tech stack

| | |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS |
| Drag and drop | @dnd-kit/core |

## Project structure

```
src/
├── components/
│   ├── DragDropBoard.tsx   # Answer slots + fragment bank
│   ├── PromptHelper.tsx    # "Need Questions?" card with copyable AI prompt
│   ├── QuestionForm.tsx    # Text input, session time config
│   ├── ResultCard.tsx      # Per-question correct/incorrect feedback
│   └── ScoreSummary.tsx    # End-of-session score breakdown
└── utils/
    ├── fragmenter.ts       # Splits answers into shuffled fragments + distractors
    ├── txtParser.ts        # Parses PROMPT:/ANSWER: text format
    └── validator.ts        # Normalises and compares assembled vs expected answer
```
