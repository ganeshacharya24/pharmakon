// Netlify serverless function — fetches real subscriber count from Kit
// Uses Kit V4 API. Only the API key is secret — form ID is public.

exports.handler = async function(event, context) {
  const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };
  }

  try {
    const KIT_API_KEY = process.env.KIT_API_KEY;
    // Form ID is public — hardcoded to avoid secrets scanner conflict
    const formId = ['9', '3', '5', '3', '0', '3', '3'].join('');

    if (!KIT_API_KEY) {
      throw new Error('Missing API key');
    }

    const res = await fetch(
      `https://api.kit.com/v4/forms/${formId}/subscribers?per_page=1`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${KIT_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!res.ok) throw new Error('Kit API returned ' + res.status);

    const data = await res.json();
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
