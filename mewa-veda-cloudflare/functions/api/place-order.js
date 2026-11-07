const headers = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers });
}

export async function onRequestPost({ request, env }) {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  };

  const reply = (statusCode, data) => new Response(JSON.stringify(data), { status: statusCode, headers });



  try {
    const rawBody = await request.text();
    if (!rawBody || rawBody.length > 20000) {
      return reply(400, {
        ok: false,
        message: "Order data is missing or too large."
      });
    }

    let order;
    try {
      order = JSON.parse(rawBody);
    } catch {
      return reply(400, {
        ok: false,
        message: "Invalid order data."
      });
    }

    // Basic bot trap
    if (String(order.website || "").trim() !== "") {
      return reply(400, {
        ok: false,
        message: "Invalid order request."
      });
    }

    const customer = order.customer || {};
    const name = String(customer.name || "").trim();
    const phone = String(customer.phone || "").replace(/\D/g, "");
    const address = String(customer.address || "").trim();
    const city = String(customer.city || "").trim();
    const pin = String(customer.pin || "").trim();

    const email = String(customer.email || "").trim();
    const emailNotifications = customer.emailNotifications === true;

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return reply(400, {
        ok: false,
        message: "Please enter a valid email address."
      });
    }

    if (emailNotifications && !email) {
      return reply(400, {
        ok: false,
        message: "Enter your email address to receive order updates."
      });
    }

    if (name.length < 2 || name.length > 100) {
      return reply(400, {
        ok: false,
        message: "Please enter a valid customer name."
      });
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return reply(400, {
        ok: false,
        message: "Enter a valid 10-digit Indian mobile number."
      });
    }

    if (address.length < 8 || address.length > 500) {
      return reply(400, {
        ok: false,
        message: "Please enter a complete delivery address."
      });
    }

    if (city.length < 2 || city.length > 100) {
      return reply(400, {
        ok: false,
        message: "Please enter a valid city or delivery area."
      });
    }

    if (!/^\d{6}$/.test(pin)) {
      return reply(400, {
        ok: false,
        message: "Enter a valid 6-digit PIN code."
      });
    }

    if (order.paymentMethod !== "COD") {
      return reply(400, {
        ok: false,
        message: "Only Cash on Delivery is available."
      });
    }

    if (
      !Array.isArray(order.items) ||
      order.items.length < 1 ||
      order.items.length > 20
    ) {
      return reply(400, {
        ok: false,
        message: "Your cart is empty or contains too many items."
      });
    }

    // Recalculate all prices on the server; never trust browser totals.
    const verifiedItems = [];
    let subtotal = 0;

    for (const item of order.items) {
      const id = String(item.id || "");
      const product = PRODUCTS[id];
      const qty = Number(item.qty);

      if (!product) {
        return reply(400, {
          ok: false,
          message: "One of the selected products is unavailable. Please refresh the website."
        });
      }

      if (!Number.isInteger(qty) || qty < 1 || qty > 20) {
        return reply(400, {
          ok: false,
          message: "Invalid product quantity."
        });
      }

      const lineTotal = product.price * qty;
      subtotal += lineTotal;

      verifiedItems.push({
        id,
        name: product.name,
        qty,
        unitPrice: product.price,
        lineTotal
      });
    }

    const deliveryCharge =
      subtotal >= FREE_DELIVERY_MINIMUM ? 0 : DELIVERY_CHARGE;
    const total = subtotal + deliveryCharge;

    const verifiedOrder = {
      customer: {
        name,
        phone,
        address,
        city,
        pin,
        email,
        emailNotifications
      },
      paymentMethod: "COD",
      items: verifiedItems,
      subtotal,
      deliveryCharge,
      total,
      currency: "INR"
    };

    const appsScriptUrl = env.ORDER_API_URL;

    if (
      !appsScriptUrl ||
      !/^https:\/\/script\.google\.com\/macros\/s\/.+\/exec$/.test(appsScriptUrl)
    ) {
      return reply(500, {
        ok: false,
        message: "Order service is not configured. Please contact Mewa Veda."
      });
    }

    const upstream = await fetch(appsScriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(verifiedOrder)
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
        message: data.message || "Order could not be saved. Please try again."
      });
    }

    return reply(200, {
      ok: true,
      orderId: data.orderId || data.id || null,
      message: "Order request received."
    });

  } catch (error) {
    console.error("Place order error:", error);

    return reply(500, {
      ok: false,
      message: "Order service encountered an error. Please try again later."
    });
  }
}
