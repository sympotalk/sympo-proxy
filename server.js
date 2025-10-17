import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/proxy", async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).json({ error: "url 파라미터 필요" });
  try {
    const response = await fetch(targetUrl);
    const text = await response.text();
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.send(text);
  } catch (err) {
    res.status(500).json({ error: "프록시 요청 실패", details: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`✅ Proxy running on ${port}`));
