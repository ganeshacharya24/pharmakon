export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const KIT_API_KEY = process.env.KIT_API_KEY;
    const formId = ['9','3','5','3','0','3','3'].join('');

    if (!KIT_API_KEY) throw new Error('Missing API key');

    // Get all subscribers to count them
    const kitRes = await fetch(
      `https://api.kit.com/v4/subscribers?per_page=1`,
      {
        method: 'GET',
        headers: {
          'X-Kit-Api-Key': KIT_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!kitRes.ok) throw new Error('Kit API returned ' + kitRes.status);

    const data = await kitRes.json();
    
    // Log the full response so we can see the structure
    console.log('Kit response:', JSON.stringify(data));
    
    const count = data.pagination?.total_count 
      ?? data.pagination?.total
      ?? data.meta?.total_count
      ?? data.total_subscribers
      ?? 0;

    return res.status(200).json({ count, debug: data.pagination });

  } catch (err) {
    return res.status(200).json({ count: 0, error: err.message });
  }
}
