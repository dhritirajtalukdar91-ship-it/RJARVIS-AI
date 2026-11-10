# RJARVIS AI

RJARVIS is a browser-based assistant with Local AI (Ollama) and Cloud AI (Gemini).

## Cloud mode (hosted website)

1. Open the deployed Vercel website.
2. Select **Cloud AI** or **Auto**.
3. Vercel must have the `GEMINI_API_KEY` environment variable configured.
4. Redeploy after changing Vercel environment variables.

The Gemini API key belongs in Vercel Environment Variables only. Do not put it in `index.html`, commit it to GitHub, or share it publicly.

## Local mode (Windows laptop)

Requirements:
- Ollama installed and running.
- Model downloaded: `ollama run llama3.2:3b`
- Python 3 installed.

Steps:
1. Download the repository ZIP from GitHub and extract it.
2. Double-click `START-RJARVIS-LOCAL.bat`.
3. The launcher opens RJARVIS at `http://localhost:8000`.
4. Select **Local AI** or **Auto**.

Keep the command window opened while using RJARVIS. Local mode sends prompts to Ollama on this same laptop. It does not upload those prompts to Gemini.

## Important limits

- The public Vercel website uses Cloud AI. A public website cannot directly access Ollama running on your private laptop.
- Local mode is available from the locally served copy on the same laptop.
- Auto mode uses Cloud AI on the hosted website. In the local copy, Auto tries Ollama.
- Voice input depends on browser speech-recognition support. Notes are stored in that browser's local storage.

## Troubleshooting

- If Local AI cannot connect, confirm Ollama is running and the `llama3.2:3b` model is installed.
- If Cloud AI reports a configuration error, add `GEMINI_API_KEY` in Vercel Project Settings → Environment Variables, then redeploy.
- Never expose the Ollama API directly to the public internet.
