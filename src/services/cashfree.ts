// Cashfree Payment Gateway Integration Service (Live Production Ready)
// Reference: https://sdk.cashfree.com/js/v3/cashfree.js

declare global {
  interface Window {
    Cashfree?: (config: { mode: 'sandbox' | 'production' }) => {
      checkout: (options: {
        paymentSessionId: string;
        redirectTarget?: '_modal' | '_self' | '_blank';
      }) => Promise<{
        error?: any;
        redirect?: boolean;
        paymentDetails?: any;
      }>;
    };
  }
}

export interface CreateOrderParams {
  amount: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  orderNote?: string;
  returnUrl?: string;
}

export interface CashfreeOrderResponse {
  success: boolean;
  orderId?: string;
  paymentSessionId?: string;
  orderAmount?: number;
  orderCurrency?: string;
  environment?: 'sandbox' | 'production';
  message?: string;
}

/**
 * Ensures the Cashfree v3 JavaScript SDK is loaded and available on window.
 */
export async function loadCashfreeSDK(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  if (window.Cashfree) {
    return true;
  }

  return new Promise((resolve) => {
    const existingScript = document.querySelector('script[src*="cashfree.com/js/v3/cashfree.js"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(!!window.Cashfree));
      existingScript.addEventListener('error', () => resolve(false));
      if (window.Cashfree) return resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.async = true;
    script.onload = () => resolve(!!window.Cashfree);
    script.onerror = () => {
      console.error('Failed to load Cashfree SDK from CDN.');
      resolve(false);
    };
    document.head.appendChild(script);
  });
}

/**
 * Calls backend API route /api/create-cashfree-order to generate a secure live payment session
 */
export async function createCashfreeOrder(params: CreateOrderParams): Promise<CashfreeOrderResponse> {
  const res = await fetch('/api/create-cashfree-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Payment order creation failed. Please try again or use direct UPI QR.');
  }

  return data;
}

/**
 * Opens Cashfree Checkout Modal using Cashfree JS SDK v3.
 * Testing/Simulation is strictly disabled.
 */
export async function launchCashfreeCheckout(options: {
  paymentSessionId: string;
  orderId: string;
  environment?: 'sandbox' | 'production';
  onSuccess: (paymentResult: any) => void;
  onFailure: (error: any) => void;
  onDismiss?: () => void;
}) {
  const sdkLoaded = await loadCashfreeSDK();

  if (!sdkLoaded || typeof window.Cashfree !== 'function') {
    options.onFailure({
      message: 'Cashfree Payment Gateway SDK could not be loaded. Please check your internet connection or use UPI QR.'
    });
    return;
  }

  try {
    const cashfree = window.Cashfree({
      mode: options.environment === 'production' ? 'production' : 'sandbox'
    });

    const result = await cashfree.checkout({
      paymentSessionId: options.paymentSessionId,
      redirectTarget: '_modal'
    });

    if (result.error) {
      if (
        result.error.message?.toLowerCase().includes('closed') ||
        result.error.message?.toLowerCase().includes('cancelled') ||
        result.error.code === 'MODAL_CLOSED'
      ) {
        options.onDismiss?.();
      } else {
        options.onFailure(result.error);
      }
    } else if (result.paymentDetails) {
      options.onSuccess(result.paymentDetails);
    } else {
      // Check order status from server for verification
      try {
        const verifyRes = await fetch(`/api/verify-cashfree-order?orderId=${encodeURIComponent(options.orderId)}`);
        const verifyData = await verifyRes.json();
        if (verifyData.success && verifyData.orderStatus === 'PAID') {
          options.onSuccess(verifyData);
        } else {
          options.onFailure({ message: 'Payment verification failed. Payment was not completed.' });
        }
      } catch {
        options.onFailure({ message: 'Could not verify payment status with server.' });
      }
    }
  } catch (err: any) {
    console.error('Cashfree checkout modal error:', err);
    options.onFailure({ message: err?.message || 'Payment was cancelled or could not be completed.' });
  }
}
