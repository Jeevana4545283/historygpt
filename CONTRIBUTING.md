# Contributing to HistoryGPT

First off, thank you for considering contributing to HistoryGPT! It's people like you who make this a great tool for learners and educators.

---

## Code of Conduct

By participating in this project, you agree to abide by the terms of our [Code of Conduct](CODE_OF_CONDUCT.md).

---

## How Can I Contribute?

### 1. Reporting Bugs
* Check the existing issues list to make sure the bug hasn't been reported yet.
* Open a new issue with a clear description, steps to reproduce, expected behavior, and screenshots if applicable.

### 2. Suggesting Enhancements
* Open an issue explaining your proposed feature, why it is useful, and how it should work.

### 3. Submitting Pull Requests
1. Fork the repository and create your branch from `main`.
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Set up your local environment (see the setup guidelines below).
3. Implement your changes. Write clean, commented, and type-safe code.
4. Ensure your changes compile without errors:
   - For backend: run `npm run build` or `npx tsc --noEmit` in `/server`.
   - For frontend: run `npm run build` in `/client`.
5. Commit your changes using descriptive commit messages:
   - `feat: add OCR parser for images`
   - `fix: resolve memory leak in vector store`
   - `docs: update setup instructions`
6. Push to your fork and submit a Pull Request.

---

## Development Setup

HistoryGPT is structured as a full-stack mono-repository:
* `/client`: React Vite frontend with Tailwind CSS and custom WebGL shaders.
* `/server`: Node/Express TypeScript backend with local RAG pipelines.

### Setup Steps:
1. **Clone the repository**:
   ```bash
   git clone https://github.com/Jeevana4545283/historygpt.git
   cd historygpt
   ```
2. **Set up the Server**:
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Add your API keys to .env
   npm run dev
   ```
3. **Set up the Client**:
   ```bash
   cd ../client
   npm install
   npm run dev
   ```

---

## Code Guidelines
* **TypeScript**: Use strict types; avoid `any` wherever possible.
* **Component Design**: Keep UI components modular, responsive, and styled with clean CSS/Tailwind.
* **Performance**: Prefer non-blocking asynchronous filesystem/network operations.
