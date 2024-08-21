require("dotenv").config(); // .env 파일에서 환경 변수를 로드

const express = require("express");
const axios = require("axios");
const app = express();
const PORT = 3000;

const API_KEY = process.env.API_KEY; // 환경 변수에서 API 키를 읽기

// CORS 설정
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.static("public"));

// API 요청을 처리하는 엔드포인트
app.get("/api/dictionary", async (req, res) => {
  const { q } = req.query; // 클라이언트로부터 검색어를 받음
  const apiUrl = `https://stdict.korean.go.kr/api/search.do?certkey_no=6796&key=${API_KEY}&type_search=search&req_type=json&q=${q}&type1=word&pos=1`;

  try {
    const response = await axios.get(apiUrl);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "API 요청 실패" });
  }
});

// 서버 초기화 함수
const initializeServer = async () => {
  console.log("서버 초기화 작업 시작...");
  // 초기화 작업 예시
  console.log("서버 초기화 완료");
};

// 프리워밍을 위한 테스트 요청 보내기
const warmUpServer = async () => {
  const baseURL = window.location.origin.includes("localhost")
    ? "http://localhost:3000"
    : "https://word-chain-devcourse.vercel.app";
  try {
    const warmUpResponse = await axios.get(`${baseURL}/api/dictionary?q=나무`);
    if (warmUpResponse.status === 200) {
      console.log("서버 프리워밍 완료");
    } else {
      console.error("서버 프리워밍 요청 실패", warmUpResponse.status);
    }
  } catch (error) {
    console.error("서버 프리워밍 중 오류 발생:", error);
  }
};

// 서버 초기화 및 프리워밍
initializeServer()
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running on http://0.0.0.0:${PORT}`);
      // 서버가 시작된 후 프리워밍 요청을 보냅니다.
      warmUpServer();
    });
  })
  .catch((error) => {
    console.error("서버 초기화 중 오류 발생:", error);
    process.exit(1); // 초기화 실패 시 프로세스 종료
  });
