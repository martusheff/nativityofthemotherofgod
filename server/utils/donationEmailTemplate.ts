// server/utils/emailTemplates.ts
export function generateDonationReceiptHTML(
  amount: number, 
  sessionId: string, 
  donorName: string | null = null, 
  donationDate: Date = new Date()
): string {
  const formattedAmount = `$${amount.toFixed(2)}`;
  const formattedDate = donationDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long', 
    day: 'numeric'
  });
  
  // Extract just the trailing numbers from sessionId
const referenceId = (sessionId.split('_').pop()?.slice(0, 12).toUpperCase() || sessionId.slice(0, 12).toUpperCase());
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Donation Receipt</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=Inter:wght@400;500;600;700&display=swap');
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background-color: #ffffff; line-height: 1.6;">
  
  <!-- Main Container -->
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    
    <!-- Header -->
    <div style="text-align: center; padding: 60px 40px 40px 40px;">
      
      <!-- Icon -->
      <div style="width: 64px; height: 64px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 16px; margin: 0 auto 32px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);">
        <span style="color: #ffffff; font-size: 24px; font-weight: 600;">✓</span>
      </div>
      
      <!-- Title -->
      <h1 style="font-family: 'Crimson Text', Georgia, serif; color: #1c1917; margin: 0 0 16px 0; font-size: 36px; font-weight: 600; letter-spacing: -0.02em; line-height: 1.2;">
        Thank You
      </h1>
      
      <p style="color: #78716c; margin: 0; font-size: 18px; font-weight: 400;">
        Your generous donation has been received.
      </p>
      
    </div>
    
    <!-- Content -->
    <div style="padding: 0 40px;">
      
      <!-- Greeting -->
      <div style="text-align: center; margin-bottom: 48px;">
        <p style="font-family: 'Crimson Text', Georgia, serif; font-size: 22px; color: #57534e; margin: 0; font-style: italic;">
          ${donorName ? `Dear ${donorName},` : 'Dear Friend,'}
        </p>
      </div>
      
      <!-- Donation Card -->
      <div style="background-color: #fafaf9; border: 1px solid #f5f5f4; border-radius: 16px; padding: 32px; margin-bottom: 48px; text-align: center;">
        
        <!-- Amount -->
        <div style="margin-bottom: 24px;">
          <div style="font-size: 48px; font-weight: 700; color: #1c1917; margin-bottom: 8px; font-family: 'Inter', sans-serif;">${formattedAmount}</div>
          <div style="color: #78716c; font-size: 16px;">Donation Amount</div>
        </div>
        
        <!-- Details -->
        <div style="border-top: 1px solid #e7e5e4; padding-top: 24px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <span style="color: #78716c; font-size: 14px;">Date:</span>
            <span style="color: #1c1917; font-size: 14px; font-weight: 500;">${formattedDate}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #78716c; font-size: 14px;">Reference:</span>
            <span style="color: #1c1917; font-size: 12px; font-family: 'SF Mono', Monaco, monospace; background-color: #f5f5f4; padding: 4px 8px; border-radius: 6px;">${referenceId}</span>
          </div>
        </div>
        
      </div>
      
      <!-- Message -->
      <div style="text-align: center; margin-bottom: 40px;">
        <p style="font-family: 'Crimson Text', Georgia, serif; font-size: 20px; color: #44403c; line-height: 1.6; margin: 0 0 32px 0;">
          Thank you for your gift of <strong style="color: #d97706;">${formattedAmount}</strong> to the Church of the Nativity of the Mother of God. Your generosity and support is very much appreciated. May the Blessings of the Lord be upon you!!!
        </p>
        
        <!-- Elegant quote attribution -->
        <div style="text-align: center; margin-top: 24px;">
          <div style="width: 40px; height: 1px; background: linear-gradient(90deg, #f59e0b, #d97706); margin: 0 auto 16px;"></div>
          <p style="font-family: 'Crimson Text', Georgia, serif; font-size: 16px; color: #78716c; margin: 0; font-style: italic;">
            Fr. Nikita Toran
          </p>
        </div>
      </div>
      
      <!-- Tax Information -->
      <div style="border: 1px solid #e7e5e4; border-radius: 12px; padding: 20px; margin-bottom: 40px; text-align: center;">
        <p style="font-size: 13px; color: #78716c; margin: 0; line-height: 1.4;">
          The Russian Orthodox Church of the Nativity of the Mother of God is a 501(c)(3) nonprofit organization. Your donation may be tax-deductible. No goods or services were provided in return for these contributions.
        </p>
        <div style="margin-top: 12px; font-size: 12px; color: #78716c;">
          <strong>Tax ID:</strong> 39-2222243 • <strong>Receipt Date:</strong> ${formattedDate}
        </div>
      </div>
      
      <!-- Call to Action -->
      <div style="text-align: center; margin-bottom: 48px;">
        <a href="https://nmog.org" 
           style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; letter-spacing: 0.01em; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2); transition: all 0.3s ease;">
          Visit Our Website
        </a>
      </div>
      
    </div>
    
    <!-- Footer -->
    <div style="text-align: center; padding: 40px; border-top: 1px solid #f5f5f4; background-color: #fafaf9;">
      
      <div style="margin-bottom: 20px;">
        <h3 style="font-family: 'Crimson Text', Georgia, serif; color: #1c1917; font-size: 24px; font-weight: 600; margin: 0 0 8px 0;">
          Nativity of the Mother of God
        </h3>
        <p style="color: #78716c; font-size: 16px; margin: 0; font-style: italic;">
          Old Rite Russian Orthodox Church • Woodburn, Oregon
        </p>
      </div>
      
      <div style="height: 1px; width: 60px; background: linear-gradient(90deg, #f59e0b, #d97706); margin: 20px auto;"></div>
      
      <p style="color: #78716c; font-size: 14px; margin: 0; line-height: 1.5;">
        Questions about your donation?<br>
        Contact us at <a href="mailto:support@nativityofthemotherofgod.com" style="color: #d97706; text-decoration: none; font-weight: 500;">support@nativityofthemotherofgod.com</a>
      </p>
      
    </div>
    
  </div>
  
</body>
</html>`;
}