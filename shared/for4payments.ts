interface PaymentResponse {
  id: string;
  pixCode: string;
  pixQrCode: string;
  expiresAt: string;
  status: string;
}

interface PaymentData {
  amount: number;
  name: string;
  email: string;
  cpf: string;
  phone: string;
}

export class For4PaymentsAPI {
  private API_URL = "https://app.for4payments.com.br/api/v1";
  private secretKey: string;

  constructor(secretKey: string) {
    this.secretKey = secretKey;
  }

  private getHeaders(): Record<string, string> {
    return {
      'Authorization': this.secretKey,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  async create_pix_payment(data: PaymentData): Promise<PaymentResponse> {
    try {
      const amountInCents = Math.round(data.amount * 100);
      const cleanPhone = data.phone.replace(/\D/g, '');

      if (!data.name || !data.email || !data.cpf || !data.phone) {
        console.error("[For4Payments] Missing required fields:", { data });
        throw new Error("Campos obrigatórios faltando");
      }

      const paymentData = {
        name: data.name,
        email: data.email,
        cpf: data.cpf.replace(/\D/g, ''),
        phone: cleanPhone,
        paymentMethod: "PIX",
        amount: amountInCents,
        items: [{
          title: "Curso Algoritmo Vencedor",
          quantity: 1,
          unitPrice: amountInCents,
          tangible: false
        }]
      };

      console.log("[For4Payments] Sending payment request:", JSON.stringify(paymentData, null, 2));

      const response = await fetch(`${this.API_URL}/transaction.purchase`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("[For4Payments] Error response:", errorText);
        throw new Error(`Erro na API de pagamento (${response.status}): ${response.statusText}`);
      }

      const responseData = await response.json();
      return {
        id: responseData.id,
        pixCode: responseData.pixCode,
        pixQrCode: responseData.pixQrCode,
        expiresAt: responseData.expiresAt,
        status: responseData.status || 'pending'
      };
    } catch (error) {
      console.error("[For4Payments] Error:", error);
      throw error;
    }
  }

  async check_payment_status(payment_id: string): Promise<{ status: string }> {
    try {
      const url = new URL(`${this.API_URL}/transaction.getPayment`);
      url.searchParams.append('id', payment_id);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (response.ok) {
        const payment_data = await response.json();

        const status_mapping: Record<string, string> = {
          'PENDING': 'pending',
          'PROCESSING': 'pending',
          'APPROVED': 'completed',
          'COMPLETED': 'completed',
          'PAID': 'completed',
          'EXPIRED': 'failed',
          'FAILED': 'failed',
          'CANCELED': 'cancelled',
          'CANCELLED': 'cancelled'
        };

        const current_status = payment_data.status || 'PENDING';
        return { status: status_mapping[current_status] || 'pending' };
      } else {
        console.error("[For4Payments] Error checking status:", response.statusText);
        return { status: 'pending' };
      }
    } catch (error) {
      console.error("[For4Payments] Error checking payment status:", error);
      return { status: 'pending' };
    }
  }
}

export function create_payment_api(): For4PaymentsAPI {
  const secret_key = process.env.FOR4PAYMENTS_SECRET_KEY || "";
  return new For4PaymentsAPI(secret_key);
}