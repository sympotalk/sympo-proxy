import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.all("/proxy", async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).json({ error: "url 파라미터 필요" });

  try {
    // 원본 요청의 메서드/헤더/바디를 그대로 전달
    const method = req.method;
    const headers = { ...req.headers };
    delete headers.host; // 원본 Host 헤더 제거

    let body;
    if (method !== "GET" && method !== "HEAD") {
      // JSON 혹은 x-www-form-urlencoded 모두 지원
      const ct = req.headers["content-type"] || "";
      if (ct.includes("application/json")) {
        body = JSON.stringify(req.body || {});
      } else {
        const params = new URLSearchParams(req.body || {});
        body = params.toString();
