# FrekiValentine Card 💌

A beautiful, interactive Valentine's Day card that you can share with anyone. Send love with a personalized digital greeting featuring a romantic envelope animation, heartfelt messages, and social sharing capabilities.

**Live:** https://frekivalentine.edgeone.app

---

## 🚀 Quick Start

### Just Want to Share?
1. Copy the URL: `https://frekivalentine.edgeone.app`
2. Send it to someone
3. Done! They'll see a beautiful card

### Want Custom Letters?
1. See [SUPABASE_SETUP.md](SUPABASE_SETUP.md) (~5 minutes)
2. Add credentials to `script.js`
3. Users can click "Create Your Own Letter" button

---

## ✨ Features

### Core Experience
- **Interactive Envelope** - Click to open a beautiful animated envelope and reveal a heartfelt message
- **Random Greetings** - Each page load shows a different casual greeting in Bisaya and Tagalog
- **Hero Section** - Eye-catching "Happy Hearts Day!" headline with animated decorative hearts
- **Ambient Hearts** - Floating heart particles throughout the page for a romantic atmosphere
- **Particle Effects** - Burst of hearts and sparkles when opening the envelope
- **Smooth Animations** - Polished transitions and micro-interactions throughout

### Social Sharing & Community
- **Social Sharing** - Easy share button to send the card URL to friends via social media, email, SMS, or copy to clipboard
- **Creator Profile** - Click to view creator socials (GitHub, Instagram, Discord, Feedback)
- **Letter Creator** - Users can create their own custom love letters and get unique shareable links
- **Unified Sharing** - All letters (default or custom) share the same message: "I sent you a Valentine's Card!"

### Analytics & Tracking
- **Google Analytics Integration** - Track user engagement and letter creation
- **View Counting** - Automatic tracking of custom letter views
- **Event Tracking** - Monitor envelope opens, shares, and social clicks

### Technical
- **Mobile Responsive** - Beautiful on all devices with optimized layouts
- **Supabase Backend** - Secure database for custom letters
- **Cloudflare Workers** - Server-side meta tag injection for accurate social previews
- **No Login Required** - Fully anonymous letter creation and sharing

---

## 🎯 How to Use

### Sharing the Default Card

1. **Share the URL** - Send `https://frekivalentine.edgeone.app` to anyone
2. **They Open It** - When recipients open the link, they see a beautiful Valentine's card
3. **They Click the Envelope** - Tapping the envelope reveals a personalized message
4. **They Can Share** - Recipients can share the card with others using the share button in the letter
5. **You Get Analytics** - Track how many people opened it and engaged with your card

### Creating a Custom Letter

1. **Click "Create Your Own Letter"** - Button appears below the card
2. **Fill Out the Form:**
   - Your name (sender)
   - Recipient's name
   - Letter title
   - Your message (up to 2,000 characters)
3. **Click "Create & Get Link"**
4. **Copy and Share** - Get a unique URL like `frekivalentine.edgeone.app?letter=letter_xxxxx`
5. **Recipients See Your Name** - Social sharing shows "Your Name sent you a Valentine's Card!"

### Viewing Shared Custom Letters

1. Recipients open your sharing link
2. The card automatically loads YOUR message (not random greetings)
3. Your name appears in the letter signature
4. View count increases automatically
5. No replay button—keeps showing your custom letter

---

## 📁 File Structure

```
ValentinesGreet/
├── index.html                    # Main HTML with meta tags and modals
├── styles.css                    # All styling and animations
├── script.js                     # JavaScript logic, events, and Supabase integration
├── icon.png                      # Preview image for social sharing
├── README.md                     # This file
└── SUPABASE_SETUP.md             # Detailed Supabase configuration guide
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

## �‍💻 Development

### Clone & Run Locally

```bash
# Clone the repository
git clone https://github.com/FrekiJoms/ValentinesGreet.git
cd ValentinesGreet

# Start a local server
# Option 1 (Python):
python -m http.server 8000

# Option 2 (Node):
npx http-server

# Option 3 (VS Code):
# Right-click index.html → "Open with Live Server"

# Open: http://localhost:8000
```

### Code Overview

**index.html** (~209 lines)
- Semantic HTML structure
- Meta tags for social sharing
- Modal dialogs (profile, letter, editor)
- Accessibility attributes (a11y best practices)

**styles.css** (~1362 lines)
- CSS variables for theming
- Flexbox and Grid layouts
- Keyframe animations
- Responsive design with mobile-first approach

**script.js** (~810 lines)
- DOM manipulation and event listeners
- Particle effects and animations
- Supabase integration
- Google Analytics tracking

### Making Changes

**Add Greeting Letter:**
1. Edit `GREETING_LETTERS` array in `script.js` (line ~300)
2. Follow format: `{ title, paragraphs: [], signoff: [] }`
3. Test by refreshing

**Change Theme Colors:**
1. Edit CSS variables in `styles.css` (lines 1-10)
2. Example: `--heart: #your-color`

**Test Analytics:**
- Events appear in 1-2 minutes
- Check: analytics.google.com > your property
- Or use: Real-time > Events view

### Debugging

Open DevTools (F12):
- **Elements**: Inspect HTML and styles
- **Console**: JavaScript errors and logs
- **Network**: Check API calls to Supabase
- **Application**: View local storage and cookies

---

## �📊 Analytics Setup

### View Your Analytics

1. Go to [analytics.google.com](https://analytics.google.com)
2. Select your property (FrekiValentine)
3. Navigate to **Reports** → **Engagement** → **Events**

### Tracked Events

- **envelope_opened** - How many people opened the envelope and viewed the letter
- **profile_modal_opened** - How many clicked to view your socials
- **letter_shared** - How many people used the share button
- **social_link_clicked** - Which social links got clicks (GitHub, Instagram, Discord)
- **feedback_clicked** - How many sent you feedback
- **letter_created** - How many custom letters users created

### Custom Letter Analytics

Track custom letter performance in Supabase:

```sql
-- View all custom letters with stats
SELECT 
  sender_name,
  recipient_name,
  title,
  created_at,
  view_count
FROM user_letters
ORDER BY created_at DESC;

-- Most viewed custom letters
SELECT 
  sender_name,
  recipient_name,
  title,
  view_count
FROM user_letters
ORDER BY view_count DESC
LIMIT 10;
```

In the Supabase dashboard:
1. Go to **Table Editor**
2. Click **"user_letters"** table
3. Sort by `view_count` to see popular letters

---

## 📮 Letter Creator Feature

Allow your users to create and share their own custom love letters!

### Quick Setup

1. **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)** - Create Supabase project and database table
2. **Add Credentials** to `script.js` (lines 577-578)
3. **Done!** Users can now create letters

### How It Works

**Frontend:**
1. User clicks "Create Your Own Letter" button
2. Modal form opens with 4 fields
3. Form validates and submits to Supabase
4. Unique ID generated: `letter_xxxxx`
5. Shareable URL created: `frekivalentine.edgeone.app?letter=letter_xxxxx`

**Backend (Supabase):**
- Stores: Sender name, recipient name, title, message, creation date, view count
- Row Level Security enabled (public read/insert/update)
- Automatic view count increment on each view
- Index created for fast letter lookups

### Database Structure

```sql
CREATE TABLE user_letters (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  letter_id TEXT UNIQUE NOT NULL,
  sender_name TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  view_count INT DEFAULT 0
);
```

### Form Customization

Edit the form fields in `index.html` (lines 164-180) to add:
- Character count display (already included)
- Additional fields (color, font, etc.)
- File uploads
- etc.

---

##  Deployment

### Current Setup

Your card is deployed on **Cloudflare Pages** at:
```
https://frekivalentine.edgeone.app
```

**Cloudflare automatically:**
- Rebuilds and deploys when you push to GitHub
- Serves files globally via CDN
- Provides SSL/HTTPS
- Includes edge security


### Deploy to Other Hosting

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
- Push to `gh-pages` branch or configure in repository settings

---

## 📝 Social Sharing Meta Tags

All shared links (default or custom letters) show:

- **Title:** "I sent you a Valentine's Card!"
- **Description:** "I opened my heart for you. Tap to see what's inside..."
- **Image:** `icon.png`

The unified message works perfectly for all sharing scenarios—no customization needed!

To edit the message, modify lines 10-12 in `index.html`.

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

## 🔒 Privacy & Data

### Tracking & Analytics

- **Google Analytics** tracks page views and user interactions (events)
- **No personal data stored** from tracking
- Recipients' names/emails are NOT collected
- To disable: Remove Google Analytics script from `index.html` (lines 29-36)

### Custom Letter Data

Letters created via the Letter Creator are stored in Supabase:
- **Publicly accessible** via unique letter ID
- **Searchable** only by exact letter ID (privacy through obscurity)
- **Not indexed** by search engines (no robots.txt block needed)
- **View count tracked** but not linked to IPs or identities

### Data Deletion

To delete a custom letter from Supabase:

```sql
DELETE FROM user_letters WHERE letter_id = 'letter_xxxxx';
```

Access this via Supabase dashboard → SQL Editor.

---

## 🐛 Troubleshooting

### General Issues

**Letter doesn't open?**
- Check browser console (F12) for errors
- Ensure JavaScript is enabled
- Try refreshing the page
- Clear cache (Ctrl+Shift+Del)

**Share button not working?**
- On mobile: Uses native share menu (expected behavior)
- On desktop: Copies link to clipboard with notification
- Check browser clipboard permissions

**Images not showing?**
- Ensure `icon.png` exists in root directory
- Verify image paths are correct in `index.html`

**Analytics not tracking?**
- Check Google Analytics script is in `<head>` (lines 29-36)
- Verify Measurement ID is correct: `G-TH3QX353B2`
- Wait a few minutes for data to appear
- Check browser console for gtag errors

### Letter Creator Issues

**"Letter creation not available" message?**
- Supabase credentials not set in `script.js`
- Add your Supabase URL and key (see [SUPABASE_SETUP.md](SUPABASE_SETUP.md))

**"Failed to create letter" error?**
- Check Supabase project is active
- Verify RLS policies allow public insert
- Check browser console for specific error message
- Ensure message is under 2000 characters

**Letter created but not showing when shared?**
- Supabase initialized but API error
- Check Supabase connection in browser console
- Verify letter ID is in URL: `?letter=letter_xxxxx`

**Custom letter shows random greeting instead?**
- Letter ID not found in Supabase
- Check ID spelling in shared URL
- Verify Supabase table has the letter
- Clear browser cache

---

## 📄 License

This project is open source and free to use, customize, and share!

---

## 📚 Additional Resources

- **Supabase Docs:** https://supabase.com/docs
- **Google Analytics:** https://analytics.google.com
- **GitHub Repository:** https://github.com/FrekiJoms/ValentinesGreet

---

## 💝 Credits

**Created by:** FrekiJosh  
**GitHub:** https://github.com/FrekiJoms/ValentinesGreet  
**Instagram:** https://www.instagram.com/freki.josh/  
**Discord:** https://discord.com/users/1282750121200844851

---

## 🎁 Share Your Love

Send this card to someone special and let them know they matter to you!

**Features:**
- 💌 Beautiful envelope animation
- 🎨 Romantic design with particle effects
- 🌍 Share with anyone anywhere
- ❤️ Create custom love letters
- 📊 Analytics tracking
- 🔒 Privacy-focused

Made with ❤️ on Valentine's Day 2026

---

**Questions?** Open an issue on GitHub or send feedback to baktotph@gmail.com
