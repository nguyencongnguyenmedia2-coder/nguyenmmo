/**
 * SMM Panel Third-Party API Provider Integration Service
 * Standard SMM Panel API v2 Protocol Abstraction
 */

export interface SMMAddOrderParams {
  apiUrl: string;
  apiKey: string;
  serviceId: string;
  link: string;
  quantity: number;
  runs?: number;
  interval?: number;
}

export interface SMMAddOrderResult {
  success: boolean;
  orderId?: string;
  error?: string;
}

export interface SMMOrderStatusResult {
  success: boolean;
  status?: 'Pending' | 'Processing' | 'InProgress' | 'Completed' | 'Partial' | 'Canceled';
  charge?: string;
  start_count?: number;
  remains?: number;
  currency?: string;
  error?: string;
}

export interface SMMBalanceResult {
  success: boolean;
  balance?: number;
  currency?: string;
  error?: string;
}

export class SMMProviderClient {
  /**
   * Submit new order to 3rd Party SMM Panel Provider API
   */
  static async addOrder(params: SMMAddOrderParams): Promise<SMMAddOrderResult> {
    if (!params.apiUrl || !params.apiKey) {
      // Demo simulation mode when API credentials are not set
      console.log('[SMM API Simulation] Sending order:', params);
      return {
        success: true,
        orderId: `SMM_API_${Math.floor(100000 + Math.random() * 900000)}`,
      };
    }

    try {
      const formData = new URLSearchParams({
        key: params.apiKey,
        action: 'add',
        service: params.serviceId,
        link: params.link,
        quantity: params.quantity.toString(),
      });

      const response = await fetch(params.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });

      const data = await response.json();

      if (data.order) {
        return {
          success: true,
          orderId: data.order.toString(),
        };
      }

      return {
        success: false,
        error: data.error || 'Unknown SMM provider error',
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Failed to connect to SMM API provider',
      };
    }
  }

  /**
   * Get status of an existing order from 3rd Party SMM Panel
   */
  static async getOrderStatus(apiUrl: string, apiKey: string, orderId: string): Promise<SMMOrderStatusResult> {
    if (!apiUrl || !apiKey || orderId.startsWith('SMM_API_')) {
      // Demo simulation status response
      return {
        success: true,
        status: 'Processing',
        start_count: 100,
        remains: 0,
        currency: 'VND',
      };
    }

    try {
      const formData = new URLSearchParams({
        key: apiKey,
        action: 'status',
        order: orderId,
      });

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });

      const data = await response.json();

      if (data.status) {
        return {
          success: true,
          status: data.status,
          charge: data.charge,
          start_count: Number(data.start_count || 0),
          remains: Number(data.remains || 0),
          currency: data.currency || 'USD',
        };
      }

      return {
        success: false,
        error: data.error || 'Failed to retrieve order status',
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Failed to query provider API',
      };
    }
  }

  /**
   * Fetch Account Balance from SMM Panel API Provider
   */
  static async getBalance(apiUrl: string, apiKey: string): Promise<SMMBalanceResult> {
    if (!apiUrl || !apiKey) {
      return {
        success: true,
        balance: 15450000,
        currency: 'VND',
      };
    }

    try {
      const formData = new URLSearchParams({
        key: apiKey,
        action: 'balance',
      });

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });

      const data = await response.json();

      if (data.balance !== undefined) {
        return {
          success: true,
          balance: Number(data.balance),
          currency: data.currency || 'USD',
        };
      }

      return {
        success: false,
        error: data.error || 'Failed to retrieve balance',
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Connection error',
      };
    }
  }
}
