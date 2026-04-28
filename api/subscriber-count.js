export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const KIT_API_KEY = process.env.KIT_API_KEY;
    const formId = ['9','3','5','3','0','3','3'].join('');

    if (!KIT_API_KEY) throw new Error('Missing API key');

    const kitRes = await fetch(
      `https://api.kit.com/v4/forms/${formId}/subscribers?per_page=1`,
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
    const count = data.pagination?.total ?? 0;

    return res.status(200).json({ count });

  } catch (err) {
    return res.status(200).json({ count: 0, error: err.message });
  }
}
