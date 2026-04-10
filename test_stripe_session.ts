
import Stripe from 'stripe';
import "dotenv/config";

async function testCheckout() {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-24.acacia' as any,
  });
  
  console.log("Creating test checkout session...");
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "eur",
          product_data: { name: "Test Product" },
          unit_amount: 1000,
        },
        quantity: 1,
      }],
      mode: "payment",
      allow_promotion_codes: true,
      success_url: "https://example.com/success",
      cancel_url: "https://example.com/cancel",
    });
    
    console.log("Session created:", session.id);
    console.log("URL:", session.url);
    console.log("Promotion codes allowed:", session.allow_promotion_codes);
  } catch (e: any) {
    console.log("Error creating session:", e.message);
  }
}

testCheckout().catch(console.error);
