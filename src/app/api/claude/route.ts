import { NextResponse } from 'next/server';

export async function POST(req: Request) {
   try {
      const { messages } = await req.json();

      if (!process.env.ANTHROPIC_API_KEY) {
         throw new Error('Anthropic API key is not configured');
      }

      const response = await fetch('https://api.anthropic.com/v1/messages', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            'x-api-key': `${process.env.ANTHROPIC_API_KEY}`,
            'anthropic-version': '2023-06-01',
         },
         body : JSON.stringify({
            messages: messages,
            max_tokens: 500,
            temperature: 0.7,
            model: 'claude-3-5-sonnet-20240620',
         })
      });

      if(!response.ok) {
         throw new Error('Failed to fetch response');
      }

      const data = await response.json();

      return NextResponse.json({
         message: data.content[0].text
      });
   } catch (error) {
      console.error('Error:', error);
      return NextResponse.json(
         { error: error instanceof Error ? error.message : 'Failed to process request' },
         { status: 500 }
      );
   }
}
