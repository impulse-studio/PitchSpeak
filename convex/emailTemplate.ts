// PitchSpeak Email Template (reproduit le design original en HTML)
export const createOTPEmail = (otp: string, verificationUrl: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Email Verification</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;">
  <!-- Container -->
  <div style="max-width: 580px; margin: 0 auto; padding: 20px;">

    <!-- Logo Section -->
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="margin: 16px 0; display: inline-flex; align-items: center; gap: 16px;">
        <span style="font-weight: 500; font-size: 18px; letter-spacing: -0.025em; color: white;">
          PitchSpeak
        </span>
      </div>
    </div>

    <!-- Main Card -->
    <div style="margin: 16px 0; width: 100%; border-radius: 24px; background-color: #27272a; padding: 40px;">

      <!-- Heading -->
      <h1 style="margin-top: 0; margin-bottom: 16px; font-weight: 500; color: white; font-size: 20px;">
        Hi there,
      </h1>

      <!-- Main Text -->
      <p style="margin: 12px 0; font-size: 14px; color: white; line-height: 1.5;">
        Please use the following code to verify your email address:
      </p>

      <!-- OTP Display -->
      <div style="margin: 20px auto; width: 100%; border-radius: 6px; background-color: #323336; text-align: center; padding: 20px;">
        <span style="font-family: ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 18px; color: white; line-height: 1.25; letter-spacing: 10px;">
          ${otp}
        </span>
      </div>

      <!-- Button -->
      <div style="text-align: center; margin: 20px 0;">
        <a href="${verificationUrl}" style="margin: 0 auto; display: inline-block; width: auto; border-radius: 6px; background-color: #0085ff; padding: 12px 24px; text-align: center; font-weight: 500; font-size: 16px; color: white; text-decoration: none;">
          Verify Email
        </a>
      </div>

      <!-- Disclaimer -->
      <p style="margin: 12px 0; font-size: 14px; color: white; line-height: 1.5;">
        If you didn't request this code, you can safely ignore this email.
      </p>

      <!-- Signature -->
      <p style="margin: 12px 0; font-size: 14px; color: white; line-height: 1.5;">
        Thanks,<br>
        The PitchSpeak Team
      </p>

    </div>

    <!-- Footer -->
    <div style="margin-top: 24px;">
      <p style="text-align: center; color: #9ca3af; font-size: 12px;">
        © ${new Date().getFullYear()} PitchSpeak
      </p>
    </div>

  </div>
</body>
</html>
`;