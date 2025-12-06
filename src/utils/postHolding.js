import { getAuthToken } from "./auth.js";

/**
 * Kirim transaksi holding ke API.
 * Mengemas ulang payload agar sesuai dengan format backend.
 */
export async function postHolding(data, type, cookies, request) {
  try {
    const apiUrl = import.meta.env.API_URL;
    const cookieHeader = request.headers.get("cookie") || "";
    const token = getAuthToken(cookies);

    const payload = {
      ...(data?.brokerName ? { brokerName: data.brokerName.toString() } : {}),
      ...(data?.stockCode ? { stockCode: data.stockCode.toString().toUpperCase() } : {}),
      ...(data?.price !== undefined ? { price: Number(data.price) } : {}),
      ...(data?.quantity !== undefined ? { quantity: Number(data.quantity) } : {}),
      ...(data?.cashBalance !== undefined ? { cashBalance: Number(data.cashBalance) } : {}),
    };

    const response = await fetch(`${apiUrl}/broker/holding/${type}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const responseData = await response.json();

    return { success: true, data: responseData };
  } catch (error) {
    console.error("Transaction error:", error);
    return false;
  }
}
