
/**
 * Simple SHA-256 implementation using Web Crypto API.
 */
export async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Generates the hash for an entry based on its content and the previous hash.
 */
export async function generateEntryHash(
  id: number,
  entity: string,
  amount: number,
  purpose: string,
  timestamp: string,
  previousHash: string
): Promise<string> {
  const data = `${id}|${entity}|${amount}|${purpose}|${timestamp}|${previousHash}`;
  return await sha256(data);
}
