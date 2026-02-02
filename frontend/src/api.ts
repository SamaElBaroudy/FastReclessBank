export type UUID = string;

export type Account = {
  id: UUID;
  balance: string; // backend returns BigDecimal often as string/number;
};

export type OutgoingTransfer = {
  toAccountId: UUID;
  amount: string | number;
  timestamp: string;
}; 

export type AccountDetailsResponse = {
  id: UUID;
  balance: string | number;
  lastOutgoingTransfers: OutgoingTransfer[];
}; 


const base = "/accounts";

export async function createAccount(): Promise<Account> {
  const res = await fetch(`${base}`, { method: "POST" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function listAccounts(): Promise<Account[]> {
  const res = await fetch(`${base}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deposit(accountId: UUID, amount: number): Promise<void> {
  const res = await fetch(`${base}/${accountId}/deposit?amount=${amount}`, { method: "POST" });
  if (!res.ok) throw new Error(await res.text());
}

export async function withdraw(accountId: UUID, amount: number): Promise<void> {
  const res = await fetch(`${base}/${accountId}/withdraw?amount=${amount}`, { method: "POST" });
  if (!res.ok) throw new Error(await res.text());
}

export async function transfer(fromAccountId: UUID, toAccountId: UUID, amount: number): Promise<void> {
  const res = await fetch(`${base}/transfer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fromAccountId, toAccountId, amount }),
  });
  if (!res.ok) throw new Error(await res.text());
}


export async function getAccountDetails(accountId: UUID): Promise<AccountDetailsResponse>{
  const res = await fetch(`${base}/${accountId}`); 
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}