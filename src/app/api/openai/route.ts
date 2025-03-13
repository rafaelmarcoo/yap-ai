import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
   try {
      const { messages } = await req.json();

      if (!process.env.OPENAI_API_KEY) {
         return NextResponse.json(
            { error: 'OpenAI API key is not configured' },
            { status: 500 }
         );
      }

      const completion = await openai.chat.completions.create({
         model: 'gpt-4-turbo',
         messages: messages,
         temperature: 0.7,
         max_tokens: 500,
      });

      return NextResponse.json({
         message: completion.choices[0].message.content
      });
   } catch (error) {
      console.error('Error:', error);
      return NextResponse.json(
         { error: error instanceof Error ? error.message : 'Failed to process request' },
         { status: 500 }
      );
   }
} 