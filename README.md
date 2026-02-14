# FrekiValentine Card 💌

A beautiful, interactive Valentine's Day card that you can share with anyone. Send love with a personalized digital greeting featuring a romantic envelope animation, heartfelt messages, and social sharing capabilities.

**Live:** https://frekivalentine.edgeone.app

---

## ✨ Features

- **Interactive Envelope** - Click to open a beautiful animated envelope and reveal a heartfelt message
- **Random Greetings** - Each page load shows a different casual greeting in Bisaya and Tagalog
- **Hero Section** - Eye-catching "Happy Hearts Day!" headline with animated decorative hearts
- **Social Sharing** - Easy share button to send the card URL to friends via social media, email, SMS, or copy to clipboard
- **Creator Profile** - Click to view creator socials (GitHub, Instagram, Discord, Feedback)
- **Letter Creator** - Users can create their own custom love letters with Supabase backend
- **Ambient Hearts** - Floating heart particles throughout the page for a romantic atmosphere
- **Mobile Responsive** - Beautiful on all devices with optimized layouts
- **Analytics Tracking** - Google Analytics integration to track user engagement and letter creation
- **Particle Effects** - Burst of hearts and sparkles when opening the envelope
- **Smooth Animations** - Polished transitions and micro-interactions throughout

---

## 🎯 How to Use

1. **Share the URL** - Send `https://frekivalentine.edgeone.app` to anyone
2. **They Open It** - When recipients open the link, they see a beautiful Valentine's card
3. **They Click the Envelope** - Tapping the envelope reveals a personalized message
4. **They Can Share** - Recipients can share the card with others using the share button in the letter
5. **You Get Analytics** - Track how many people opened it and engaged with your card

---

## 📁 File Structure

```
ValentinesGreet/
├── index.html          # Main HTML file with meta tags for social sharing
├── styles.css          # All styling and animations
├── script.js           # JavaScript logic and event handling
├── icon.png            # Preview image for social sharing
└── README.md           # This file
```

---

## 🛠️ Customization

### Change the Message

Edit the `GREETING_LETTERS` array in `script.js` (around line 270) to add your own messages:

```javascript
{
  title: 'Your Title Here',
  paragraphs: [
    'Your first paragraph',
    'Your second paragraph',
    'Your third paragraph'
  ],
  signoff: ['Sign off line 1,', 'Sign off line 2']
}
```

### Change Creator Name

In `index.html`, update:
- Line 14: `<p>Made by @FrekiJosh with love</p>` - Change to your name
- Meta tags for social sharing (lines 10-23)

### Update Social Links

In `index.html`, update the social links section (lines 104-119):
- GitHub
- Instagram
- Discord
- Feedback email

### Customize Colors

In `styles.css`, update the `:root` CSS variables (lines 1-10):

```css
:root {
  --heart: #e74a7a;        /* Heart color */
  --ink: #8f3d5a;          /* Text color */
  /* ... other colors */
}
```

### Change Hero Title

To change the "Happy Hearts Day!" text, edit `index.html` lines 33-37 in the `.hero-title` section.

---

## 📊 Analytics Setup

### View Your Analytics

1. Go to [analytics.google.com](https://analytics.google.com)
2. Select your property (FrekiValentine)
3. Navigate to **Reports** → **Engagement** → **Events**

### Tracked Events

- **envelope_opened** - How many people opened the letter
- **profile_modal_opened** - How many viewed your socials
- **letter_shared** - How many people shared the card
- **social_link_clicked** - Which social links got clicks (GitHub, Instagram, Discord)
- **feedback_clicked** - How many sent you feedback
- **letter_created** - How many users created custom letters

---

## 📮 Letter Creator Feature

Allow your users to create and share their own custom love letters!

### Setup

1. See [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for detailed setup instructions
2. Create a free Supabase project at [supabase.com](https://supabase.com)
3. Set up the database table with provided SQL
4. Add your Supabase credentials to `script.js`

### How It Works

1. Users click **"Create Your Own Letter"** button below the card
2. A beautiful modal opens with a form
3. Users fill in:
   - Their name (sender)
   - Recipient's name
   - Letter title
   - Custom message (up to 2000 characters)
4. They click "Create & Get Link"
5. System generates a unique shareable URL
6. Users can copy and send to anyone

### Database

All letters are stored in Supabase with:
- Unique letter ID
- Sender/recipient names
- Date created
- View count tracking

### Customization

Edit the form fields in `index.html` (lines 126-177) to add more options:
- Additional input fields
- Color picker
- Font selection
- etc.

---

## 🚀 Deployment

### Current Hosting

Your card is deployed on **Cloudflare Pages** at:
```
https://frekivalentine.edgeone.app
```

### Deploy Updates

1. Update your files locally
2. Push to your GitHub repository
3. Cloudflare Pages automatically rebuilds and deploys

### To Deploy Elsewhere

**Netlify:**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

**Vercel:**
```bash
npm install -g vercel
vercel --prod
```

**GitHub Pages:**
Push to `gh-pages` branch or configure in repository settings.

---

## 📝 Meta Tags for Social Sharing

When someone shares your card, they'll see:

- **Title:** "FrekiJosh sent you a Valentine's Card!"
- **Description:** "I opened my heart for you. Tap to see what's inside..."
- **Image:** Your `icon.png` (shown in preview)

To customize, edit lines 10-23 in `index.html`.

---

## 🎨 Design Notes

- **Typography:** Georgia serif for romantic feel, Brush Script MT for handwritten style
- **Colors:** Pink theme with shades of rose (#e63c70, #ff7ba3)
- **Animations:** Smooth 300-500ms transitions, floating heart particles
- **Responsive:** Works on mobile (320px), tablet, and desktop (1920px+)

---

## 📱 Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🔒 Privacy & Tracking

- Google Analytics tracks page views and user interactions
- No personal data is stored
- Recipients clicking your shared link see the analytics ID but no sensitive info
- To disable tracking, remove the Google Analytics script from `index.html` (lines 28-35)

---

## 🐛 Troubleshooting

**Letter doesn't open?**
- Check browser console for errors
- Ensure JavaScript is enabled
- Try refreshing the page

**Share button not working?**
- On mobile: Uses native share menu (expected behavior)
- On desktop: Copies link to clipboard with notification
- Check clipboard permissions in browser

**Images not showing?**
- Ensure `icon.png` exists in root directory
- Verify image path is correct

**Analytics not tracking?**
- Check that Google Analytics script is in `<head>` section
- Verify Measurement ID (G-TH3QX353B2) is correct
- Wait a few minutes for data to appear in Analytics dashboard

---

## 📄 License

This project is open source. Feel free to customize and share!

---

## 💝 Credits

**Created by:** FrekiJosh  
**GitHub:** https://github.com/FrekiJoms/ValentinesGreet  
**Instagram:** https://www.instagram.com/freki.josh/  
**Discord:** https://discord.com/users/1282750121200844851

---

## 🎁 Share Your Love

Send this card to someone special and let them know they matter to you!

Made with ❤️ on Valentine's Day 2026
