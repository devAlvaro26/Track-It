# Track‑It 🎮

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/devAlvaro26/track-it?style=social)](https://github.com/devAlvaro26/track-it)

---

## Overview

**Track‑It** is a modern web application designed to help you organize, catalog, and track your personal video game collection. Built with React, Vite, Express, TailwindCSS, and integrated with the IGDB API, it provides an intuitive digital shelf for managing games across multiple platforms, tracking playtime, recording completion status, and exploring collection statistics.

---

## Features

- ✨ **Modern UI** – Dark and Light mode support, smooth animations, and responsive layout built with TailwindCSS and Motion.
- 🎮 **Game Management** – Add, edit, and delete games in your library with details like platform, genre, rating, and barcode.
- ⏱️ **Playtime & Status Tracking** – Categorize games by status (*Pending*, *Playing*, *Completed*, *Favorites*) and track hours spent playing.
- 📊 **Library Statistics** – View key collection metrics, distribution, and insights via an interactive stats panel.
- 🔍 **Search & Filters** – Quick search by title, genre, or barcode, with filtering by status or console platform.
- 💾 **Cloud Persistence** – Retains your collection secure and everywhere.

---

## Screenshots

> *TODO: Replace the placeholder images with actual screenshots of the app.*

![Dashboard screenshot](https://via.placeholder.com/1200x475?text=Video+Game+Library+Screenshot)

---

## Getting Started

### Prerequisites

- **Node.js** (v18 or later)
- **npm** (v9 or later)

### Installation & Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/devAlvaro26/track-it.git
   cd track-it
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Copy `.env.example` to `.env` (or `.env.local`) and configure your Gemini API Key if using AI features:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The application will be running locally (by default using `tsx server.ts`).

---

## Usage

1. **Add a Video Game** – Click the **Añadir Videojuego** button, enter the title or barcode, and let Gemini AI assist with details or fill them manually.
2. **Filter & Sort** – Filter your games by status (*Pending*, *Playing*, *Completed*, *Favorites*) or target platform, and sort by acquisition date, title, playtime, or rating.
3. **Manage Details** – Click on any game card to open the detail modal, edit achievements, update play hours, or adjust rating.
4. **View Statistics** – Check the top panel for summary stats on total games, hours played, and completion progress.

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes with clear messages.
4. Open a Pull Request describing your proposed changes.

Please ensure your code passes TypeScript checks (`npm run lint`) before submitting.

---

## License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

---

## Contact & Support

- **GitHub Issues:** https://github.com/devAlvaro26/track-it/issues

Feel free to open an issue for bug reports or feature suggestions.

---

*Happy gaming & tracking!*
