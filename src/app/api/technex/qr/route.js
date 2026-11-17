import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { getTechnexConfig } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Dynamic UPI QR Code generator for TECHNEX 2K26.
 * Encodes the exact payable registration fee (₹49 or ₹99) and payee details
 * into a standard NPCI UPI URI so scanning in GPay, PhonePe, Paytm, or any UPI app
 * immediately displays the pre-filled amount.
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const amountParam = searchParams.get("amount");
    const tierParam = searchParams.get("tier");

    const config = await getTechnexConfig();
    const upiId = config.upiId || process.env.NEXT_PUBLIC_UPI_ID || "9172106568@airtel";
    const payeeName = config.upiPayeeName || "S4DS MITAOE";
    const note = `TECHNEX 2K26${tierParam ? ` - ${tierParam}` : " Registration"}`;

    // Determine numeric fee
    let fee = 49;
    if (amountParam && !isNaN(Number(amountParam))) {
      fee = Number(amountParam);
    } else {
      const defaultTier = config.membershipTiers?.[0];
      if (defaultTier && defaultTier.fee) {
        fee = Number(defaultTier.fee);
      }
    }

    // Standard NPCI UPI URI with amount encoded
    // Format: upi://pay?pa=VPA&pn=NAME&am=AMOUNT&cu=INR&tn=NOTE
    const formattedAmount = fee.toFixed(2);
    const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${formattedAmount}&cu=INR&tn=${encodeURIComponent(note)}`;

    // Generate crisp QR code buffer
    const qrBuffer = await QRCode.toBuffer(upiUri, {
      type: "png",
      width: 400,
      margin: 2,
      errorCorrectionLevel: "M",
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });

    return new Response(qrBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
        "X-UPI-Amount": formattedAmount,
        "X-UPI-ID": upiId,
      },
    });
  } catch (err) {
    console.error("GET /api/technex/qr error:", err);
    return NextResponse.json({ error: "Failed to generate dynamic UPI QR code" }, { status: 500 });
  }
}
