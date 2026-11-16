export async function onRequest(context) {
  const url = new URL(context.request.url);
  const factionId = url.searchParams.get('faction') || '55650';
  const selection = url.searchParams.get('selection') || 'members';
  const apiKey = url.searchParams.get('key');

  if (!apiKey) {
    return new Response(JSON.stringify({ error: { message: "API key missing" } }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const targetUrl = `https://api.torn.com/v2/faction/${factionId}/${selection}?key=${apiKey}`;
    const response = await fetch(targetUrl);
    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: { message: error.message } }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
