# AI Chat Setup (Ollama)

The investing chatbot uses **Ollama** for free, local AI. No API key needed.

## 1. Install Ollama

**Windows (winget):**
```bash
winget install Ollama.Ollama
```

Or download from [ollama.com](https://ollama.com/download).

## 2. Pull a model

After installing, open a new terminal and run:

```bash
ollama pull llama3.2
```

The backend uses `llama3.2` by default. Other options: `mistral`, `llama3.1`, etc.

## 3. Run Ollama (usually automatic)

Ollama runs in the background after install. If needed, start it with:

```bash
ollama serve
```

## 4. Optional config

- `OLLAMA_BASE_URL` – default `http://localhost:11434`
- `OLLAMA_CHAT_MODEL` – default `llama3.2`

## Future: RAG & Vector DB

The chat service is designed for future retrieval-augmented generation (RAG):
- Semantic search over market data, news, or research
- Vector database integration for context retrieval
- The `messages` array format supports injecting retrieved context as system messages
