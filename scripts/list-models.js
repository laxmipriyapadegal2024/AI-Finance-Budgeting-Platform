// Lists available Gemini models and their supported methods for the current API key
const fs = require('fs');
const path = require('path');

function getApiKey() {
  const envPath = path.join(__dirname, '..', '.env');
  try {
    const raw = fs.readFileSync(envPath, 'utf8');
    const match = raw.match(/^\s*GEMINI_API_KEY\s*=\s*"?([^"\r\n]+)"?/m);
    if (match) return match[1];
  } catch {}
  return process.env.GEMINI_API_KEY;
}

async function fetchModels(baseUrl, apiKey) {
  const url = `${baseUrl}/models?key=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`[${res.status} ${res.statusText}] ${text}`);
  }
  return res.json();
}

(async () => {
  const key = getApiKey();
  if (!key) {
    console.error('Missing GEMINI_API_KEY in .env or environment');
    process.exit(1);
  }

  const bases = [
    'https://generativelanguage.googleapis.com/v1beta',
    'https://generativelanguage.googleapis.com/v1',
  ];

  for (const base of bases) {
    try {
      const data = await fetchModels(base, key);
      console.log(`\nModels from ${base}:`);
      for (const m of data.models || []) {
        const methods = m.supportedGenerationMethods || m.supported_methods || m.supported || [];
        console.log(`- ${m.name}${m.displayName ? ` (${m.displayName})` : ''}`);
        if (methods.length) console.log(`  methods: ${methods.join(', ')}`);
      }
    } catch (e) {
      console.log(`\nFailed to list models from ${base}: ${e.message}`);
    }
  }
})();
