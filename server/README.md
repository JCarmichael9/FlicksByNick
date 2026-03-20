# FlicksByNick Backend Server

Express.js server with Nodemailer integration for handling contact form submissions.

## Files in This Folder

| File | Purpose |
|------|---------|
| `server.js` | Main Express application + email endpoint |
| `package.json` | Project dependencies and scripts |
| `.env.example` | Template for environment variables |
| `.env` | Your actual credentials (⚠️ SECRET - never commit!) |
| `.gitignore` | Excludes node_modules and .env from Git |
| `SETUP_INSTRUCTIONS.md` | Detailed step-by-step setup guide |
| `quick-start.bat` | Windows quick setup script |
| `quick-start.sh` | Mac/Linux quick setup script |

## Quick Start

### 1️⃣ Install Dependencies
```bash
npm install
```

### 2️⃣ Set Up Credentials
Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```

Edit `.env` and add:
- Your Gmail address
- Your Gmail App Password (get it at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords))

### 3️⃣ Start Server
```bash
npm start
```

Or with auto-reload:
```bash
npm run dev
```

### 4️⃣ Test
Visit in browser:
```
http://localhost:3000/api/health
```

Should return: `{"status":"Server is running"}`

---

## API Endpoint

### POST /api/send-email

Sends confirmation emails to both photographer and user.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "I'd like to book a session..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Email sent successfully! We will be in touch soon."
}
```

**Error Response (400/500):**
```json
{
  "success": false,
  "message": "All fields are required (name, email, message)"
}
```

---

## Environment Variables

Must be set in `.env` file:

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Server Configuration
PORT=3000
NODE_ENV=development

# Frontend Domain (for CORS)
FRONTEND_URL=http://localhost:3000
```

---

## Frontend Integration

The frontend sends form data via fetch:

```javascript
fetch('http://localhost:3000/api/send-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: formData.name,
    email: formData.email,
    message: formData.message
  })
})
.then(response => response.json())
.then(data => console.log(data))
```

---

## Email Flow

```
User submits form
        ↓
Frontend sends POST to /api/send-email
        ↓
Backend validates data
        ↓
Nodemailer sends two emails:
  1️⃣  To photographer (ncarmichael903@gmail.com)
  2️⃣  To user (confirmation)
        ↓
Response sent back to frontend
        ↓
User sees success message
```

---

## Troubleshooting

### `npm install` Fails
- Install Node.js from [nodejs.org](https://nodejs.org/)
- Make sure you're in the `server/` folder

### "Cannot find module" Error
- Run `npm install` again
- Delete `node_modules/` and try again

### Email Not Sending
- Check `.env` has correct Gmail address
- Verify App Password (16 characters)
- Ensure 2FA is enabled on Gmail ([myaccount.google.com/security](https://myaccount.google.com/security))
- Check server console for error messages

### CORS Error in Browser
- Update `FRONTEND_URL` in `.env` to match where frontend is hosted
- Restart server: `npm start`

### Port 3000 Already in Use
- Change `PORT` in `.env` to another number (3001, 3002, etc.)
- Update `BACKEND_URL` in frontend JavaScript

---

## Nodemailer + Gmail Setup

### Why Not Use Regular Gmail Password?
Google blocks "less secure" apps from using regular passwords. You need a special **App Password** instead.

### Get App Password:
1. Enable 2FA on your Gmail account
2. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Select "Mail" and "Windows Computer"
4. Google generates 16-character password
5. Copy and add to `.env` as `EMAIL_PASSWORD`

### Security:
- ✅ Email address can be in version control (it's not secret)
- ❌ App Password must NEVER be in version control
- ✅ `.env` is in `.gitignore` (safe from Git)
- ✅ Environment variables on production servers are secure

---

## Development Scripts

```bash
npm start      # Start server (production mode)
npm run dev    # Start with auto-reload (requires nodemon)
```

---

## Next Steps

1. ✅ Read `SETUP_INSTRUCTIONS.md` for detailed steps
2. ✅ Get Gmail App Password
3. ✅ Create `.env` file
4. ✅ Run `npm install`
5. ✅ Run `npm start`
6. ✅ Test form on Contact page

---

## Resources

- **Nodemailer Docs:** [nodemailer.com](https://nodemailer.com/)
- **Express Docs:** [expressjs.com](https://expressjs.com/)
- **Gmail Security:** [myaccount.google.com/security](https://myaccount.google.com/security)
- **Gmail App Passwords:** [support.google.com](https://support.google.com/accounts/answer/185833)

---

Made with ❤️ for FlicksByNick Photography
