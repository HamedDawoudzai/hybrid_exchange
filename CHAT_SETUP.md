# AI Chat Setup (Ollama)

The investing chatbot uses Ollama for free, local AI. No API key needed.

## Install Ollama

Windows (winget):

```bash
winget install Ollama.Ollama
```

Or download from `https://ollama.com/download`.

## Pull a model

```bash
ollama pull llama3.2
```

## Run Ollama

Ollama usually runs in the background after install. If needed:

```bash
ollama serve
```

## Optional config

- `OLLAMA_BASE_URL`: default `http://localhost:11434`
- `OLLAMA_CHAT_MODEL`: default `llama3.2`

## RAG (basic scaffold)

RAG endpoints will allow you to:
- Upsert documents (store text + embedding)
- Search by query to return top-K relevant snippets

This is a basic in-memory setup for development. Later you can swap it to a vector DB.
