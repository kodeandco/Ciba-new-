

require('dotenv').config();
const { google } = require('googleapis');
const express = require('express');
const app = express();

const oauth2Client = new google.auth.OAuth2(
  process.env.CALENDAR_CLIENT_ID,
  process.env.CALENDAR_CLIENT_SECRET,
  'http://localhost:5000/oauth2callback'
);

// Generate auth URL
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/calendar'],
  prompt: 'consent' // Force to get refresh token
});

console.log('\n🔗 Visit this URL to authorize:\n');
console.log(authUrl);
console.log('\n');

// Handle callback
app.get('/oauth2callback', async (req, res) => {
  const code = req.query.code;
  
  try {
    const { tokens } = await oauth2Client.getToken(code);
    
    console.log('\n✅ SUCCESS! Add this to your .env file:\n');
    console.log('CALENDAR_REFRESH_TOKEN=' + tokens.refresh_token);
    console.log('\n');
    
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>OAuth Success</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            text-align: center;
          }
          .success {
            color: #10b981;
            font-size: 48px;
            margin-bottom: 20px;
          }
          .token {
            background: #f3f4f6;
            padding: 15px;
            border-radius: 8px;
            word-break: break-all;
            margin: 20px 0;
            font-family: monospace;
          }
          .warning {
            color: #f59e0b;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="success">✅</div>
        <h1>Authorization Successful!</h1>
        <p>Your refresh token has been generated.</p>
        <div class="token">
          ${tokens.refresh_token}
        </div>
        <p class="warning">⚠️ Check your terminal for the token and add it to your .env file</p>
        <p>You can close this window now.</p>
      </body>
      </html>
    `);
    
    setTimeout(() => {
      console.log('\n👋 Closing server...\n');
      process.exit(0);
    }, 3000);
  } catch (error) {
    console.error('❌ Error getting tokens:', error);
    res.send(`
      <h1>❌ Error</h1>
      <p>${error.message}</p>
      <p>Check your console for details.</p>
    `);
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log('\n🚀 Authorization server running on http://localhost:' + PORT);
  console.log('👆 Copy the URL above and paste it in your browser\n');
});