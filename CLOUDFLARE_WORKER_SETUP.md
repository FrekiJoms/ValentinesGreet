# Dynamic Meta Tags with Cloudflare Workers

Since social media crawlers don't execute JavaScript, we need a **server-side solution** to dynamically update meta tags based on the letter ID.

## The Problem

- When someone shares a custom letter link (e.g., `?letter=letter_xxxx`), the the social crawler reads the HTML **before JavaScript runs**
- The static meta tags show "FrekiJosh sent you a Valentine's Card!" instead of the sender's name
- JavaScript updates to meta tags don't help because crawlers only read the initial HTML

## The Solution: Cloudflare Workers

Use a Cloudflare Worker to intercept requests from social media crawlers and inject the correct meta tags based on the letter ID.

## Setup Steps

### Step 1: Install Wrangler

```bash
npm install -g wrangler
```

### Step 2: Configure wrangler.toml

In your project root, create or update `wrangler.toml`:

```toml
name = "valentines-worker"
main = "src/worker.js"
type = "javascript"
compatibility_date = "2024-02-15"

[env.production]
route = "frekivalentine.edgeone.app/*"
zone_id = "YOUR_CLOUDFLARE_ZONE_ID"

[env.production.vars]
SUPABASE_URL = "YOUR_SUPABASE_URL"
SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY"
```

### Step 3: Create Worker Directory

```bash
mkdir -p src
cp _worker.js src/worker.js
```

### Step 4: Update Environment Variables

1. Go to your Cloudflare dashboard
2. Find your Zone ID (located in the right sidebar on your domain page)
3. Copy your Supabase credentials
4. Replace in `wrangler.toml`:
   - `YOUR_CLOUDFLARE_ZONE_ID`
   - `YOUR_SUPABASE_URL`
   - `YOUR_SUPABASE_ANON_KEY`

### Step 5: Deploy the Worker

```bash
wrangler deploy --env production
```

### Step 6: Test It

1. Create a test letter and get the shareable link
2. Try sharing it on Facebook/Twitter and check the preview
3. The title should show the sender's name instead of "FrekiJosh"

## Alternative: Simpler Approach (No Browser Cache)

If you just want to test without Cloudflare Workers:

1. The JavaScript approach is already implemented
2. When visiting the page in **an incognito/private window**, the meta tags update before being read
3. **However**, this won't work for social media crawlers

## How the Worker Works

1. **Detects crawler requests** - Checks User-Agent header for known crawlers (Facebook, Twitter, Google, LinkedIn, etc.)
2. **Checks for letter parameter** - If URL has `?letter=`, extracts the ID
3. **Fetches letter data** - Queries Supabase for the sender's name
4. **Modifies HTML** - Injects the custom name into the meta tags
5. **Serves modified response** - Returns HTML with correct social sharing preview

## Troubleshooting

### "Failed to authenticate"
- Check that SUPABASE_URL and SUPABASE_ANON_KEY are correct
- Make sure the environment variables are set in `wrangler.toml` or Cloudflare dashboard

### Meta tags still show "FrekiJosh"
- Verify the worker is deployed: `wrangler deployments list`
- Check worker logs: `wrangler tail`
- Test with: `curl -H "User-Agent: Twitterbot" https://yoursite.com?letter=letter_xxx`

### Social media preview still cached
- Social platforms cache previews for 24 hours
- Use their cache clearing tools:
  - **Facebook**: facebook.com/sharer/debug
  - **Twitter**: twitter.com/intent/tweet (preview updates within minutes)
  - **LinkedIn**: linkedin.com/feed/update (clears on next share)

## Security

- The worker only modifies HTML for crawler requests
- Regular users still get the normal JavaScript experience
- Letter data is fetched from your Supabase instance (access controlled by RLS)

## Costs

Cloudflare Workers free tier includes:
- 100,000 requests/day
- More than enough for typical usage
- Upgrade to paid ($5/month) for unlimited requests

## Files

- `src/worker.js` - The Cloudflare Worker code
- `wrangler.toml` - Configuration file
- `index.html` - Updated with IDs on meta tags
- `script.js` - JavaScript for non-crawler requests

---

Once deployed, your custom letters will have accurate social media previews!
