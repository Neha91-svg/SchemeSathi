# SchemeSaathi

**Turning Government Schemes into Simple, Actionable Guidance**

SchemeSaathi is an AI-powered platform that simplifies government schemes for citizens. It provides summaries, “Explain Like I'm 10” explanations, and helps users understand eligibility and application steps.

---

## ✅ Features (MVP)

- **Health Check**: Confirms backend is running
- **File Upload**: Upload scheme PDFs (RAG temporarily disabled)
- **Dummy Summary & ELI10**: Returns placeholder text for now
- **Backend-ready for RAG integration**: Fully modular

---

## 💻 Tech Stack

- **Frontend:** React, Tailwind CSS  
- **Backend:** Node.js, Express  
- **AI / LLM:** OpenAI API (RAG to be enabled later)  
- **Vector DB:** FAISS (for RAG)  
- **Database:** MongoDB  
- **Deployment:** Vercel / Render  
- **Environment Variables:** `.env` file  

---

## 🚀 Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/SchemeSaathi.git
cd SchemeSaathi/server


2.install dependencies
npm install

3.Create a .env file in server/:

OPENAI_API_KEY=your_openai_api_key
PORT=5000

4. Run the backend


nodemon index.js


5.Open browser and test health check:

http://localhost:5000/