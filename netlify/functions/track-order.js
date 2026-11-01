
exports.handler = async function (event) {
  const headers = {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "https://mewaveda.netlify.app",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };

  function response(statusCode, data) {
    return {
      statusCode: statusCode,
      headers: headers,
      body: JSON.stringify(data)
    };
  }

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: headers,
      body: ""
    };
  }

  if (event.httpMethod !== "POST") {
    return response(405, {
      ok: false,
      message: "Method not allowed."
    });
  }

  try {
    const apiUrl = process.env.ORDER_API_URL;
    const secret = process.env.TRACKING_SECRET;

    if (!apiUrl || !secret) {
      return response(500, {
        ok: false,
        message: "Tracking service is not configured."
      });
    }

    let input;

    try {
      input = JSON.parse(event.body || "{}");
    } catch (error) {
      return response(400, {
        ok: false,
        message: "Invalid request."
      });
    }

    const orderId = String(input.orderId || "").trim();
    const phone = String(input.phone || "").replace(/\D/g, "");

    if (
      orderId.length < 5 ||
      orderId.length > 60 ||
      phone.length !== 10
    ) {
      return response(400, {
        ok: false,
        message: "Please enter a valid Order ID and mobile number."
      });
    }

    const apiResponse = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify({
        action: "track",
        orderId: orderId,
        phone: phone,
        secret: secret
      }),
      redirect: "follow"
    });

    if (!apiResponse.ok) {
      return response(502, {
        ok: false,
        message: "Tracking service is temporarily unavailable."
      });
    }

    const result = await apiResponse.json();

    if (!result.ok) {
      return response(404, {
        ok: false,
        message: result.message || "Order not found."
      });
    }

    // Return only the minimum information needed by the customer.
    return response(200, {
      ok: true,
      orderId: result.orderId,
      status: result.status
    });

  } catch (error) {
    return response(500, {
      ok: false,
      message: "Unable to track order right now. Please try again."
    });
  }
};
