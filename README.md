# FrekiValentine Card - Interactive Valentine's Day Greeting

A beautiful, interactive Valentine's Day card that you can share with anyone. Send heartfelt messages with a personalized digital greeting featuring a romantic envelope animation, thoughtful messages, and easy social sharing.

**Live Application:** https://frekivalentine.edgeone.app
<img width="960" height="474" alt="image" src="https://github.com/user-attachments/assets/0fee2685-aeed-49be-b580-6db352d346f0" />
---

## Quick Start

### Sharing the Default Card

1. Copy the URL: `https://frekivalentine.edgeone.app`
2. Send it to someone special
3. They'll see a beautiful, interactive Valentine's card

### Creating Custom Letters

To enable custom letter creation:

1. Follow the setup guide in [SUPABASE_SETUP.md](SUPABASE_SETUP.md) (approximately 5 minutes)
2. Add your credentials to `script.js`
3. Users can click "Create Your Own Letter" to personalize their greeting

---

## Features

### Interactive Experience

- **Animated Envelope** - Opening the envelope reveals personalized messages with smooth animations
- **Random Greetings** - Different messages appear on each visit, including Philippines-inspired text
- **Hero Section** - Eye-catching landing area with animated decorative elements
- **Ambient Effects** - Floating heart particles create a romantic atmosphere
- **Particle Animation** - Hearts and sparkles burst when the envelope opens

### Sharing & Community

- **Social Sharing** - Share via social media, email, SMS, or copy the link
- **Creator Profile** - Display your social links (GitHub, Instagram, Discord)
- **Custom Letter Creator** - Users can write personalized love letters with unique share links
- **Unified Messaging** - All shared cards display the same message: "I sent you a Valentine's Card"

### Analytics & Performance

- **Google Analytics Integration** - Track user engagement and interaction patterns
- **View Counting** - Monitor how many people viewed custom letters
- **Event Tracking** - Track opens, shares, and user actions
- **Safety Banner** - Prominent notice confirming legitimacy with privacy disclosure
- **Privacy Modal** - Full privacy policy accessible from the safety banner
- **Background Blur** - Dynamic blur effect when banner is active

### Technical Details

- **Mobile Optimized** - Responsive design for all device sizes
- **Supabase Backend** - Secure database for custom letters with Row Level Security
- **No Authentication Required** - Anonymous letter creation and sharing
- **Custom Scrollbar** - Pink-themed scrollbar with floating heart animation
- **Error Handling** - Dedicated error page for invalid or deleted letters
- **Privacy Focused** - Data handling complies with GDPR/CCPA standards

---

## How to Use

### Viewing the Default Card

1. Share the URL with someone: `https://frekivalentine.edgeone.app`
2. Recipients open the link and see your Valentine's card
3. They click the envelope to reveal the message
4. They can use the share button to pass it along
5. You'll see analytics data about engagement

### Creating Your Own Custom Letter

1. Click "Create Your Own Letter" button on the site
2. Fill in the form with:
   - Your name (sender)
   - Recipient's name
   - Letter title
   - Your message (up to 2,000 characters)
3. Click "Create & Get Link"
4. Copy the unique link and share it
5. Your name will appear when recipients view the card

### Letter Behavior

- Custom letters display only your message (not random greetings)
- Your name appears to identify you as the sender
- Recipients see view counts automatically increment
- The card remembers which letter to show based on the URL

---

## File Structure

```
ValentinesGreet/
├── index.html                    # Main page with envelope, modals, and forms
├── unknown.html                  # Error page for invalid/deleted letters
├── styles.css                    # Styling, animations, responsive design
├── script.js                     # Functionality, events, database integration
├── icon.png                      # Preview image for social sharing
├── README.md                     # This documentation
└── SUPABASE_SETUP.md             # Database setup guide with security policies
```

---

## Customization

### Modify Messages

Edit the `GREETING_LETTERS` array in `script.js` (around line 300):

```javascript
{
  title: 'Your Message Title',
  paragraphs: [
    'First paragraph of your message',
    'Second paragraph',
    'Final thoughts'
  ],
  signoff: ['Warm regards,', 'Your Name']
}
```

### Update Creator Information

In `index.html`:
- Line 45: Update the "Made by" text with your name
- Lines 10-20: Update social sharing metadata
- Lines 133-141: Add your actual social media links

### Customize Theme Colors

In `styles.css`, edit the root variables (lines 1-10):

```css
:root {
  --heart: #e74a7a;        /* Primary accent color */
  --ink: #8f3d5a;          /* Text color */
  --bg-a: #ffe2eb;         /* Background variants */
}
```

### Change Hero Section Title

Modify the "Happy Hearts Day!" text in `index.html` (lines 58-60) in the hero section.

---

## Development & Deployment

### Running Locally

```bash
# Option 1: Python
python -m http.server 8000

# Option 2: Node.js
npx http-server

# Option 3: VS Code
# Right-click index.html > "Open with Live Server"

# Then visit: http://localhost:8000
```

### Code Overview

**index.html** (217 lines)
- Semantic HTML structure
- Meta tags for social preview optimization
- Modal dialogs for forms and information
- ARIA attributes for accessibility

**styles.css** (1,600+ lines)
- CSS custom properties for theming
- Flexbox and Grid layouts
- Keyframe animations and transitions
- Mobile-first responsive design
- Custom scrollbar styling

**script.js** (920+ lines)
- DOM event handling
- Particle effect generation
- Supabase database integration
- Google Analytics event tracking
- Local storage for user preferences

### Testing Analytics

1. Visit analytics.google.com
2. Select your property
3. Look for events under Reports > Engagement > Events
4. Events appear within 1-2 minutes

### Common Modifications

**Adding a New Message:**
1. Add new object to `GREETING_LETTERS` in `script.js`
2. Save and test by refreshing

**Changing Colors:**
1. Update CSS variables in `styles.css`
2. Changes apply globally to all components

**Adjusting Analytics:**
1. Modify gtag() calls in `script.js` to track new events
2. Create custom events in your GA property

---

## Analytics Events

The application automatically tracks:

- **envelope_opened** - Count of envelope views
- **profile_modal_opened** - Creator profile clicks
- **letter_shared** - Social sharing actions
- **social_link_clicked** - Navigation to external profiles
- **feedback_clicked** - Feedback email submissions
- **letter_created** - Custom letter creation count
- **view_privacy_policy** - Privacy policy views

### Custom Letter Analytics

View letter statistics in your Supabase database:

```sql
-- All letters with statistics
SELECT sender_name, recipient_name, title, created_at, view_count
FROM user_letters
ORDER BY created_at DESC;

-- Most viewed letters
SELECT sender_name, recipient_name, title, view_count
FROM user_letters
ORDER BY view_count DESC
LIMIT 10;
```

Access this data through the Supabase dashboard Table Editor.

---

## Letter Creator Feature

Enable custom letter creation by following these steps:

### Database Setup

Complete the setup in [SUPABASE_SETUP.md](SUPABASE_SETUP.md):
1. Create a Supabase project
2. Run the provided SQL queries
3. Add your credentials to `script.js`

### Database Structure

The system stores:
- Sender name
- Recipient name  
- Letter title
- Message content
- Creation timestamp
- View count

All data is encrypted and protected with Row Level Security policies.

### User Workflow

1. User clicks "Create Your Own Letter"
2. Completes form with their message
3. System generates unique letter ID
4. Share link created automatically
5. Recipients see sender's name with the custom message

---

## Deployment

Your application is currently hosted on Cloudflare Pages:

```
https://frekivalentine.edgeone.app
```

Cloudflare automatically:
- Deploys on GitHub push
- Serves globally via CDN
- Provides SSL/HTTPS security
- Handles edge security

### Deploy to Alternative Platforms

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
Push to the `gh-pages` branch or configure via repository settings.

---

## Social Sharing

All shared links display:
- Title: "I sent you a Valentine's Card"
- Description: "I opened my heart for you. Tap to see what's inside..."
- Image: Your configured preview image

To customize these messages, edit the meta tags in `index.html` (lines 10-20).

---

## Design System

**Typography:**
- Georgia serif font for elegant text
- Brush Script MT for handwritten elements

**Color Palette:**
- Primary: Rose/pink tones (#e63c70, #ff7ba3)
- Accent: Deep burgundy (#873854)
- Background: Gradient pinks and whites

**Animations:**
- Smooth 300-500ms transitions
- Floating particle effects
- Entrance and exit animations

**Responsive Design:**
- Mobile optimization (320px and up)
- Tablet support (768px and up)
- Desktop layouts (1920px+)

---

## Browser Compatibility

Tested and working on:
- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Microsoft Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Privacy & Data

### Analytics & Tracking

- Google Analytics collects aggregated usage data
- No personally identifiable information is stored by analytics
- Recipients' names are not transmitted to tracking services
- To disable tracking: Remove the Google Analytics script from `index.html`

### Custom Letter Storage

Letters created through the Letter Creator:
- Stored securely in Supabase
- Accessible only via unique letter ID
- View counts tracked but not linked to personal data
- Can be deleted via database SQL commands

### GDPR & CCPA Compliance

The application includes:
- Privacy policy disclosure
- Data usage transparency
- User consent mechanisms
- Data deletion capabilities

---

## Troubleshooting

### General Issues

**Envelope won't open?**
- Check JavaScript is enabled
- Refresh the page and try again
- Clear browser cache
- Check browser console for errors (F12)

**Share button not working?**
- Desktop: Should copy link to clipboard
- Mobile: Uses native share menu
- Check browser permissions for clipboard

**Images not displaying?**
- Verify `icon.png` exists in project root
- Check image file paths are correct

**Analytics not showing data?**
- Wait 1-2 minutes for data to appear
- Verify Google Analytics ID is correct
- Check browser console for tracking errors

### Letter Creator Issues

**Letter creation unavailable?**
- Supabase credentials not configured in `script.js`
- Complete setup in [SUPABASE_SETUP.md](SUPABASE_SETUP.md)

**"This Letter Does Not Exist" error?**
- You've been taken to the `/unknown.html` error page
- The letter ID is invalid or the letter has been deleted
- Try creating your own letter instead using the button on the error page
- Double-check the shared link hasn't been modified

**Custom letter not loading?**
- Verify letter ID in URL matches database
- Check Supabase connection status
- Clear browser cache and refresh
- If error persists, letter may have been deleted

**Error creating letter?**
- Ensure all form fields are filled
- Check message is under 2000 characters
- Verify Supabase RLS policies are enabled
- Check browser console for specific error

---

## License

This project is open source and available for use, modification, and distribution.

---

## Resources

- Supabase Documentation: https://supabase.com/docs
- Google Analytics: https://analytics.google.com
- Project Repository: https://github.com/FrekiJoms/ValentinesGreet

---

## Contact & Support

**Creator:** FrekiJosh

**Connect:**
- GitHub: https://github.com/FrekiJoms
- Instagram: https://www.instagram.com/freki.josh/
- Discord: https://discord.com/users/1282750121200844851
- Email: baktotph@gmail.com

**Questions or Feedback?**
Open an issue on GitHub or email directly. All feedback and suggestions for improvement are appreciated.

---

Created with care on Valentine's Day, 2026. Send love to someone special.
