export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ decision: "Error", summary: "Método no permitido" });
  }

  const { code, cost } = req.body;

  if (!code || !cost) {
    return res.status(400).json({ decision: "Datos faltantes", summary: "Introduce UPC/ASIN y costo" });
  }

  const price = 25;
  const fees = price * 0.35;
  const profit = price - fees - cost;

  let decision = profit > 5 ? "Comprar ✅" : "No rentable ❌";

  res.status(200).json({
    decision,
    summary: `Ganancia estimada: $${profit.toFixed(2)}`
  });
}
