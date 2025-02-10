import { donations, type Donation, type InsertDonation } from "@shared/schema";

export interface IStorage {
  createDonation(donation: InsertDonation): Promise<Donation>;
  updateDonationStatus(id: number, status: string, paymentId?: string): Promise<Donation>;
  getDonation(id: number): Promise<Donation | undefined>;
}

export class MemStorage implements IStorage {
  private donations: Map<number, Donation>;
  private currentId: number;

  constructor() {
    this.donations = new Map();
    this.currentId = 1;
  }

  async createDonation(insertDonation: InsertDonation): Promise<Donation> {
    const id = this.currentId++;
    const donation: Donation = {
      ...insertDonation,
      id,
      status: "pending",
      paymentId: null,
      createdAt: new Date()
    };
    this.donations.set(id, donation);
    return donation;
  }

  async updateDonationStatus(id: number, status: string, paymentId?: string): Promise<Donation> {
    const donation = await this.getDonation(id);
    if (!donation) {
      throw new Error("Donation not found");
    }
    
    const updatedDonation = {
      ...donation,
      status,
      paymentId: paymentId || donation.paymentId
    };
    
    this.donations.set(id, updatedDonation);
    return updatedDonation;
  }

  async getDonation(id: number): Promise<Donation | undefined> {
    return this.donations.get(id);
  }
}

export const storage = new MemStorage();
