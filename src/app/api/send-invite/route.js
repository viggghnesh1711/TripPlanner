// app/api/send-invites/route.ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { emails, tripLink } = await request.json();
    console.log("sdfsdf:",tripLink)

    for (const email of emails) {
      await resend.emails.send({
        from: 'no-reply@fittrack.fun',
        to: email,
        subject: 'Trip Invite! 🚀',
        html: `<p>You’re invited to join a trip! <a href="${tripLink}">Click here to join</a></p>`,
      });
    }

    return NextResponse.json({ message: 'Invites sent!' });
  } catch (error) {
    console.error('Error sending invites:', error);
    return NextResponse.json({ error: 'Failed to send invites' }, { status: 500 });
  }
}
