export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ decision: "Error", summary: "Método no permitido" });
  }

  const { code, cost } = req.body;

  if (!code || !cost) {
    return res.status(400).json({
      decision: "Datos faltantes",
      summary: "Introduce ASIN y costo"
    });
  }

  const keepaKey = process.env.KEEPA_KEY;

  if (!keepaKey) {
    return res.status(500).json({
      decision: "Error",
      summary: "No se encontró KEEPA_KEY en Vercel"
    });
  }

  try {
    const asin = code.trim();

    const url = `https://api.keepa.com/product?key=${keepaKey}&domain=1&asin=${asin}`;

    const r = await fetch(url);
    const data = await r.json();

    if (!data.products || !data.products.length) {
      return res.status(404).json({
        decision: "No encontrado",
        summary: "Keepa no encontró el producto"
      });
    }

    const product = data.products[0];

    const priceData = product.stats?.current || [];
    const prices = Object.values(priceData).filter(v => typeof v === "number" && v > 0);

    if (!prices.length) {
      return res.status(200).json({
        decision: "Sin precio",
        summary: "Keepa no devolvió precio válido"
      });
    }

    const price = Math.min(...prices) / 100;

    const fees = price * 0.35;
    const profit = price - fees - Number(cost);

    const decision = profit > 5 ? "Comprar ✅" : "No rentable ❌";

    res.status(200).json({
      decision,
      summary: `Ganancia estimada: $${profit.toFixed(2)} (Precio: $${price.toFixed(2)})`
    });

  } catch (err) {
    res.status(500).json({
      decision: "Error",
      summary: "Fallo consultando Keepa"
    });
  }
}
