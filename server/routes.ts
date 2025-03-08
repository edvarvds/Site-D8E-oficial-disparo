import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDonationSchema } from "@shared/schema";
import { create_payment_api } from "@shared/for4payments";
import { create_sms_api } from "./smsdev";

const paymentApi = create_payment_api();
const smsApi = create_sms_api();

export function registerRoutes(app: Express): Server {
  app.post("/api/donations", async (req, res) => {
    try {
      console.log("[API] Iniciando criação de doação:", req.body);

      const donationData = insertDonationSchema.parse(req.body);
      console.log("[API] Dados validados com sucesso");

      // Garantir que amount seja um número inteiro antes de salvar no banco
      const amountStr = String(donationData.amount);
      const cleanAmount = parseInt(amountStr.replace(/\D/g, ""));
      console.log("[API] Amount original:", donationData.amount);
      console.log("[API] Amount limpo para salvar no banco:", cleanAmount);
      
      // Atualizar o valor com o valor limpo
      const cleanedDonationData = {
        ...donationData,
        amount: cleanAmount
      };

      const donation = await storage.createDonation(cleanedDonationData);
      console.log("[API] Doação criada no banco:", donation);

      console.log("[API] Iniciando criação do pagamento PIX");
      const paymentResponse = await paymentApi.create_pix_payment({
        amount: donationData.amount,
        name: donationData.name,
        email: donationData.email,
        cpf: donationData.cpf,
        phone: donationData.phone
      });
      console.log("[API] Resposta do pagamento PIX:", paymentResponse);

      await storage.updateDonationStatus(donation.id, "pending", paymentResponse.id);
      console.log("[API] Status da doação atualizado para pending");

      // Enviar SMS imediatamente após gerar o PIX
      console.log("[API] Enviando SMS de agradecimento");
      const smsSent = await smsApi.sendSMS(donationData.phone, donationData.name);
      if (!smsSent) {
        console.warn("[API] Não foi possível enviar o SMS, mas a doação foi criada com sucesso");
      }

      res.json({
        donationId: donation.id,
        pixCode: paymentResponse.pixCode,
        pixQrCode: paymentResponse.pixQrCode,
        expiresAt: paymentResponse.expiresAt
      });
    } catch (error) {
      console.error("[API] Erro ao criar doação:", error);

      // Tratamento específico de erros
      if (error instanceof Error) {
        if (error.message.includes("Campos obrigatórios")) {
          return res.status(400).json({ 
            message: "Por favor, preencha todos os campos obrigatórios."
          });
        } else if (error.message.includes("API de pagamento")) {
          return res.status(503).json({ 
            message: "Serviço de pagamento temporariamente indisponível. Tente novamente em alguns minutos."
          });
        }
      }

      res.status(400).json({ 
        message: "Não foi possível processar sua doação. Por favor, tente novamente."
      });
    }
  });

  app.get("/api/donations/:id/status", async (req, res) => {
    try {
      console.log("[API] Verificando status da doação:", req.params.id);

      const donation = await storage.getDonation(Number(req.params.id));
      if (!donation || !donation.paymentId) {
        console.log("[API] Doação não encontrada ou sem paymentId");
        return res.status(404).json({ message: "Doação não encontrada" });
      }

      console.log("[API] Consultando status do pagamento:", donation.paymentId);
      const status = await paymentApi.check_payment_status(donation.paymentId);
      console.log("[API] Status retornado:", status);

      if (status.status !== donation.status) {
        console.log("[API] Atualizando status da doação para:", status.status);
        await storage.updateDonationStatus(donation.id, status.status);
      }

      res.json({ status: status.status });
    } catch (error) {
      console.error("[API] Erro ao verificar status da doação:", error);
      res.status(500).json({ 
        message: "Não foi possível verificar o status da doação."
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}