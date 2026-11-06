
const PRODUCTS = {
  // Dry Fruits
  badam_250: { name: "Badam", price: 275 },
  kaju_250: { name: "Kaju", price: 265 },
  pista_250: { name: "Pista", price: 465 },
  kishmish_250: { name: "Kishmish", price: 125 },
  akhrot_250: { name: "Akhrot", price: 300 },
  anjeer_250: { name: "Anjeer", price: 250 },

  // Other Dry Fruits
  chhuhara_500: { name: "Chhuhara 500g", price: 200 },
  chhuhara_1kg: { name: "Chhuhara 1kg", price: 399 },
  makhana_100: { name: "Makhana 100g", price: 150 },
  makhana_250: { name: "Makhana 250g", price: 370 },
  makhana_500: { name: "Makhana 500g", price: 700 },
  nariyal_250: { name: "Nariyal Powder 250g", price: 99 },
  nariyal_500: { name: "Nariyal Powder 500g", price: 199 },
  sabudana_200: { name: "Sabudana 200g", price: 35 },
  sabudana_500: { name: "Sabudana 500g", price: 70 },

  // Spices
  jeera_500: { name: "Jeera 500g", price: 199 },
  golki_500: { name: "Golki 500g", price: 480 },

  elaichi_100: { name: "Chhoti Elaichi 100g", price: 500 },
  elaichi_250: { name: "Chhoti Elaichi 250g", price: 1250 },
  elaichi_500: { name: "Chhoti Elaichi 500g", price: 2500 },
  elaichi_1kg: { name: "Chhoti Elaichi 1kg", price: 4900 },

  dalchini_250: { name: "Dalchini 250g", price: 149 },
  dalchini_500: { name: "Dalchini 500g", price: 299 },

  laung_250: { name: "Laung 250g", price: 300 },
  laung_500: { name: "Laung 500g", price: 600 }
};

exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, message: "Method not allowed" })
    };
  }

  try {
    const { ORDER_API_URL } = process.env;

    if (!ORDER_API_URL) {
      throw new Error("Order API URL is not configured");
    }

    const data = JSON.parse(event.body || "{}");

    const customer = data.customer || {};
    const items = data.items || [];

    if (!Array.isArray(items) || items.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, message: "Cart is empty" })
      };
    }

    const requiredFields = ["name", "phone", "address"];

    for (const field of requiredFields) {
      if (!String(customer[field] || "").trim()) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            message: `Customer ${field} is required`
          })
        };
      }
    }

    const phone = String(customer.phone).replace(/\D/g, "");

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: "Please enter a valid 10-digit mobile number"
        })
      };
    }

    let verifiedItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = PRODUCTS[item.id];
      const quantity = Number(item.quantity);

      if (!product) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            message: "Invalid product: " + item.id
          })
        };
      }

      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            message: "Invalid product quantity"
          })
        };
      }

      const lineTotal = product.price * quantity;
      subtotal += lineTotal;

      verifiedItems.push({
        id: item.id,
        name: product.name,
        price: product.price,
        quantity,
        unitPrice: product.price,
        lineTotal
      });
    }

    // Delivery is free
    const deliveryCharge = 0;
    const total = subtotal + deliveryCharge;

    const orderId =
      "MV" + Date.now().toString().slice(-10);

    const order = {
      orderId,
      customer: {
        name: String(customer.name).trim(),
        phone,
        address: String(customer.address).trim(),
        city: String(customer.city || "").trim(),
        pincode: String(customer.pincode || "").trim()
      },
      items: verifiedItems,
      subtotal,
      deliveryCharge,
      total,
      paymentMethod: "COD",
      paymentStatus: "Pending",
      orderStatus: "New",
      createdAt: new Date().toISOString()
    };

    const response = await fetch(ORDER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(order)
    });

    if (!response.ok) {
      throw new Error("Order sheet could not save the order");
    }

    const result = await response.json();

    if (result.success === false) {
      throw new Error(result.message || "Order saving failed");
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: "Order placed successfully",
        orderId,
        subtotal,
        deliveryCharge,
        total,
        paymentMethod: "COD"
      })
    };

  } catch (error) {
    console.error("Place order error:", error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: "Order place nahi ho paya. Please try again."
      })
    };
  }
};
