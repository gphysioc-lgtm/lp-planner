export default async function handler(req, res) {
  // 1. Get credentials from Vercel Environment Variables
  const clientId = process.env.CF_ACCESS_CLIENT_ID;
  const clientSecret = process.env.CF_ACCESS_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: 'Server config error: Missing Cloudflare Access credentials.' });
  }

  const url = 'https://das.portfoliodashboard.xyz/positions/exposure';

  try {
    // 2. Call the external API
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'CF-Access-Client-Id': clientId,
        'CF-Access-Client-Secret': clientSecret
      }
    });

    if (!response.ok) {
      throw new Error(`External API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // 3. Return the data to the frontend
    res.status(200).json(data);

  } catch (error) {
    console.error('Exposure fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch exposure data', details: error.message });
  }
}
