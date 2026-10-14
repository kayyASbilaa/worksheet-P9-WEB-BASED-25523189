# Worksheet P9: DOM, Events, and Interactivity
**Web-Based Application Development (SIF302)** · *Odd Semester 2026/2027*  
**Universitas Islam Indonesia**

---

## 👤 Student Information
* **Name:** Faizah Nabila Azzahra
* **Student ID:** 25523189
* **Class:** Informatics 2026 (IP Class)
* **Date:** 14 October 2026

---

## 📖 Project Overview
This repository contains the implementation of an interactive **Personal Bookshelf Web Application** built for Worksheet P9. The application dynamically mounts data from JavaScript objects into the HTML page, supports category filtering using event delegation, handles book status cycling and deletion, and features real-time form validation without full page reloads.

---

## ✨ Features Implemented
1. **Dynamic Profile & Skills Rendering:**
   - Profile information and skill badges are rendered dynamically from pure data objects in `js/app.js`.
2. **Data-Driven Table Rendering:**
   - The book collection list is built securely using `document.createElement()` and `textContent` to prevent XSS vulnerabilities.
   - Includes automatic clearing of the table container (`bookListContainer.textContent = ""`) on every render cycle.
3. **Event Delegation (One Listener for Category Filters):**
   - A single event listener on `#filter-category` handles clicks for all filter buttons using `event.target.closest("button")`.
   - Dynamic active class toggling (`active`) for styling selected filters.
   - Handles empty category filter states with visual user feedback (`#empty-book-message`).
4. **Interactive Table Actions:**
   - Event delegation on table body handles both **Delete** (with confirmation dialog) and **Change Status** (cycles between *Plan to Read* $\rightarrow$ *Reading* $\rightarrow$ *Completed*).
5. **Form Validation & Accessibility:**
   - Intercepts default form submission using `event.preventDefault()`.
   - Real-time input validation checking non-empty strings via `.trim()`.
   - Visual error messages and ARIA attributes (`aria-invalid="true"`) per field.
   - Submit button remains disabled (`disabled`) until all input fields pass validation.

---

## 🛠️ File Structure
```text
worksheet-p9/
├── profile.html         # Main HTML5 document layout
├── style.css            # Custom UI stylesheet (modern dashboard slate theme)
├── bookshelf.jpeg       # Bookshelf image asset
├── js/
│   ├── app.js           # Pure data structures (profile & bookCollection) & helper functions
│   └── dom.js           # DOM manipulation, event delegation, and form validation logic
└── README.md            # Project documentation and AI disclosure