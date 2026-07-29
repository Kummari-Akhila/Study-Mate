# Frontend Student Assistant AI Study App

A premium, interactive React 19 application designed to convert raw study logs and exam notes into structured learning sets featuring interactive flashcards (with mobile touch swipe controls) and multiple-choice quizzes (with error-free retests).

Built for the Frontend Engineering Internship assessment.

---

## 🚀 Key Architecture Highlights

*   **No Chatbot Interface:** Translates AI outputs directly into custom, state-guided, interactive UI components.
*   **API Exposure Prevention:** Requests are routed through a Node/Express backend proxy (`backend/server.js`) so that developer/user API keys are never leaked to client browsers.
*   **Stale-Response Protection:** Uses `AbortController` cancellation pools to ensure that slow or delayed older LLM requests never overwrite newer notes queries when the user clicks generate/retry repeatedly.
*   **Zero-Friction Mock Fallback:** If no API keys are configured in the environment, the backend proxy automatically detects this and transitions to **Mock Fallback Mode**; generating high-quality study materials dynamically so reviewers can run and test the complete app instantly.
*   **Robust Parsing (AI Output Guard):** Employs a custom validator (`src/utils/parser.js`) that handles malformed JSON, markdown enclosing headers (e.g. \`\`\`json), missing data fields, and invalid option indices without crashing the web page.

---

## 🛠️ Project Structure

```text
student-assistant/
├─ backend/
│  ├─ server.js           # Express proxy server
│  └─ package.json        # Backend configurations
├─ src/
│  ├─ components/
│  │  ├─ Error.jsx        # Handles failures with retry & sample options
│  │  ├─ FlashCard.jsx    # Flip card, keyboard navigation & touch swipes
│  │  ├─ Loading.jsx      # Spinner with rotating study tips
│  │  ├─ Navbar.jsx       # Global branding & reset controls
│  │  ├─ Progress.jsx     # Grades performance & enables retry wrong answers
│  │  └─ Quiz.jsx         # Option highlights, grades selection & explains correct answer
│  ├─ hooks/
│  │  └─ useQuiz.js       # State machine logic for taking/retrying quiz
│  ├─ pages/
│  │  └─ Home.jsx         # Pastes notes, loads templates, and requests material
│  ├─ services/
│  │  └─ aiService.js     # Triggers POST with timeout aborts
│  ├─ utils/
│  │  └─ parser.js        # Catch-all schema JSON parser
│  ├─ App.jsx             # Handles main navigation and app state
│  └─ main.jsx            # Mounts App & style configurations
├─ .env.example           # Variables reference
├─ package.json           # Frontend configs
└─ README.md              # Technical manual & documentation
```

---

## ⚙️ Quick Start Setup

### Prerequisites
*   Node.js (version 18+ recommended)
*   npm

### 1. Configure Keys (Optional)
Copy `.env.example` to `.env` in the root folder, and insert your preferred provider key:
```bash
cp .env.example .env
```
*(Leave all keys blank to run the app in automatic **Mock Fallback Mode** immediately without API keys!)*

### 2. Start the Backend Proxy
```bash
cd backend
npm install
npm start
```
The server will boot up on [http://localhost:3001](http://localhost:3001).

### 3. Start the Frontend Application
Open a new terminal window:
```bash
# From the root directory:
npm install
npm run dev
```
The web app will run locally at [http://localhost:5173](http://localhost:5173).

---

## 🧠 Robust Failure & Edge-Case Handling

1.  **Stale Responses:** If a student triggers notes generation, changes their mind, alters the text, and clicks generate again, the app aborts the previous network request using `AbortSignal` and discards it.
2.  **Malformed JSON:** LLMs occasionally wrap JSON in markdown blocks (e.g. \`\`\`json ... \`\`\`) or include trailing conversational text. The parser sanitizes the response text before parsing, extracts the JSON envelope, and handles parsing failures by showing the user an error box with options to retry or use placeholder data.
3.  **Schema Validation & Default Bounds:** If the AI omits quiz options, includes incorrect index bounds (e.g., `correctAnswerIndex: 5` in a 4-option quiz), or deletes question fields, the parser filters, clamps, and fills these values with default fields.
4.  **Network Timeout:** A 15-second client-side limit halts request loops on slow cellular networks and prompts the user to retry or switch models.

---

## 📱 Mobile Support
*   Tailored using responsive flex/grid layouts with font scaling.
*   The Flashcards component registers `touchstart`/`touchend` listeners to enable native left/right swipe gestures.
*   Buttons and inputs use a minimum touch target diameter of 44px for easy thumb tapping.

---

## 📝 Details & Notes

### Time Spent
*   **Planning & Architecture Design:** ~1 hour
*   **UI Layout & Styling System:** ~2.5 hours
*   **API service & Backend proxy:** ~1.5 hours
*   **Quiz state hook & Retry system:** ~2 hours
*   **Documentation & Review:** ~1 hour
*   *Total Spent:* **~8 hours**

### AI Usage Note
AI tools were used for generating initial boilerplate components, designing the CSS color variables, organizing mock data trees, and verifying responsive layouts. All backend routing, stale-request protection, and custom state machines were coded and refined manually to ensure stability and cleanliness.
