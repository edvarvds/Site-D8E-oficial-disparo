import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const donations = pgTable("donations", {
  id: serial("id").primaryKey(),
  amount: integer("amount").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  cpf: text("cpf").notNull(),
  phone: text("phone").notNull(),
  paymentId: text("payment_id"),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertDonationSchema = createInsertSchema(donations).omit({
  id: true,
  paymentId: true,
  status: true,
  createdAt: true,
}).extend({
  amount: z.number().int().min(1), // Garante que o valor é um número inteiro
  name: z.string().min(3),
  email: z.string().email(),
  cpf: z.string().min(11).max(14),
  phone: z.string().min(10).max(15)
});

export type InsertDonation = z.infer<typeof insertDonationSchema>;
export type Donation = typeof donations.$inferSelect;