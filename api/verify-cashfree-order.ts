// Vercel Serverless Function & Node.js API Handler: Verify Cashfree Order
// Endpoint: GET /api/verify-cashfree-order?orderId=... or POST

function sendJson(res: any, statusCode: number, data: any) {
  if (typeof res.status === 'function') {
    return res.status(statusCode).json(data);
  }
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  return res.end(JSON.stringify(data));
}

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    if (typeof res.status === 'function') {
      return res.status(200).end();
    }
    res.statusCode = 200;
    return res.end();
  }

  try {
    const orderId =
      req.query?.orderId ||
      req.body?.orderId ||
      (req.url && new URL(req.url, 'http://localhost').searchParams.get('orderId'));

    if (!orderId) {
      return sendJson(res, 400, { success: false, message: 'Missing orderId parameter' });
    }

    const appId = process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    const environment = process.env.CASHFREE_ENVIRONMENT || 'sandbox';

    // If credentials are not configured, reject fake verification
    if (!appId || !secretKey) {
      return sendJson(res, 503, {
        success: false,
        message: 'Payment credentials are not configured for verification.'
      });
    }

    if (String(orderId).includes('mock') || String(orderId).includes('simulated')) {
      return sendJson(res, 400, {
        success: false,
        message: 'Invalid or simulated order ID rejected in live mode.'
      });
    }

    const baseUrl =
      environment.toLowerCase() === 'production'
        ? 'https://api.cashfree.com/pg'
        : 'https://sandbox.cashfree.com/pg';

    const response = await fetch(`${baseUrl}/orders/${encodeURIComponent(orderId)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-version': '2023-08-01',
        'x-client-id': appId.trim(),
        'x-client-secret': secretKey.trim()
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return sendJson(res, response.status, {
        success: false,
        message: data.message || 'Failed to fetch Cashfree order status',
        error: data
      });
    }

    return sendJson(res, 200, {
      success: true,
      orderId: data.order_id,
      orderStatus: data.order_status,
      orderAmount: data.order_amount,
      orderCurrency: data.order_currency,
      paymentDetails: data
    });
  } catch (error: any) {
    console.error('Error verifying Cashfree order:', error);
    return sendJson(res, 500, {
      success: false,
      message: error?.message || 'Internal Server Error'
    });
  }
}
