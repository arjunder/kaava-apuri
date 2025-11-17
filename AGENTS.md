# AGENTS

## Project overview

- **Name**: Kaava-apuri  
- **Type**: Single-page web app (static site)  
- **Purpose**: A browser-based helper for working with formulas (math, physics, etc.).  
- **Stack**: HTML + CSS + vanilla JavaScript, no build tools, no backend.

**Live deployment**: https://kaava-apuri.vercel.app

---

## Repository layout

The root folder contains:

- `index.html` – Main HTML page and UI structure  
- `style.css` – All styling for the app  
- `script.js` – All client-side logic for the app  
- `LICENSE` – MIT license  

There is no backend, build pipeline, or bundler.

---

## How to run locally

**Requirements**: Any modern web browser.

### Steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/arjunder/kaava-apuri.git
   cd kaava-apuri
   ```
2. Open `index.html` directly in a browser  
   – or serve with a simple static server, e.g.:
   ```bash
   python -m http.server 8000
   # Then open http://localhost:8000 in your browser
   ```

No build is required.

---

## Deployment

- **Platform**: Vercel (static site)
- **Build command**: None  
- **Output folder**: Project root (`index.html` is served directly)

---

## Coding conventions and style

- **UI language**: Finnish
- Keep it simple: **no frameworks or bundlers** unless explicitly requested
- Structure:
  - **index.html** → HTML structure
  - **style.css** → Styling and layout
  - **script.js** → Logic and interactions
- Prefer:
  - Descriptive function and variable names
  - Small, focused functions
  - Responsive design with mobile-first principles

Comments may be in Finnish or English.

---

## How AI agents should modify this project

If extending this project:

1. **Preserve the structure**:
   - One `index.html`, `style.css`, `script.js` in the repo root
   - No additional build steps unless explicitly instructed

2. **Only browser-compatible code**:
   - No Node APIs or backends
   - Avoid secrets or private keys

3. **UI/UX**:
   - Maintain clean, student-friendly UI
   - Ensure mobile compatibility and responsive behavior

4. **Error handling**:
   - Add input validation and user-friendly errors
   - Prevent crashes on bad user input

5. **Performance**:
   - Avoid external JS libs unless explicitly needed
   - Use minimal and efficient code

---

## Testing and verification

No test suite exists yet.

Before committing changes, agents should:

- Verify the site loads without console errors
- Ensure main functionality works (formula processing)
- Check layout on common screen sizes (mobile + desktop)

Only implement such additions when explicitly asked.
