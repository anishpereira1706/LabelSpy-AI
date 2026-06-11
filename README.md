# 🔍 LabelSpy-AI

An intelligent, full-stack AI application designed to analyze product ingredient listings, interpret components for potential dietary flags using vector search, and provide real-time insights through an AI-powered chat assistant.

🚀 **Live Frontend:** [https://labelspy-ai.vercel.app](https://labelspy-ai.vercel.app)  
⚙️ **Live Backend API:** [https://labelspy-backend.onrender.com/docs](https://labelspy-backend.onrender.com/docs)

---

## ✨ Features

* **🧪 Ingredient Analyzer:** Submit ingredient text directly through the web interface to parse, break down, and evaluate components for health and dietary insights.
* **📦 Pinecone Vector Index Integration:** Queries a high-dimensional vector database to perform instant semantic similarity lookups against known additive profiles and dietary flags.
* **💬 Qwen AI Chat Assistant:** A context-aware conversational AI capable of answering follow-up questions about specific additives, nutritional profiles, or healthier alternatives.
* **🌍 Production Environment Handshake:** Built-in dynamic configuration that switches endpoints automatically between local testing networks (`localhost:8000`) and the cloud.

---

## 🛠️ Tech Stack

### Frontend
* **Framework:** React (Vite)
* **Styling:** Tailwind CSS
* **Hosting:** Vercel

### Backend
* **Framework:** FastAPI (Python)
* **Server:** Uvicorn
* **Vector Database:** Pinecone
* **AI Model Pipeline:** Qwen / Hugging Face Infrastructure
* **Hosting:** Render

---

## 📁 Project Structure

```text
LabelSpy-AI/
├── frontend/             # React application (Vite)
│   ├── src/
│   │   ├── components/   # ChatAssistant, Scanner/Analyzer UI
│   │   └── config.js     # Dynamic Environment API Switcher
│   └── package.json
└── backend/              # FastAPI application (Python)
    ├── main.py           # Core application, endpoints, & CORS control
    └── requirements.txt  # Pinned production dependencies (FastAPI, Uvicorn, Numpy, Pinecone)