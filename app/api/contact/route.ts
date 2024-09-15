import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, message } = body

    // Send notification to the owner
    await resend.emails.send({
      from: 'Contact Form <hello@luispulido.com>',
      to: 'hello@luispulido.com',
      subject: 'New Contact Form Submission',
      html: `
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `
    })

    // Send thank you email to the sender
    await resend.emails.send({
      from: 'Luis Pulido <hello@luispulido.com>',
      to: email,
      subject: 'Thank you for your message',
      html: `
        <h1>Thank you for your message, ${name}!</h1>
        <p>I have received your message and will get back to you as soon as possible.</p>
        <p>Best regards,</p>
        <p>Luis Pulido</p>
      `
    })

    return NextResponse.json({ success: true, message: 'Message sent successfully' })
  } catch (error) {
    console.error('Error processing contact form:', error)
    return NextResponse.json({ success: false, message: 'Failed to send message' }, { status: 500 })
  }
}