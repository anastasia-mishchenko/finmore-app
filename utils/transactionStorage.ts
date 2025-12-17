import { Page } from "@playwright/test";

export type TransactionRecord = {
  type: "expense" | "income";
  amount: number;
  category: string;
  description: string;
  date: string;
  account: string;
  tags: unknown[];
  id: string;
};

export type TransactionSeed = {
  amount: string;
  category: string;
  description: string;
  date: string;
  account: string;
  type?: "expense" | "income";
  tags?: unknown[];
};

/**
 * Build a transaction record from simple seed data and a runtime id.
 */
export function buildTransactionFromSeed(
  seedId: string,
  seed: TransactionSeed
): TransactionRecord {
  return {
    type: seed.type ?? "expense",
    amount: Number(seed.amount),
    category: seed.category,
    description: seed.description,
    date: seed.date,
    account: seed.account,
    tags: seed.tags ?? [],
    id: seedId
  };
}

/**
 * Seed localStorage with provided transactions for a user.
 */
export async function seedTransactions(
  page: Page,
  userId: string,
  transactions: TransactionRecord[]
) {
  const key = `transactions_${userId}`;
  await page.evaluate(
    ({ k, v }) => localStorage.setItem(k, JSON.stringify(v)),
    { k: key, v: transactions }
  );
  return key;
}
