# AI Chat Setup

The investing chatbot uses OpenAI's API. To enable it:

1. Create an [OpenAI API key](https://platform.openai.com/api-keys)
2. Set the environment variable:
   ```
   OPENAI_API_KEY=sk-your-key-here
   ```
3. Optional: override the model (default: `gpt-4o-mini`):
   ```
   OPENAI_CHAT_MODEL=gpt-4o-mini
   ```

Without an API key, the chat will return an error asking you to configure it.

## Future: RAG & Vector DB

The chat service is designed for future retrieval-augmented generation (RAG):
- Semantic search over market data, news, or research
- Vector database integration for context retrieval
- The `messages` array format supports injecting retrieved context as system messages
