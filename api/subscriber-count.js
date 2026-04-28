export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const KIT_API_KEY = process.env.KIT_API_KEY;
    const formId = ['9','3','5','3','0','3','3'].join('');

    if (!KIT_API_KEY) throw new Error('Missing API key');

    const kitRes = await fetch(
      `https://api.convertkit.com/v3/forms/${formId}/subscriptions?api_key=${KIT_API_KEY}&per_page=1`,
      { method: 'GET' }
    );

    if (!kitRes.ok) throw new Error('Kit API returned ' + kitRes.status);

    const data = await kitRes.json();
    const count = data.total_subscriptions ?? 0;

    return res.status(200).json({ count });

  } catch (err) {
    return res.status(200).json({ count: 0, error: err.message });
  }
}
