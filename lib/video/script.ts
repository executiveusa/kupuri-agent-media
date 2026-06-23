import OpenAI from 'openai'

export async function generateScript(
  businessType: string,
  tone: string = 'amigable y persuasivo'
): Promise<string> {
  // Priority: Groq (free) → local proxy (OPENAI_BASE_URL) → OpenAI
  const groqKey = process.env.GROQ_API_KEY
  const client = groqKey
    ? new OpenAI({
        apiKey: groqKey,
        baseURL: 'https://api.groq.com/openai/v1',
      })
    : new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        baseURL: process.env.OPENAI_BASE_URL, // local free-claude-code proxy if set
      })

  const model = groqKey ? 'llama-3.1-8b-instant' : 'gpt-4o-mini'

  const completion = await client.chat.completions.create({
    model,
    messages: [
      {
        role: 'system',
        content:
          'Eres un experto en marketing digital para LATAM. Genera scripts cortos, directos y persuasivos en español mexicano para videos de redes sociales. Sin emojis. Máximo 60 palabras.',
      },
      {
        role: 'user',
        content: `Genera un script de video para: ${businessType}. Tono: ${tone}.`,
      },
    ],
    temperature: 0.8,
    max_tokens: 150,
  })

  return completion.choices[0]?.message?.content?.trim() ?? ''
}
