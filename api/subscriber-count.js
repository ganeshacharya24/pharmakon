export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

  // POST — save a new email
  if (req.method === 'POST') {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ error: 'Email required' });

      const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/waitlist`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({ email }),
      });

      if (insertRes.status === 409) {
        return res.status(200).json({ success: true, message: 'Already registered' });
      }

      if (!insertRes.ok) throw new Error('Failed to save email');

      return res.status(200).json({ success: true });

    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // GET — return live count
  try {
    const countRes = await fetch(
      `${SUPABASE_URL}/rest/v1/waitlist?select=count`,
      {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer': 'count=exact',
          'Range': '0-0',
        },
      }
    );

    const contentRange = countRes.headers.get('content-range');
    const count = contentRange ? parseInt(contentRange.split('/')[1]) : 0;

    return res.status(200).json({ count });

  } catch (err) {
    return res.status(200).json({ count: 0, error: err.message });
  }
}
