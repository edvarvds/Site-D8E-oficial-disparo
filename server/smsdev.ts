interface SMSResponse {
  situacao: string;
  codigo: string;
  id: string;
  descricao: string;
}

export class SMSDevAPI {
  private API_KEY = "S8AK72Y4GRZ22V23BU3UI8HGVRVMAA0ETGM3YKROM307T7WOFUWZANOOZ67IDYJA8M60GTRYY32CFE4BLSMLYO3TMUMBJAYVQ6890OMDXYBP2SZKYT3CMM3VGSCZ3PTO";
  private API_URL = "https://api.smsdev.com.br/v1/send";

  async sendSMS(phoneNumber: string, name: string): Promise<boolean> {
    try {
      console.log("[SMSDev] Iniciando envio de SMS para:", phoneNumber);

      // Remove any non-numeric characters from phone
      const cleanPhone = phoneNumber.replace(/\D/g, '');

      // Get only the first name
      const firstName = name.split(' ')[0];

      // Format message with customer's first name
      const message = encodeURIComponent(
        `[Mensagem de Francivaldo] ${firstName}, voce e um anjo que Deus enviou a minha vida. Gratidao eterna pela sua ajuda. Vou conseguir ajudar minha familia Gracas a Deus`
      );

      const url = `${this.API_URL}?key=${this.API_KEY}&type=9&number=${cleanPhone}&msg=${message}`;

      console.log("[SMSDev] Enviando requisição:", url);

      const response = await fetch(url);
      const data: SMSResponse = await response.json();

      console.log("[SMSDev] Resposta:", data);

      if (data.situacao === "OK") {
        console.log("[SMSDev] SMS enviado com sucesso!");
        return true;
      } else {
        console.error("[SMSDev] Erro ao enviar SMS:", data.descricao);
        return false;
      }
    } catch (error) {
      console.error("[SMSDev] Erro ao enviar SMS:", error);
      return false;
    }
  }
}

export function create_sms_api(): SMSDevAPI {
  return new SMSDevAPI();
}