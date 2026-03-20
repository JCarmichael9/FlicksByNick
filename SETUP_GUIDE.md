# FlicksByNick Contact Form with Email Integration

Complete guide to set up email functionality for your FlicksByNick contact form.

## 📋 Overview

This solution has two parts:

1. **Frontend** - Your existing HTML/CSS/JS form (updated with fetch API)
2. **Backend** - Node.js/Express server with Nodemailer for sending emails

## 🗂️ Project Structure

```
FlicksByNick/
├── index.html                    # Your form (updated)
├── css/
│   └── style.css
├── js/
│   └── main.js                   # Updated with fetch() integration
├── images/
└── server/                       # NEW - Backend server
    ├── server.js                 # Express app with email endpoint
    ├── package.json              # Dependencies
    ├── .env.example              # Configuration template
    ├── .env                      # Your actual credentials (SECRET!)
    ├── SETUP_INSTRUCTIONS.md     # Detailed setup guide
    └── README.md
```

---

## 🚀 Quick Start (5 minutes)

### Prerequisites
- **Node.js** installed ([nodejs.org](https://nodejs.org/))
- **Gmail account** with 2-Factor Authentication
- Your **Gmail App Password** (see setup guide)

### 1. Install Server Dependencies
```bash
cd server
npm install
```

### 2. Create .env File
Copy `.env.example` to `.env` and fill in your credentials:

```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 3. Start the Server
```bash
npm start
```

You should see:
```
╔════════════════════════════════════════╗
║   FlicksByNick Backend Server          ║
║   Running on http://localhost:3000     ║
╚════════════════════════════════════════╝
```

### 4. Test the Form
1. Open your website in browser (e.g., `file:///path/to/index.html` or use Live Server)
2. Navigate to Contact page
3. Fill out: Name, Email, Message
4. Click **Submit Inquiry**
5. You should receive two emails:
   - One to `ncarmichael903@gmail.com` (photographer receives inquiry)
   - One to sender's email (automatic confirmation)

---

## 🔐 Gmail App Password Setup

Since Gmail blocks regular passwords for third-party apps, you need a special **App Password**:

### Step-by-Step:

1. **Enable 2-Factor Authentication** (if not already enabled)
   - Go to [myaccount.google.com/security](https://myaccount.google.com/security)
   - Look for "2-Step Verification"
   - Follow Google's instructions

2. **Generate App Password**
   - Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and "Windows Computer"
   - Google generates a 16-character password
   - **Copy it** (you need this for `.env`)

3. **Add to .env**
   ```
   EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
   ```

⚠️ **Never share or commit this password to Git!**

---

## 📡 How It Works

### Frontend Flow
1. User fills form on Contact page
2. Clicks "Submit Inquiry"
3. JavaScript calls `handleContactSubmit()`
4. Form data sent via **fetch()** to backend:
   ```javascript
   POST http://localhost:3000/api/send-email
   {
     "name": "John Doe",
     "email": "john@example.com",
     "message": "..."
   }
   ```
5. Backend sends emails
6. User sees success/error message

### Backend Flow
1. Express server listens on port 3000
2. Receives POST request at `/api/send-email`
3. Validates data (required fields, valid email)
4. Sets up Nodemailer with Gmail
5. Sends **two emails**:
   - **To photographer** (`ncarmichael903@gmail.com`): Full inquiry details
   - **To user**: "Thank you for contacting us" confirmation
6. Returns success/error response to frontend

---

## 💻 Frontend Changes

### Updated: `js/main.js`

The `handleContactSubmit()` function now:
- Collects form data
- Validates input
- Sends POST request to backend
- Handles success/error responses
- Shows user-friendly messages

**Key code:**
```javascript
const BACKEND_URL = 'http://localhost:3000';

async function handleContactSubmit(e) {
  e.preventDefault();
  
  const formData = {
    name: document.getElementById('contactName').value,
    email: document.getElementById('contactEmail').value,
    message: document.getElementById('contactMessage').value
  };
  
  const response = await fetch(`${BACKEND_URL}/api/send-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  
  const data = await response.json();
  // ... handle response
}
```

**To use different backend URL:**
- If backend is on different domain: Update `BACKEND_URL` variable at top of `handleContactSubmit()`
- If deploying to production: Change to your server's URL

---

## ⚙️ Backend Configuration

### `server/server.js` - Main Server

Features:
- ✅ Express.js web framework
- ✅ CORS enabled (handles cross-origin requests)
- ✅ Email validation
- ✅ Error handling
- ✅ Two-email system (to photographer + to user)
- ✅ HTML formatted emails

### Environment Variables

| Variable | Example | Purpose |
|----------|---------|---------|
| `EMAIL_USER` | `your-email@gmail.com` | Gmail address sending emails |
| `EMAIL_PASSWORD` | `xxxx xxxx xxxx xxxx` | Gmail App Password (16 chars) |
| `PORT` | `3000` | Server port |
| `NODE_ENV` | `development` | Environment (development/production) |
| `FRONTEND_URL` | `http://localhost:3000` | Frontend domain (for CORS) |

---

## 🧪 Testing

### Test Backend Directly
Using **curl** or **Postman**:

```bash
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test message"
  }'
```

### Health Check
```bash
curl http://localhost:3000/api/health
```
Response: `{"status":"Server is running"}`

### Browser Console
Open DevTools (F12) → Console → Try:
```javascript
fetch('http://localhost:3000/api/send-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: "John Doe",
    email: "john@example.com",
    message: "Test message"
  })
}).then(r => r.json()).then(d => console.log(d))
```

---

## 🐛 Troubleshooting

### ❌ "Cannot find module 'express'"
**Solution:** Run `npm install` in the `server/` directory

### ❌ "Error: Invalid login"
**Likely causes:**
- App Password copied incorrectly (should be 16 chars)
- Using regular Gmail password instead of App Password
- 2FA not enabled on Gmail account

**Fix:** 
1. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Regenerate App Password
3. Update `.env`

### ❌ "Connect ECONNREFUSED"
**Meaning:** Frontend can't reach backend

**Solutions:**
- Ensure backend is running (`npm start`)
- Check that PORT is 3000
- Check firewall isn't blocking port 3000
- Update `BACKEND_URL` in `js/main.js` if backend is on different address

### ❌ CORS Error in Browser
**Error:** "Access to XMLHttpRequest blocked by CORS policy"

**Solution:**
- Update `FRONTEND_URL` in `.env` to match where frontend is hosted
- Restart server: `npm start`

### ❌ No emails being sent
**Check:**
1. Are emails arriving in Gmail spam folder?
2. Check server console for errors: `npm start`
3. Verify `EMAIL_USER` matches your Gmail address
4. Verify 2FA is enabled on Gmail

### ❌ Server starts but emails don't send
**Check server logs:**
```bash
npm start
# Look for "✅ Email service ready" or "❌ Email configuration error"
```

---

## 📤 Sending Test Email

Once server is running, send test via form:

1. Open your site
2. Go to Contact page
3. Enter:
   - **Name:** Test User
   - **Email:** your-personal-email@gmail.com
   - **Message:** This is a test
4. Click Submit
5. Check both your emails for confirmation

---

## 🚢 Production Deployment

### Before Deploying:

1. **Update email address**
   ```javascript
   // In server.js, change from ncarmichael903@gmail.com to:
   to: 'your-production-email@gmail.com'
   ```

2. **Update FRONTEND_URL**
   ```
   FRONTEND_URL=https://www.yourproductiondomain.com
   ```

3. **Update BACKEND_URL in frontend**
   ```javascript
   const BACKEND_URL = 'https://your-server-domain.com'
   ```

### Hosting Options:

- **Frontend:** Netlify, Vercel, GitHub Pages
- **Backend:** Heroku, Railway, Render, AWS Lambda

### Environment Variables:
- Set them in your hosting platform's dashboard
- Never hardcode credentials in code
- Use platform-specific secret management

---

## 📚 Resources

- **Nodemailer:** [nodemailer.com](https://nodemailer.com/about/)
- **Express.js:** [expressjs.com](https://expressjs.com/)
- **Gmail App Passwords:** [support.google.com](https://support.google.com/accounts/answer/185833)
- **Fetch API:** [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

---

## 📝 Next Steps

1. ✅ Install Node.js
2. ✅ Get Gmail App Password
3. ✅ Run `npm install` in server folder
4. ✅ Create `.env` file with credentials
5. ✅ Run `npm start` to start server
6. ✅ Test form on Contact page
7. ✅ Check email confirmations
8. ✅ Deploy to production when ready

---

## 📧 Need Help?

- Check the server console for error messages: `npm start`
- Review `server/SETUP_INSTRUCTIONS.md` for detailed setup
- Check browser DevTools (F12) for frontend errors
- Verify `.env` file has correct credentials

**Good luck! 🎉**
