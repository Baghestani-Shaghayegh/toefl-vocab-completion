import Anthropic from '@anthropic-ai/sdk'

export async function POST(req: Request) {
  const { topic, difficulty } = await req.json()
  const client = new Anthropic()

  const message = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 1024,
    messages: [{ 
      role: 'user', 
      content: `Generate a TOEFL-style passage about ${topic} at difficulty ${difficulty}...`
    }]
  })

  return Response.json({ passage: message.content[0] })
}