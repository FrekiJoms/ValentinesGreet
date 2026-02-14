# Supabase Setup Guide for Letter Creator Feature

This guide will walk you through setting up Supabase to enable the "Create Your Own Letter" feature.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click **"Sign In"** or **"Start Your Project"**
3. Sign up with GitHub, Google, or email
4. Create a new organization (or use existing)
5. Click **"New Project"**
6. Fill in project details:
   - **Project Name:** FrekiValentine (or your choice)
   - **Database Password:** Create a strong password (save this!)
   - **Region:** Choose closest to your users
   - **Pricing Plan:** Free tier is sufficient to start

7. Wait for the project to initialize (2-3 minutes)

## Step 2: Create the Letters Table

1. In your Supabase dashboard, go to **"SQL Editor"** on the left sidebar
2. Click **"New Query"**
3. Copy and paste this SQL:

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

-- Enable RLS (Row Level Security)
ALTER TABLE user_letters ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous reads
CREATE POLICY "Allow public read" ON user_letters
FOR SELECT USING (true);

-- Create policy to allow anonymous inserts
CREATE POLICY "Allow public insert" ON user_letters
FOR INSERT WITH CHECK (true);

-- Create policy to allow updates to view_count
CREATE POLICY "Allow public update" ON user_letters
FOR UPDATE USING (true);

-- Create index for faster queries
CREATE INDEX idx_letter_id ON user_letters(letter_id);
CREATE INDEX idx_created_at ON user_letters(created_at DESC);
```

4. Click **"Run"** button
5. You should see "Success. No rows returned" message

## Step 3: Get Your API Credentials

1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy these values:
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys")

## Step 4: Add Credentials to Your Code

1. Open `script.js` in your editor
2. Find lines with:
   ```javascript
   const SUPABASE_URL = 'YOUR_SUPABASE_URL';
   const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
   ```

3. Replace with your actual values:
   ```javascript
   const SUPABASE_URL = 'https://xxxxx.supabase.co';
   const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
   ```

## Step 5: Test It

1. Deploy your updated code
2. Visit your site
3. Click **"Create Your Own Letter"** button
4. Fill in the form and submit
5. You should get a shareable link

## Step 6: View Submissions

To see all letters created by users:

1. Go to **Supabase Dashboard**
2. Click **"Table Editor"**
3. Click on **"user_letters"** table
4. You'll see all submitted letters

## Managing Letters

### Delete a Letter
```sql
DELETE FROM user_letters WHERE letter_id = 'letter_xxxxx';
```

### View Statistics
```sql
SELECT 
  sender_name,
  recipient_name,
  title,
  created_at,
  view_count
FROM user_letters
ORDER BY created_at DESC;
```

### Reset View Counts
```sql
UPDATE user_letters SET view_count = 0;
```

## Security Notes

- **Row Level Security (RLS)** is enabled, so only the policies control access
- The free tier is limited to 500MB database size (plenty for letter data)
- Backups are automatic
- All data is encrypted in transit (HTTPS) and at rest

## Troubleshooting

### "Failed to initialize Supabase"
- Check that SUPABASE_URL and SUPABASE_ANON_KEY are correct
- Make sure https://, don't include trailing slashes
- Refresh the page

### "INSERT error - permission denied"
- Check that the table policies are set up correctly
- Verify RLS is enabled on the table
- Check the "user_letters" table exists

### Letters not showing up
- Go to Table Editor and refresh
- Check Supabase project is in the right region
- Check browser console for errors (F12)

### "Table doesn't exist"
- Make sure you ran the SQL query in Step 2
- Check that SQL executed without errors
- Refresh the page

## Upgrade to Paid Plan (Optional)

When you need more storage or features:

1. Go to **Settings** → **Billing**
2. Click **"Upgrade to Pro"**
3. Enter payment info
4. Pro plan includes:
   - 8GB database
   - Higher API rate limits
   - Priority support
   - ~$25/month

## File Structure After Setup

```
ValentinesGreet/
├── index.html           # Updated with editor modal
├── styles.css           # Updated with editor styles
├── script.js            # Updated with Supabase code
├── SUPABASE_SETUP.md    # This file
└── README.md            # Main documentation
```

## API Reference for Custom Features

### Insert a Letter
```javascript
const { data, error } = await supabase
  .from('user_letters')
  .insert([{
    letter_id: 'unique_id',
    sender_name: 'John',
    recipient_name: 'Jane',
    title: 'My Letter',
    message: 'Content here',
    created_at: new Date().toISOString()
  }]);
```

### Get a Letter
```javascript
const { data, error } = await supabase
  .from('user_letters')
  .select('*')
  .eq('letter_id', 'letter_xxx')
  .single();
```

### Update View Count
```javascript
const { error } = await supabase
  .from('user_letters')
  .update({ view_count: data.view_count + 1 })
  .eq('letter_id', 'letter_xxx');
```

## Support

- **Supabase Docs:** https://supabase.com/docs
- **Supabase Community:** https://supabase.com/community
- **Discord:** https://discord.supabase.com

---

Once set up, your users can create, share, and track their valentine letters!
