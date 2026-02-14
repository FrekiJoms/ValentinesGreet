// Cloudflare Worker to handle dynamic meta tags for shared letters
// Deploy with: wrangler deploy

// List of crawlers to detect
const crawlerUserAgents = [
  'facebookexternalhit',
  'Twitterbot',
  'LinkedInBot',
  'Slurp',
  'googlebot',
  'bingbot',
  'Baiduspider',
  'yandexbot',
  'preview'
];

function isCrawler(userAgent) {
  return crawlerUserAgents.some(crawler => 
    userAgent.toLowerCase().includes(crawler.toLowerCase())
  );
}

async function getLetterData(letterId, supabaseUrl, supabaseKey) {
  try {
    const url = `${supabaseUrl}/rest/v1/user_letters?letter_id=eq.${encodeURIComponent(letterId)}&select=sender_name,recipient_name`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey,
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error(`Supabase error: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    if (data && data.length > 0) {
      return data[0];
    }
    return null;
  } catch (err) {
    console.error('Error fetching letter:', err);
    return null;
  }
}

function injectMetaTags(html, senderName) {
  const title = `${senderName} sent you a Valentine's Card!`;
  
  // Replace OG title
  html = html.replace(
    /id="og-title"\s+property="og:title"\s+content="[^"]*"/,
    `id="og-title" property="og:title" content="${title.replace(/"/g, '&quot;')}"`
  );
  
  // Replace Twitter title
  html = html.replace(
    /id="twitter-title"\s+name="twitter:title"\s+content="[^"]*"/,
    `id="twitter-title" name="twitter:title" content="${title.replace(/"/g, '&quot;')}"`
  );
  
  return html;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const userAgent = request.headers.get('user-agent') || '';
    
    // Check if this is a crawler request
    if (!isCrawler(userAgent)) {
      // Not a crawler, serve normally
      return fetch(request);
    }
    
    // Check for letter parameter
    const letterId = url.searchParams.get('letter');
    if (!letterId) {
      // No custom letter, serve normally
      return fetch(request);
    }
    
    try {
      // Fetch the original HTML from origin
      const originalResponse = await fetch(request);
      let html = await originalResponse.text();
      
      // Get letter data from Supabase
      const letterData = await getLetterData(
        letterId,
        env.SUPABASE_URL,
        env.SUPABASE_ANON_KEY
      );
      
      if (letterData && letterData.sender_name) {
        // Inject custom meta tags
        html = injectMetaTags(html, letterData.sender_name);
      }
      
      // Return modified HTML
      return new Response(html, {
        status: originalResponse.status,
        statusText: originalResponse.statusText,
        headers: new Headers(originalResponse.headers)
      });
    } catch (err) {
      console.error('Worker error:', err);
      // Fall back to normal response on error
      return fetch(request);
    }
  }
};
