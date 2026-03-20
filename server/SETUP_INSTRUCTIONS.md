# FlicksByNick Backend Setup Guide

## Prerequisites
- **Node.js** (v14 or higher) - Download from [nodejs.org](https://nodejs.org/)
- **Gmail Account** with 2-Factor Authentication enabled
- **Gmail App Password** (not your regular password)

---

## Step 1: Install Dependencies

Navigate to the server folder and install required packages:

```bash
cd server
npm install
```

This installs:
- **express** - Web server framework
- **nodemailer** - Email sending service
- **cors** - Cross-origin request handling
- **dotenv** - Environment variable management
- **nodemon** - Auto-restart during development (optional)

---

## Step 2: Set Up Gmail App Password

Since Gmail no longer allows regular passwords for third-party apps, you need an **App Password**:

1. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Sign in to your Gmail account
3. Select **Mail** and **Windows Computer** (or your device)
4. Google will generate a 16-character password
5. **Copy this password** - you'll use it next

⚠️ **Important:** This is NOT your Gmail password. This is a special app-only password.

---

## Step 3: Create Environment Variables

1. In the `server` folder, create a file named `.env` (copy from `.env.example`):

```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

2. Replace:
   - `your-email@gmail.com` with your Gmail address
   - `xxxx xxxx xxxx xxxx` with the 16-character App Password (with spaces or without)
   - Keep `PORT=3000` and `FRONTEND_URL` as-is

⚠️ **Security Alert:** Never commit `.env` to Git! It's already in `.gitignore`.

---

## Step 4: Start the Server

Run the server:

```bash
npm start
```

Or with auto-restart during development:

```bash
npm run dev
```

You should see:
```
╔════════════════════════════════════════╗
║   FlicksByNick Backend Server          ║
║   Running on http://localhost:3000     ║
╚════════════════════════════════════════╝
```

---

## Step 5: Test the Server

Open your browser or a tool like Postman and visit:

```
http://localhost:3000/api/health
```

You should get:
```json
{ "status": "Server is running" }
```

---

## API Endpoint

### Send Email
**POST** `/api/send-email`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "I'd like to book a photography session..."
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Email sent successfully! We will be in touch soon."
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "All fields are required (name, email, message)"
}
```

---

## Frontend Integration

Your frontend form will connect using the `fetch()` API. See the frontend JavaScript section in the main README.

---

## Troubleshooting

### ❌ "Error: Invalid login"
- Check that your App Password is copied correctly (16 characters)
- Verify EMAIL_USER matches your Gmail address
- Make sure 2FA is enabled on your Gmail account

### ❌ "Cannot find module 'express'"
- Run `npm install` from the `server` folder
- Check that you're in the correct directory

### ❌ "Connect ECONNREFUSED"
- Ensure the server is running (`npm start`)
- Check that PORT 3000 is not blocked by a firewall

### ❌ CORS Error in Browser
- Make sure `FRONTEND_URL` in `.env` matches where your frontend is hosted
- If testing locally, use `http://localhost:3000`

---

## Production Deployment

When deploying to production:

1. Update `FRONTEND_URL` to your production domain
2. Use environment variables on your hosting platform (Heroku, Vercel, etc.)
3. Never hardcode credentials in the code
4. Consider using a more secure email service (SendGrid, AWS SES) for high volume

---

## Need Help?

- **Nodemailer Docs:** [nodemailer.com](https://nodemailer.com/)
- **Express Docs:** [expressjs.com](https://expressjs.com/)
- **Gmail App Passwords:** [support.google.com](https://support.google.com/accounts/answer/185833)
