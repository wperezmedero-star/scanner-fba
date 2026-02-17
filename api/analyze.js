export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ decision: "Error", summary: "Método no permitido" });
  }

  const { code, cost } = req.body;

  if (!code || !cost) {
    return res.status(400).json({ decision: "Datos faltantes", summary: "Introduce UPC/ASIN y costo" });
  }

const response = await fetch(`https://api.keepa.com/product?key=9sk4l6svnfttv4687a65m2d3ueo1d94g5l5md05ojtonu1220n9r7ckd5eghrsg5&domain=1&code=${code}`);
const data = await response.json();

if (!data.products || !data.products.length) {
  return res.status(404).json({ decision: "Error", summary: "Producto no encontrado" });
}

const price = data.products[0].stats.current[1] / 100;
  const fees = price * 0.35;
  const profit = price - fees - cost;

  let decision = profit > 5 ? "Comprar ✅" : "No rentable ❌";

  res.status(200).json({
    decision,
    summary: `Ganancia estimada: $${profit.toFixed(2)}`
  });
}
