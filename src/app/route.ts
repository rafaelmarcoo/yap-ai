import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
   try {
      const { messages } = await req.json();

      const completion = await openai.chat.completions.create({
         model: "gpt-3.5-turbo",
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
         { error: 'Failed to process request' },
         { status: 500 }
      );
   }
}

export default openai;
