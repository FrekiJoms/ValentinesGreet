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
3. Copy and paste this SQL. Start with the basic table creation:

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

-- Create index for faster queries
CREATE INDEX idx_letter_id ON user_letters(letter_id);
CREATE INDEX idx_created_at ON user_letters(created_at DESC);
```

4. Click **"Run"** button
5. You should see "Success. No rows returned" message

## Step 2.5: Secure with Row Level Security (RLS)

Now add security policies to protect user data. Run this SQL in a new query:

```sql
-- 1. ENABLE RLS ON THE LETTERS TABLE
ALTER TABLE user_letters ENABLE ROW LEVEL SECURITY;

-- 2. ALLOW ANYONE TO READ (SELECT) ANY LETTER BY ID
-- This allows users to view public letters if they have the letter ID
CREATE POLICY "Letters are publicly readable by ID"
  ON user_letters
  FOR SELECT
  USING (true);

-- 3. ALLOW ANYONE TO CREATE (INSERT) NEW LETTERS
-- This allows anonymous users to create new letters
CREATE POLICY "Anyone can create a letter"
  ON user_letters
  FOR INSERT
  WITH CHECK (true);

-- 4. ALLOW UPDATES BUT PROTECT CONTENT WITH A TRIGGER
-- This RLS policy allows updates, but a trigger will enforce that only view_count changes
CREATE POLICY "Allow updates with content protection"
  ON user_letters
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- 5. ADD TRIGGER TO PREVENT MODIFICATION OF LETTER CONTENT
-- This trigger ensures only view_count can be updated, not sender name, message, etc.
CREATE OR REPLACE FUNCTION prevent_letter_modification()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if any protected fields were modified
  IF NEW.sender_name != OLD.sender_name
    OR NEW.recipient_name != OLD.recipient_name
    OR NEW.title != OLD.title
    OR NEW.message != OLD.message
    OR NEW.created_at != OLD.created_at
  THEN
    RAISE EXCEPTION 'Cannot modify letter content. Only view_count can be updated.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_no_content_modification
BEFORE UPDATE ON user_letters
FOR EACH ROW
EXECUTE FUNCTION prevent_letter_modification();

-- 6. OPTIONAL: Add rate limiting to prevent spam
CREATE OR REPLACE FUNCTION check_letter_creation_rate()
RETURNS TRIGGER AS $$
BEGIN
  -- Prevent spam: max ~100 letters per 24 hours globally
  IF (SELECT COUNT(*) FROM user_letters 
      WHERE created_at > NOW() - INTERVAL '24 hours') > 100 THEN
    RAISE EXCEPTION 'Rate limit exceeded. Too many letters created today. Try again tomorrow.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_letter_creation_rate
BEFORE INSERT ON user_letters
FOR EACH ROW
EXECUTE FUNCTION check_letter_creation_rate();

-- 6. OPTIONAL: Add data validation to ensure quality
CREATE OR REPLACE FUNCTION validate_letter_fields()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure required fields are not empty
  IF NEW.sender_name IS NULL OR TRIM(NEW.sender_name) = '' THEN
    RAISE EXCEPTION 'Sender name is required';
  END IF;
  IF NEW.recipient_name IS NULL OR TRIM(NEW.recipient_name) = '' THEN
    RAISE EXCEPTION 'Recipient name is required';
  END IF;
  IF NEW.title IS NULL OR TRIM(NEW.title) = '' THEN
    RAISE EXCEPTION 'Letter title is required';
  END IF;
  IF NEW.message IS NULL OR TRIM(NEW.message) = '' THEN
    RAISE EXCEPTION 'Message is required';
  END IF;
  
  -- Ensure message doesn't exceed 2000 characters
  IF LENGTH(NEW.message) > 2000 THEN
    RAISE EXCEPTION 'Message cannot exceed 2000 characters';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_letter_before_insert
BEFORE INSERT ON user_letters
FOR EACH ROW
EXECUTE FUNCTION validate_letter_fields();
```

6. Click **"Run"** button

**Security Summary:**
- ✅ **SELECT**: Anyone can read any letter (public access)
- ✅ **INSERT**: Anyone can create letters
- ✅ **UPDATE**: Only view_count can be updated (prevents tampering with content)
- ❌ **DELETE**: Disabled (users cannot delete letters)
- ❌ **SPAM**: Rate-limited (max 100 letters per 24 hours)
- ❌ **BAD DATA**: Validated server-side (required fields, max length)

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
