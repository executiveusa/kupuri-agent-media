import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/**
 * Generate a short marketing script in Mexican Spanish for social media videos.
 */
export async function generateScript(
  businessType: string,
  tone: string = 'amigable y persuasivo'
): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
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
