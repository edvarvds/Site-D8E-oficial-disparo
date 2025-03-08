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
    if (!secretKey) {
      console.error("[For4Payments] Chave da API não configurada!");
    }
  }

  private getHeaders(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.secretKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  }

  async create_pix_payment(data: PaymentData): Promise<PaymentResponse> {
    try {
      console.log("[For4Payments] Iniciando criação de pagamento PIX");

      if (!this.secretKey) {
        throw new Error("API de pagamento não configurada corretamente");
      }

      // Verificar se o valor já está em centavos ou precisa ser convertido
      let amountInCents: number;
      
      // Se o valor for > 1000, provavelmente já está em centavos ou é formatado (4.499,00)
      if (data.amount > 1000) {
        // Verifica se parece ser valor formatado com separador (4.499,00 -> 44.99)
        const amountStr = String(data.amount);
        if (amountStr.includes(".") || amountStr.includes(",")) {
          // Converter para formato padronizado (ponto como decimal)
          const normalized = amountStr.replace(".", "").replace(",", ".");
          // Converter para centavos
          amountInCents = Math.round(parseFloat(normalized) * 100);
        } else {
          // Já está em centavos
          amountInCents = Math.round(data.amount);
        }
      } else {
        // Valor normal, converte para centavos
        amountInCents = Math.round(data.amount * 100);
      }
      
      console.log("[For4Payments] Valor original:", data.amount);
      console.log("[For4Payments] Valor em centavos para API:", amountInCents);
      const cleanPhone = data.phone.replace(/\D/g, "");
      
      console.log("[For4Payments] Valor original:", data.amount);
      console.log("[For4Payments] Valor limpo para API:", amountInCents);

      if (!data.name || !data.email || !data.cpf || !data.phone) {
        console.error("[For4Payments] Campos obrigatórios faltando:", { data });
        throw new Error("Campos obrigatórios faltando");
      }

      const paymentData = {
        name: data.name,
        email: data.email,
        cpf: data.cpf.replace(/\D/g, ""),
        phone: cleanPhone,
        paymentMethod: "PIX",
        amount: amountInCents,
        items: [
          {
            title: "Curso Algoritmo Vencedor",
            quantity: 1,
            unitPrice: amountInCents,
            tangible: false,
          },
        ],
      };

      console.log(
        "[For4Payments] Enviando requisição:",
        JSON.stringify(paymentData, null, 2),
      );

      const response = await fetch(`${this.API_URL}/transaction.purchase`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(paymentData),
      });

      const responseText = await response.text();
      console.log("[For4Payments] Resposta bruta da API:", responseText);

      if (!response.ok) {
        console.error("[For4Payments] Erro na resposta:", {
          status: response.status,
          statusText: response.statusText,
          response: responseText,
        });
        throw new Error(
          `Erro na API de pagamento (${response.status}): ${response.statusText}`,
        );
      }

      const responseData = JSON.parse(responseText);
      console.log("[For4Payments] Resposta processada:", responseData);

      if (!responseData.pixCode) {
        throw new Error("API de pagamento retornou resposta inválida");
      }

      return {
        id: responseData.id,
        pixCode: responseData.pixCode,
        pixQrCode: responseData.pixQrCode,
        expiresAt: responseData.expiresAt,
        status: responseData.status || "pending",
      };
    } catch (error) {
      console.error("[For4Payments] Erro detalhado:", error);
      throw error;
    }
  }

  async check_payment_status(payment_id: string): Promise<{ status: string }> {
    try {
      console.log(
        "[For4Payments] Verificando status do pagamento:",
        payment_id,
      );

      const url = new URL(`${this.API_URL}/transaction.getPayment`);
      url.searchParams.append("id", payment_id);

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: this.getHeaders(),
      });

      const responseText = await response.text();
      console.log("[For4Payments] Resposta da verificação:", responseText);

      if (response.ok) {
        const payment_data = JSON.parse(responseText);

        const status_mapping: Record<string, string> = {
          PENDING: "pending",
          PROCESSING: "pending",
          APPROVED: "completed",
          COMPLETED: "completed",
          PAID: "completed",
          EXPIRED: "failed",
          FAILED: "failed",
          CANCELED: "cancelled",
          CANCELLED: "cancelled",
        };

        const current_status = payment_data.status || "PENDING";
        const mapped_status = status_mapping[current_status] || "pending";

        console.log("[For4Payments] Status mapeado:", {
          original: current_status,
          mapped: mapped_status,
        });

        return { status: mapped_status };
      } else {
        console.error("[For4Payments] Erro ao verificar status:", {
          status: response.status,
          statusText: response.statusText,
          response: responseText,
        });
        return { status: "pending" };
      }
    } catch (error) {
      console.error(
        "[For4Payments] Erro ao verificar status do pagamento:",
        error,
      );
      return { status: "pending" };
    }
  }
}

export function create_payment_api(): For4PaymentsAPI {
  const secret_key = process.env.FOR4PAYMENTS_SECRET_KEY || "";
  if (!secret_key) {
    console.warn(
      "[For4Payments] Atenção: FOR4PAYMENTS_SECRET_KEY não está definida!",
    );
  }
  return new For4PaymentsAPI(secret_key);
}
