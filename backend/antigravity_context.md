# LabelSpy AI - Project Passport

## 🎯 Objective
A completely free, cloud-based RAG application that acts as a "Processed Food Detective." It takes raw ingredient text from packaged grocery wrappers, checks it against a free cloud vector database of known food additives, and translates industrial chemical jargon into plain English.

## 🛠️ Stack Rules (100% Free Tiers)
- **Frontend:** React / Vite (Hosted on Vercel)
- **Backend:** Python FastAPI (Hosted on Render Free Tier)
- **Vector DB:** Pinecone Serverless (Free Starter Plan)
- **AI Engine & Embeddings:** Hugging Face Serverless API (Free)
  - Text Model: `meta-llama/Meta-Llama-3-8B-Instruct`
  - Embedding Model: `sentence-transformers/all-MiniLM-L6-v2` (384 dimensions)