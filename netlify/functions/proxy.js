export async function handler(event) {
  const factionId = event.queryStringParameters.faction || '55650';
  const selection = event.queryStringParameters.selection || 'members';
  const apiKey = event.queryStringParameters.key;

  if (!apiKey) {
    return { statusCode: 400, body: JSON.stringify({ error: { message: "API key missing" } }) };
  }

  try {
    // Map selections to correct Torn API v2 endpoints
    let endpoint = selection;
    if (selection === 'attacks') {
      endpoint = 'attacks';
    } else if (selection === 'wars') {
      endpoint = 'wars';
    }

    const targetUrl = `https://api.torn.com/v2/faction/${factionId}/${endpoint}?key=${apiKey}`;
    const response = await fetch(targetUrl);
    const data = await response.json();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: { message: error.message } })
    };
  }
}
