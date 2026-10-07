import type { VercelRequest, VercelResponse } from '@vercel/node';

function sendJson(res: VercelResponse, statusCode: number, data: any) {
  if (typeof res.status === 'function') {
    return res.status(statusCode).json(data);
  }
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  return res.end(JSON.stringify(data));
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
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

  if (req.method !== 'POST') {
    return sendJson(res, 405, { success: false, message: 'Method Not Allowed' });
  }

  try {
    const {
      amount = 49,
      customerName = 'NestFinder Member',
      customerPhone = '9876543210',
      customerEmail,
      orderNote = 'NestFinder 30-Day Tenant Pass Unlock',
      returnUrl
    } = req.body || {};

    const appId = process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    const environment = process.env.CASHFREE_ENVIRONMENT || 'sandbox';

    if (!appId || !secretKey) {
      console.warn('CASHFREE_APP_ID or CASHFREE_SECRET_KEY not set in live environment.');
      return sendJson(res, 503, {
        success: false,
        message: 'Cashfree payment gateway credentials are not yet configured.'
      });
    }

    const cleanPhone = String(customerPhone).replace(/\D/g, '') || '9876543210';
    const orderId = `nf_ord_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const customerId = `cust_${cleanPhone}_${Date.now().toString().slice(-4)}`;
    const email = customerEmail || `${cleanPhone}@nestfinder.in`;

    const baseUrl =
      environment.toLowerCase() === 'production'
        ? 'https://api.cashfree.com/pg'
        : 'https://sandbox.cashfree.com/pg';

    const orderPayload = {
      order_id: orderId,
      order_amount: Number(amount),
      order_currency: 'INR',
      customer_details: {
        customer_id: customerId,
        customer_name: customerName,
        customer_phone: cleanPhone.length === 10 ? cleanPhone : '9876543210',
        customer_email: email
      },
      order_meta: {
        return_url: returnUrl || `https://nestfinder.in/?order_id=${orderId}`,
        payment_methods: 'upi,cc,dc,nb'
      },
      order_note: orderNote
    };

    // --- Logging before fetch request ---
    console.log('--- CASHFREE ORDER API DEBUG ---');
    console.log('Environment:', environment);
    console.log('Target URL:', `${baseUrl}/orders`);
    console.log('App ID Length:', appId ? appId.length : 0);
    console.log('Secret Key Length:', secretKey ? secretKey.length : 0);

    const response = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-version': '2023-08-01',
        'x-client-id': appId.trim(),
        'x-client-secret': secretKey.trim()
      },
      body: JSON.stringify(orderPayload)
    });

    const data = await response.json();
    
    // --- Logging response status and data ---
    console.log('Cashfree Response Status:', response.status);
    console.log('Cashfree Response Data:', data);

    if (!response.ok) {
      console.error('Cashfree API Order Creation Error:', data);
      return sendJson(res, response.status, {
        success: false,
        message: data.message || 'Failed to create Cashfree order',
        error: data
      });
    }

    return sendJson(res, 200, {
      success: true,
      orderId: data.order_id,
      paymentSessionId: data.payment_session_id,
      orderStatus: data.order_status,
      orderAmount: data.order_amount,
      orderCurrency: data.order_currency,
      environment
    });
  } catch (error: any) {
    console.error('Internal Error creating Cashfree order:', error);
    return sendJson(res, 500, {
      success: false,
      message: error?.message || 'Internal Server Error'
    });
  }
}
