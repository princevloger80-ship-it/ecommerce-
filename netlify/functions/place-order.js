
const admin = require("firebase-admin");

exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json; charset=utf-8"
  };

  const reply = (statusCode, data) => ({
    statusCode,
    headers,
    body: JSON.stringify(data)
  });

  if (event.httpMethod !== "POST") {
    return reply(405, {
      ok: false,
      message: "Only POST is allowed."
    });
  }

  try {
    // 1. Firebase Admin configuration
    const serviceAccountJson =
      process.env.FIREBASE_SERVICE_ACCOUNT;

    if (!serviceAccountJson) {
      return reply(500, {
        ok: false,
        message: "Order verification is not configured."
      });
    }

    if (!admin.apps.length) {
      const serviceAccount = JSON.parse(serviceAccountJson);

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    }

    // 2. Read the checkout request
    let order;

    try {
      order = JSON.parse(event.body || "");
    } catch {
      return reply(400, {
        ok: false,
        message: "Invalid order data."
      });
    }

    const phone = String(order?.customer?.phone || "")
      .replace(/\D/g, "");

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return reply(400, {
        ok: false,
        message: "Enter a valid 10-digit Indian mobile number."
      });
    }

    // 3. Verify Firebase ID token
    const authHeader =
      event.headers?.authorization ||
      event.headers?.Authorization ||
      "";

    const match = authHeader.match(/^Bearer\s+(.+)$/i);

    if (!match) {
      return reply(401, {
        ok: false,
        message: "Please verify your phone number first."
      });
    }

    let decodedToken;

    try {
      decodedToken = await admin.auth().verifyIdToken(match[1]);
    } catch {
      return reply(401, {
        ok: false,
        message: "Phone verification expired. Please verify again."
      });
    }

    const verifiedPhone = decodedToken.phone_number;

    if (verifiedPhone !== `+91${phone}`) {
      return reply(403, {
        ok: false,
        message: "Verified phone number does not match the order."
      });
    }

    // 4. Forward only verified orders to the existing order service
    const appsScriptUrl = process.env.ORDER_API_URL;

    if (!appsScriptUrl || !appsScriptUrl.endsWith("/exec")) {
      return reply(500, {
        ok: false,
        message: "Order endpoint is not configured."
      });
    }

    const upstream = await fetch(appsScriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: event.body || ""
    });

    const responseText = await upstream.text();
    let data;

    try {
      data = JSON.parse(responseText);
    } catch {
      return reply(502, {
        ok: false,
        message: "Order service returned an unreadable response."
      });
    }

    if (!upstream.ok || data.ok !== true) {
      return reply(502, {
        ok: false,
        message: data.message || "Order could not be confirmed."
      });
    }

    return reply(200, data);
  } catch {
    return reply(500, {
      ok: false,
      message: "Order verification service encountered an error."
    });
  }
};
