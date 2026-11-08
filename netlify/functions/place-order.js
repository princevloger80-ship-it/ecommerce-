
const PRODUCTS = {
  // Dry Fruits
  badam: { name: "Badam / Almonds (250g)", price: 275 },
  kaju: { name: "Kaju / Cashews (250g)", price: 265 },
  pista: { name: "Pista / Pistachios (250g)", price: 465 },
  kishmish: { name: "Kishmish / Raisins (250g)", price: 125 },
  akhrot: { name: "Akhrot / Walnuts (250g)", price: 300 },
  anjeer: { name: "Anjeer / Dried Figs (250g)", price: 250 },
  khajoor: { name: "Khajoor / Dates (500g)", price: 280 },
  mix: { name: "Mix Dry Fruits (250g)", price: 270 },

  // Other Products
  "chhuhara-500g": { name: "Chhuhara (500g)", price: 200 },
  "chhuhara-1kg": { name: "Chhuhara (1kg)", price: 399 },
  "makhana-100g": { name: "Makhana (100g)", price: 150 },
  "makhana-250g": { name: "Makhana (250g)", price: 370 },
  "makhana-500g": { name: "Makhana (500g)", price: 700 },
  "nariyal-powder-250g": { name: "Nariyal Powder (250g)", price: 99 },
  "nariyal-powder-500g": { name: "Nariyal Powder (500g)", price: 199 },
  "sabudana-200g": { name: "Sabudana (200g)", price: 35 },
  "sabudana-500g": { name: "Sabudana (500g)", price: 70 },
  "mungfali-100g": { name: "Mungfali (100g)", price: 20 },
  "mungfali-250g": { name: "Mungfali (250g)", price: 50 },
  "mungfali-500g": { name: "Mungfali (500g)", price: 100 },
  "mungfali-1kg": { name: "Mungfali (1kg)", price: 190 },

  // Jeera
  "spice-cumin-seeds-jeera-500g": {
    name: "Cumin Seeds / Jeera (500g)",
    price: 199
  },
  "spice-cumin-seeds-jeera-1kg": {
    name: "Cumin Seeds / Jeera (1kg)",
    price: 398
  },

  // Golki / Black Pepper
  "spice-black-pepper-kali-mirch-500g": {
    name: "Golki / Black Pepper (500g)",
    price: 480
  },
  "spice-black-pepper-kali-mirch-1kg": {
    name: "Golki / Black Pepper (1kg)",
    price: 960
  },

  // Chhoti Elaichi
  "spice-green-cardamom-chhoti-elaichi-100g": {
    name: "Chhoti Elaichi (100g)",
    price: 500
  },
  "spice-green-cardamom-chhoti-elaichi-250g": {
    name: "Chhoti Elaichi (250g)",
    price: 1250
  },
  "spice-green-cardamom-chhoti-elaichi-500g": {
    name: "Chhoti Elaichi (500g)",
    price: 2500
  },
  "spice-green-cardamom-chhoti-elaichi-1kg": {
    name: "Chhoti Elaichi (1kg)",
    price: 4900
  },

  // Dalchini
  "spice-cinnamon-dalchini-250g": {
    name: "Dalchini (250g)",
    price: 149
  },
  "spice-cinnamon-dalchini-500g": {
    name: "Dalchini (500g)",
    price: 299
  },
  "spice-cinnamon-dalchini-1kg": {
    name: "Dalchini (1kg)",
    price: 598
  },

  // Laung
  "spice-cloves-laung-250g": {
    name: "Laung (250g)",
    price: 300
  },
  "spice-cloves-laung-500g": {
    name: "Laung (500g)",
    price: 600
  },
  "spice-cloves-laung-1kg": {
    name: "Laung (1kg)",
    price: 1200
  },

  // Saunf
  "spice-fennel-seeds-saunf": {
    name: "Saunf (1kg)",
    price: 250
  },

  // Badi Elaichi
  "spice-black-cardamom-badi-elaichi-100g": {
    name: "Badi Elaichi (100g)",
    price: 260
  },
  "spice-black-cardamom-badi-elaichi-250g": {
    name: "Badi Elaichi (250g)",
    price: 650
  },
  "spice-black-cardamom-badi-elaichi-500g": {
    name: "Badi Elaichi (500g)",
    price: 1300
  },
  "spice-black-cardamom-badi-elaichi-1kg": {
    name: "Badi Elaichi (1kg)",
    price: 2600
  },

  // Khada Masala
  "ajwain-250g": { name: "Ajwain (250g)", price: 99 },
  "ajwain-500g": { name: "Ajwain (500g)", price: 199 },
  "ajwain-1kg": { name: "Ajwain (1kg)", price: 399 },

  "methi-250g": { name: "Methi (250g)", price: 49 },
  "methi-500g": { name: "Methi (500g)", price: 99 },
  "methi-1kg": { name: "Methi (1kg)", price: 199 },

  "sarso-250g": { name: "Sarso (250g)", price: 59 },
  "sarso-500g": { name: "Sarso (500g)", price: 118 },
  "sarso-1kg": { name: "Sarso (1kg)", price: 236 },

  "kala-sarso-250g": { name: "Kala Sarso (250g)", price: 59 },
  "kala-sarso-500g": { name: "Kala Sarso (500g)", price: 118 },
  "kala-sarso-1kg": { name: "Kala Sarso (1kg)", price: 236 },

  "khadi-mirch-250g": { name: "Khadi Mirch (250g)", price: 100 },
  "khadi-mirch-500g": { name: "Khadi Mirch (500g)", price: 199 },

  "khadi-haldi-250g": { name: "Khadi Haldi (250g)", price: 87 },
  "khadi-haldi-500g": { name: "Khadi Haldi (500g)", price: 175 }
};

// Free delivery on every order
const FREE_DELIVERY_MINIMUM = 0;
const DELIVERY_CHARGE = 0;

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}

// Handle browser preflight requests
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400"
    }
  });
}

// Handle COD orders
export async function onRequestPost({ request, env }) {
  try {
    const body = await request.text();

    if (!body || body.length > 20000) {
      return jsonResponse({
        ok: false,
        message: "Order data is missing or too large."
      }, 400);
    }

    let order;

    try {
      order = JSON.parse(body);
    } catch {
      return jsonResponse({
        ok: false,
        message: "Invalid order data."
      }, 400);
    }

    if (!order || typeof order !== "object" || Array.isArray(order)) {
      return jsonResponse({
        ok: false,
        message: "Invalid order request."
      }, 400);
    }

    // Basic bot protection
    if (String(order.website || "").trim() !== "") {
      return jsonResponse({
        ok: false,
        message: "Invalid order request."
      }, 400);
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
      return jsonResponse({
        ok: false,
        message: "Please enter a valid email address."
      }, 400);
    }

    if (emailNotifications && !email) {
      return jsonResponse({
        ok: false,
        message: "Enter your email address to receive order updates."
      }, 400);
    }

    if (name.length < 2 || name.length > 100) {
      return jsonResponse({
        ok: false,
        message: "Please enter a valid customer name."
      }, 400);
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return jsonResponse({
        ok: false,
        message: "Enter a valid 10-digit Indian mobile number."
      }, 400);
    }

    if (address.length < 8 || address.length > 500) {
      return jsonResponse({
        ok: false,
        message: "Please enter a complete delivery address."
      }, 400);
    }

    if (city.length < 2 || city.length > 100) {
      return jsonResponse({
        ok: false,
        message: "Please enter a valid city or delivery area."
      }, 400);
    }

    if (!/^\d{6}$/.test(pin)) {
      return jsonResponse({
        ok: false,
        message: "Enter a valid 6-digit PIN code."
      }, 400);
    }

    if (order.paymentMethod !== "COD") {
      return jsonResponse({
        ok: false,
        message: "Only Cash on Delivery is available."
      }, 400);
    }

    if (
      !Array.isArray(order.items) ||
      order.items.length < 1 ||
      order.items.length > 20
    ) {
      return jsonResponse({
        ok: false,
        message: "Your cart is empty or contains too many items."
      }, 400);
    }

    // Verify product IDs, quantities and prices on the server
    const verifiedItems = [];
    let subtotal = 0;

    for (const item of order.items) {
      const id = String(item.id || "");
      const product = PRODUCTS[id];
      const qty = Number(item.qty);

      if (!product) {
        return jsonResponse({
          ok: false,
          message: "One of the selected products is unavailable. Please refresh the website."
        }, 400);
      }

      if (!Number.isInteger(qty) || qty < 1 || qty > 20) {
        return jsonResponse({
          ok: false,
          message: "Invalid product quantity."
        }, 400);
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

    // Cloudflare Pages environment variable
    const appsScriptUrl = env.ORDER_API_URL;

    if (
      !appsScriptUrl ||
      !/^https:\/\/script\.google\.com\/macros\/s\/.+\/exec$/.test(appsScriptUrl)
    ) {
      return jsonResponse({
        ok: false,
        message: "Order service is not configured. Please contact Mewa Veda."
      }, 500);
    }

    // Send verified order to Google Apps Script
    const upstream = await fetch(appsScriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(verifiedOrder),
      redirect: "follow"
    });

    const responseText = await upstream.text();

    let data;

    try {
      data = JSON.parse(responseText);
    } catch {
      console.error("Apps Script returned a non-JSON response.");

      return jsonResponse({
        ok: false,
        message: "Order service returned an unreadable response."
      }, 502);
    }

    if (!upstream.ok || data.ok !== true) {
      return jsonResponse({
        ok: false,
        message: data.message || "Order could not be saved. Please try again."
      }, 502);
    }

    return jsonResponse({
      ok: true,
      orderId: data.orderId || data.id || null,
      message: "Order request received."
    }, 200);

  } catch (error) {
    console.error("Place order error:", error);

    return jsonResponse({
      ok: false,
      message: "Order service encountered an error. Please try again later."
    }, 500);
  }
}
