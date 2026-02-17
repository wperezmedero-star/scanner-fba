export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { code, cost } = req.body;

    if (!code || !cost) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    const price = 25; // precio de prueba
    const fees = price * 0.35;
    const profit = price - fees - cost;

    const decision = profit > 5 ? "Comprar ✅" : "No rentable ❌";

    return res.status(200).json({
      decision,
      summary: `Ganancia estimada: $${profit.toFixed(2)}`
    });

  } catch (err) {
    return res.status(500).json({ error: "Error interno", details: err.message });
  }
}
