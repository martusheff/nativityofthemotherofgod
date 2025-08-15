import { buffer } from 'micro';
import { useServerStripe } from '#stripe/server';
import { Resend } from 'resend';

const runtimeConfig = useRuntimeConfig();
const resend = new Resend(runtimeConfig.resendApiKey);

export default defineEventHandler(async (event) => {
  console.log('Request received:', event.node.req.method, event.node.req.url);

  // Only accept POST requests
  if (event.node.req.method !== 'POST') {
    console.log('Invalid method:', event.node.req.method);
    return { error: 'Method not allowed', status: 405 };
  }

  const stripe = await useServerStripe(event);
  const signature = getHeader(event, 'stripe-signature');
  if (!signature) {
    console.log('No signature');
    return { error: 'Missing signature', status: 400 };
  }

  let stripeEvent;
  try {
    const rawBody = await buffer(event.node.req);
    stripeEvent = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      runtimeConfig.stripeDonationWebhookSecretKey
    );
    console.log('Stripe event type:', stripeEvent.type);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return { error: 'Invalid signature', status: 400 };
  }

  // Handle successful checkout session
  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object;
    const donorEmail = session.customer_details?.email;
    const donorName = session.customer_details?.name || null;
    const amount = (session.amount_total || 0) / 100;

    console.log('Checkout Session:', { id: session.id, email: donorEmail, amount });

    if (donorEmail) {
      try {
        // Generate email HTML using the template
        const emailHTML = generateDonationReceiptHTML(amount, session.id, donorName, new Date());

        const emailResponse = await resend.emails.send({
          from: 'NMOG Receipts <no-reply@receipts.nmog.org>',
          to: donorEmail,
          subject: 'Thank you for your donation!',
          html: emailHTML,
        });

        console.log('Email sent:', emailResponse);
      } catch (error) {
        console.error('Error sending email:', error);
      }
    } else {
      console.log('No email found in session');
    }
  } else {
    console.log('Unhandled event type:', stripeEvent.type);
  }

  return { received: true };
});

// Disable body parsing since we need raw body for Stripe signature verification
export const config = {
  api: { bodyParser: false },
};