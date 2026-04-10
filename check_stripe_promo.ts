
import Stripe from 'stripe';
import "dotenv/config";

async function checkStripe() {
  console.log("Stripe SDK Version:", (Stripe as any).PACKAGE_VERSION || "unknown");
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-24.acacia' as any,
  });
  
  console.log("--- Checking Coupons via Direct API ---");
  try {
    const response = await fetch('https://api.stripe.com/v1/coupons', {
      headers: { 'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}` }
    });
    const result = await response.json();
    result.data.forEach((c: any) => {
      console.log(`Coupon: ${c.id}, Valid: ${c.valid}, Redeem By: ${c.redeem_by ? new Date(c.redeem_by * 1000).toISOString() : 'none'}`);
    });
  } catch (e: any) {
    console.log("Error listing coupons:", e.message);
  }

  console.log("\n--- Checking Promotion Codes ---");
  try {
    const searchResult = await stripe.promotionCodes.list({
      code: 'Primavera',
    });
    console.log("Search result for 'Primavera':", searchResult.data.length, "found");
    searchResult.data.forEach(pc => {
      console.log(`- Code: ${pc.code}, Active: ${pc.active}, ID: ${pc.id}`);
    });

    const promoCodes = await stripe.promotionCodes.list({
      limit: 100,
    });
    
    const primaveraCodes = promoCodes.data.filter(pc => pc.coupon.id === 'primavera');
    const missing = ['primavera', 'Primavera', 'PRIMAVERA', 'PRIMAVERA10'].filter(c => !primaveraCodes.some(pc => pc.code === c));
    if (missing.length > 0) {
      console.log("\nMissing codes:", missing);
      for (const code of missing) {
        console.log(`Creating missing code: ${code}...`);
        try {
          console.log(`Creating missing code via direct API call: ${code}...`);
          const response = await fetch('https://api.stripe.com/v1/promotion_codes', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
              'Content-Type': 'application/x-www-form-urlencoded',
              'Stripe-Version': '2025-02-24.acacia'
            },
            body: new URLSearchParams({
              coupon: 'primavera',
              code: code
            })
          });
          
          const result = await response.json();
          if (response.ok) {
            console.log(`Created ${code} successfully`);
          } else {
            console.log(`Failed to create ${code}:`, result.error ? result.error.message : result);
          }
        } catch (createErr: any) {
          console.log(`Failed to create ${code} via fetch: ${createErr.message}`);
        }
      }
    } else {
      console.log("\nAll codes are present.");
    }
  } catch (e: any) {
    console.log("Error checking promotion codes:", e.message);
  }
}

checkStripe().catch(console.error);
