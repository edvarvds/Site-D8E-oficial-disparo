interface SMSResponse {
  situacao: string;
  codigo: string;
  id: string;
  descricao: string;
}

export class SMSDevAPI {
  private API_KEY = "V9EOABBNYBP07A1S5ZR2PHQ88SEU09831F1JIJPKLAS7FNVTBVGM8GD31SIBKJQ0RQKPTQCRAJA45L2JNUG9QL638JU23FKD1CX9E8KLEQRD2FNPMZKA5X4ZAESW6X4B";
  private API_URL = "https://api.smsdev.com.br/v1/send";

  async sendSMS(phoneNumber: string, name: string): Promise<boolean> {
    try {
      console.log("[SMSDev] Iniciando envio de SMS para:", phoneNumber);

      // Remove any non-numeric characters from phone
      const cleanPhone = phoneNumber.replace(/\D/g, '');

      // Format message with customer name
      const message = encodeURIComponent(
        `[Mensagem de Francivaldo] ${name}, voce e um anjo que Deus enviou a minha vida. Gratidao eterna pela sua ajuda. Vou conseguir ajudar minha familia Gracas a Deus`
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
