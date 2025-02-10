import { donations, type Donation, type InsertDonation } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  createDonation(donation: InsertDonation): Promise<Donation>;
  updateDonationStatus(id: number, status: string, paymentId?: string): Promise<Donation>;
  getDonation(id: number): Promise<Donation | undefined>;
}

export class DatabaseStorage implements IStorage {
  async createDonation(insertDonation: InsertDonation): Promise<Donation> {
    const [donation] = await db
      .insert(donations)
      .values(insertDonation)
      .returning();
    return donation;
  }

  async updateDonationStatus(id: number, status: string, paymentId?: string): Promise<Donation> {
    const [donation] = await db
      .update(donations)
      .set({ status, paymentId })
      .where(eq(donations.id, id))
      .returning();

    if (!donation) {
      throw new Error("Donation not found");
    }

    return donation;
  }

  async getDonation(id: number): Promise<Donation | undefined> {
    const [donation] = await db
      .select()
      .from(donations)
      .where(eq(donations.id, id));
    return donation;
  }
}

export const storage = new DatabaseStorage();