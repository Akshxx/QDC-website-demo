import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────────────────
// SETUP (one-time):
//
// 1. Create a Google Sheet with these column headers in Row 1:
//    Timestamp | Name | Email | Phone | Reg Number | Year | Branch |
//    Event | Experience | LinkedIn | Why Join
//
// 2. Go to https://script.google.com → New Project → paste the Apps Script
//    from the comment at the bottom of this file → Deploy as Web App
//    (Execute as: Me, Access: Anyone) → copy the Web App URL
//
// 3. Add this to your .env.local:
//    GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_ID/exec
//
// That's it — no OAuth, no service accounts needed.
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      name,
      email,
      phone,
      regNumber,
      year,
      branch,
      event,
      experience,
      linkedin,
      whyJoin,
    } = body;

    // Basic validation
    if (!name || !email || !phone || !regNumber || !year || !branch || !event) {
      return NextResponse.json(
        { message: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

    if (!webhookUrl) {
      console.error("GOOGLE_SHEETS_WEBHOOK_URL is not set in .env.local");
      return NextResponse.json(
        { message: "Server configuration error. Please contact admin." },
        { status: 500 }
      );
    }

    // Send to Google Sheets via Apps Script Web App
    const payload = {
      timestamp: new Date().toISOString(),
      name,
      email,
      phone,
      regNumber,
      year,
      branch,
      event,
      experience: experience || "Not specified",
      linkedin: linkedin || "Not provided",
      whyJoin: whyJoin || "Not provided",
    };

    const sheetsRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!sheetsRes.ok) {
      throw new Error("Failed to write to Google Sheets");
    }

    return NextResponse.json({ message: "Registration successful!" }, { status: 200 });
  } catch (err) {
    console.error("Registration API error:", err);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// GOOGLE APPS SCRIPT (paste this at script.google.com)
//
// const SHEET_ID = "YOUR_GOOGLE_SHEET_ID"; // from the sheet URL
//
// function doPost(e) {
//   try {
//     const data = JSON.parse(e.postData.contents);
//     const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
//     sheet.appendRow([
//       data.timestamp,
//       data.name,
//       data.email,
//       data.phone,
//       data.regNumber,
//       data.year,
//       data.branch,
//       data.event,
//       data.experience,
//       data.linkedin,
//       data.whyJoin,
//     ]);
//     return ContentService
//       .createTextOutput(JSON.stringify({ status: "success" }))
//       .setMimeType(ContentService.MimeType.JSON);
//   } catch (err) {
//     return ContentService
//       .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
//       .setMimeType(ContentService.MimeType.JSON);
//   }
// }
// ─────────────────────────────────────────────────────────────────────────────
