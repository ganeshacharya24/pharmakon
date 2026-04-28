// Netlify serverless function — fetches real subscriber count from Kit
// Uses Kit V4 API. Your API key is stored as an environment variable
// and never exposed to the browser.

exports.handler = async function(event, context) {
  const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };
  }

  try {
    const KIT_API_KEY = process.env.KIT_API_KEY;  // your V4 key
    const KIT_FORM_ID = process.env.KIT_FORM_ID;  // 9353033

    if (!KIT_API_KEY || !KIT_FORM_ID) {
      throw new Error('Missing environment variables');
    }

    // Kit V4 API — bearer token auth
    const res = await fetch(
      `https://api.kit.com/v4/forms/${KIT_FORM_ID}/subscribers?per_page=1`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${KIT_API_KEY}`,
          'Content-Type': 'application/json',
          'X-Kit-Api-Key': KIT_API_KEY,
        },
      }
    );

    if (!res.ok) throw new Error('Kit API returned ' + res.status);

    const data = await res.json();

    // V4 API returns pagination object with total count
    const count = data.pagination?.total ?? data.meta?.total_count ?? 0;

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ count }),
    };

  } catch (err) {
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ count: 0, error: err.message }),
    };
  }
};
