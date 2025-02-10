import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDonationSchema } from "@shared/schema";
import { For4PaymentsAPI } from "./for4payments";

const paymentApi = new For4PaymentsAPI(process.env.FOR4PAYMENTS_SECRET_KEY || "");

export function registerRoutes(app: Express): Server {
  app.post("/api/donations", async (req, res) => {
    try {
      const donationData = insertDonationSchema.parse(req.body);
      const donation = await storage.createDonation(donationData);

      const paymentResponse = await paymentApi.create_pix_payment({
        amount: donationData.amount,
        name: donationData.name,
        email: donationData.email,
        cpf: donationData.cpf,
        phone: donationData.phone
      });

      await storage.updateDonationStatus(donation.id, "pending", paymentResponse.id);

      res.json({
        donationId: donation.id,
        pixCode: paymentResponse.pixCode,
        pixQrCode: paymentResponse.pixQrCode,
        expiresAt: paymentResponse.expiresAt
      });
    } catch (error) {
      console.error("Error creating donation:", error);
      res.status(400).json({ message: "Failed to create donation" });
    }
  });

  app.get("/api/donations/:id/status", async (req, res) => {
    try {
      const donation = await storage.getDonation(Number(req.params.id));
      if (!donation || !donation.paymentId) {
        return res.status(404).json({ message: "Donation not found" });
      }

      const status = await paymentApi.check_payment_status(donation.paymentId);
      if (status.status !== donation.status) {
        await storage.updateDonationStatus(donation.id, status.status);
      }

      res.json({ status: status.status });
    } catch (error) {
      console.error("Error checking donation status:", error);
      res.status(500).json({ message: "Failed to check donation status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
