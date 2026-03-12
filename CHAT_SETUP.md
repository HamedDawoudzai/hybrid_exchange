# AI Chat Setup (Ollama)

The investing chatbot uses **Ollama** for free, local AI. No API key needed.

## 1. Install Ollama

**Windows (winget):**
```bash
winget install Ollama.Ollama
```

Or download from [ollama.com](https://ollama.com/download).

## 2. Pull models

After installing, open a new terminal and run:

```bash
ollama pull llama3.2
ollama pull all-minilm
```

`llama3.2` is the chat model. `all-minilm` is used for RAG embeddings.

## 3. Run Ollama (usually automatic)

Ollama runs in the background after install. If needed, start it with:

```bash
ollama serve
```

## 4. Optional config

- `OLLAMA_BASE_URL` - default `http://localhost:11434`
- `OLLAMA_CHAT_MODEL` - default `llama3.2`
- `OLLAMA_EMBED_MODEL` - default `all-minilm`
- `RAG_ENABLED` - default `true`
- `RAG_TOP_K` - default `3`
- `RAG_SIMILARITY_THRESHOLD` - default `0.5`

## RAG (Retrieval-Augmented Generation)

The backend now supports basic RAG with an in-memory vector store.

### Ingest a document

```bash
curl -X POST http://localhost:8080/api/rag/documents \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"documentId":"doc1","content":"Diversification reduces risk by spreading investments across asset classes.","source":"investing-101"}'
```

### Search for relevant context

```bash
curl -X POST http://localhost:8080/api/rag/search \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"query":"how to reduce portfolio risk","topK":3}'
```

### Check stats

```bash
curl http://localhost:8080/api/rag/stats -H "Authorization: Bearer <token>"
```

### Future improvements

- Persist vectors to PostgreSQL with pgvector or a dedicated vector DB
- Auto-ingest market news and research articles
- Wire RAG context into the chat system prompt automatically
