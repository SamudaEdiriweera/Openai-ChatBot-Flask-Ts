# 🤖 ChatBot – Flask + React (TypeScript) + OpenAI

A simple yet powerful chatbot built with **Flask** (Python backend), **React + TypeScript** (frontend), and **OpenAI API**.  
This project demonstrates how to integrate modern LLMs into a full-stack web app with a clean UI.

---

## 📸 Preview


<img width="961" height="897" alt="Screenshot from 2025-09-20 12-03-56" src="https://github.com/user-attachments/assets/7e40054d-8e49-4898-9eb0-68c0c3c2fbf2" />

---

## 🚀 Features

- 🔗 **Backend:** Flask + Flask-RESTX for API routes
- 🔥 **Frontend:** React + TypeScript + TailwindCSS
- 🤝 **CORS & Proxy Handling** for smooth local development
- ⚡ **OpenAI Integration:** GPT-4o for conversational responses
- 🎨 **Responsive Chat UI** (dark theme, auto-scroll, typing indicator)

---

## 🛠️ Tech Stack

- **Backend:** Python 3.9+, Flask, Flask-RESTX, Flask-CORS  
- **Frontend:** React 18, TypeScript, Vite, TailwindCSS  
- **AI:** OpenAI `chat.completions` endpoint (GPT-4o / GPT-4o-mini)

---

## 📂 Project Structure

```bash
.
├── backend/
│   └── main.py          # Flask API (chatbot endpoint)
├── frontend/
│   ├── src/
│   │   ├── ChatBot.tsx  # Chat UI component
│   │   └── main.tsx
│   └── vite.config.ts   # Vite proxy setup
└── README.md
