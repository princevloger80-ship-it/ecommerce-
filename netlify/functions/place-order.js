
exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json; charset=utf-8"
  };

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        ok: false,
        message: "Only POST is allowed."
      })
    };
  }

  const appsScriptUrl = process.env.ORDER_API_URL;

  if (!appsScriptUrl || !appsScriptUrl.endsWith("/exec")) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        ok: false,
        message: "Order endpoint is not configured."
      })
    };
  }

  try {
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
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({
          ok: false,
          message: "Order service returned an unreadable response."
        })
      };
    }

    if (!upstream.ok || data.ok !== true) {
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({
          ok: false,
          message: data.message || "Order could not be confirmed."
        })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    };
  } catch {
    return {
      statusCode: 502,
      headers,
      body: JSON.stringify({
        ok: false,
        message: "Could not reach the order service."
      })
    };
  }
};
