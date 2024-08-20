// ProgressBar.js로 프로그레스 바 설정
var bar = new ProgressBar.Line("#progressBar", {
  strokeWidth: 4,
  easing: "linear",
  duration: 10000, // 전체 카운트다운 시간 (10초)
  color: "#ff7043",
  trailColor: "#eee",
  trailWidth: 1,
  svgStyle: {
    width: "100%",
    height: "100%",
    transform: "scaleX(1)", // 왼쪽에서 오른쪽으로 줄어드는 효과
    transformOrigin: "center",
    borderRadius: "10px",
  },
  text: {
    style: {
      color: "#999",
      position: "absolute",
      // right: "0",
      // top: "",
      padding: 0,
      margin: 0,
      transform: null,
    },
    autoStyleContainer: false,
  },
  from: { color: "#ff7043" },
  to: { color: "#ff5722" },
  step: (state, bar) => {
    const seconds = Math.ceil(bar.value() * 10); // 10초에서 남은 초 계산
    const $timer = document.getElementById("timer");
    $timer.textContent = seconds;
    // 남은 시간이 4초 이하일 때, 글씨와 바 색상을 빨간색으로 변경
    if (seconds <= 4) {
      $timer.style.color = "red";
      bar.path.setAttribute("stroke", "red");
      $timer.classList.add("shake");
    } else {
      $timer.style.color = "black";
      bar.path.setAttribute("stroke", state.color);
      $timer.classList.remove("shake");
    }
  },
});
const $score = document.querySelector(".score");
const $sign = document.querySelector(".sign");
const $startBtn = document.getElementById("startBtn");
const $replayBtn = document.getElementById("replayBtn");
const $searchBtn = document.getElementById("searchBtn");
const $endGameBtn = document.getElementById("endGameBtn");
const $innerReplayBtn = document.getElementById("innerReplayBtn");
const $search = document.getElementById("search");
const $bottomText = document.querySelector(".bottomText");
const $newBadge = document.querySelector(".newImg");
const $startBox = document.querySelector(".start");
const $middleBox = document.querySelector(".middle");
const $endBox = document.querySelector(".end");

let score = 0;
const startWords = [
  "사과",
  "다방",
  "바다",
  "도시",
  "시계",
  "계산",
  "라면",
  "면도",
  "도서",
  "서랍",
  "도전",
  "스터디",
  "디자인",
  "인형",
  "형광",
  "광주",
  "주스",
  "스마트",
  "트리",
  "주행",
];
let words = [];
let isGameOver = false; // 게임종료여부
let highestScore = localStorage.getItem("HighestScore") || 0;

const getRandomWord = (words) => {
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex];
};
const initializeWord = () => {
  const $startWord = document.querySelector(".middle > .cardSubtitle");
  const randomWord = getRandomWord(startWords);
  $startWord.textContent = `현재단어 : ${randomWord}`;
  words.push(randomWord);
};
const startCountdown = () => {
  // 프로그레스 바를 꽉 채운 상태로 시작
  bar.set(1.0);
  bar.animate(0, function () {
    // 카운트다운 애니메이션이 끝났을 때 실행될 콜백 함수.
    if (!isGameOver) {
      scoreRenewal(-20); // 감점
      minusHeart(); // 하트 차감
      // $bottomText.innerHTML =
      //   "시간이 다 되었습니다!😓 <br />다음 단어를 입력해주세요!";
      $sign.innerHTML = "시간초과 -20";
      $sign.classList.remove("success");
      shakeError();
      startCountdown(); // 타이머 재시작
    }
  });
  $search.focus();
};
const startGame = () => {
  isGameOver = false; // 게임 종료 여부 초기화
  $startBox.style.display = "none";
  $middleBox.style.display = "flex";

  // 제시 단어 제공
  initializeWord();
  // 현재 점수 0점 초기화
  $score.textContent = `현재 점수 : ${score}`;
  startCountdown();
};

const isHighestScore = (score) => {
  console.log("hightest Score : ", highestScore);

  if (score > highestScore) {
    highestScore = score;
    showHighestScore(); // hamCon에도 최고점수 표시
    localStorage.setItem("HighestScore", score);
    document.querySelector(".endScore.highest").textContent = score;
    $newBadge.style.display = "block";
  } else {
    document.querySelector(".endScore.highest").textContent = highestScore;
    $newBadge.style.display = "none";
  }
};
const showHighestScore = () => {
  const $hamConScore = document.querySelector(".hamCon .endScore");
  $hamConScore.textContent = highestScore;
  document.querySelector(".end .endScore.highest").textContent = highestScore;
};
showHighestScore();
const showEndBox = () => {
  isGameOver = true; // 게임 종료
  bar.stop(); // 타이머 멈춤
  $middleBox.style.display = "none";
  $endBox.style.display = "flex";
  document.querySelector(".endScore.current").textContent = score;

  // 최고점수인지 확인하여 갱신
  isHighestScore(score);
};
const scoreRenewal = (num) => {
  score += num;
  $score.textContent = `현재 점수 : ${score}`;
};
const minusHeart = () => {
  const $hearts = document.querySelectorAll(".fa-heart");
  const $lastHeart = $hearts[$hearts.length - 1];
  if ($hearts.length === 1) {
    alert("하트 3개가 전부 소진되었습니다. 게임 종료!");
    showEndBox();
  }
  if ($lastHeart) {
    $lastHeart.classList.remove("fa-heart");
    $lastHeart.classList.add("fa-heart-crack");
    $lastHeart.style.color = "lightgray";
    $lastHeart.classList.add("shake");
    setTimeout(() => {
      $lastHeart.classList.remove("shake");
    }, 1000);
  }
};
const shakeError = () => {
  const $relativeContainer = document.querySelector(".relative-container");
  $relativeContainer.classList.add("shake");

  setTimeout(() => {
    $relativeContainer.classList.remove("shake");
  }, 1000);
};
const checkDueumLaw = (lastWord, currentWord) => {
  // 한글을 초성, 중성, 종성으로 분해
  const disintegrateLastWord = HanTools.disintegrate(lastWord);
  const disintegrateCurrentWord = HanTools.disintegrate(currentWord);

  // 마지막 단어의 종성과 현재 단어의 초성 추출
  const lastWordJongseong = disintegrateLastWord[2] || HanTools.JONGSEONG_EMPTY;
  const currentWordChoseong = disintegrateCurrentWord[0];

  // 두음법칙에 따른 규칙 확인
  return lastWordJongseong === currentWordChoseong;
};
const isMatchingLastAndFirst = (lastWord, currentWord) => {
  const lastWordLastChar = lastWord[lastWord.length - 1];
  const currentWordFirstChar = currentWord[0];

  // 두음법칙 적용
  if (
    checkDueumLaw(lastWord, currentWord) ||
    lastWordLastChar === currentWordFirstChar
  ) {
    return true;
  } else {
    // alert("끝말잇기 규칙에 맞지 않습니다.");
    // $bottomText.innerHTML =
    //   "끝말잇기 규칙에 맞지 않습니다. <br />다시 시도해주세요!";
    $sign.innerHTML = "끝말잇기 규칙에 맞지 않음 -30";
    $sign.classList.remove("success");
    scoreRenewal(-30);
    minusHeart();
    startCountdown(); // 타이머 재시작
    return false;
  }
};
const isBeforeWord = (currentWord) => {
  // words 배열에 존재하는지 확인
  if (words.includes(currentWord)) {
    scoreRenewal(-10);
    // $bottomText.innerHTML =
    //   "이미 사용한 단어입니다.😓 <br />다른 단어를 입력해주세요!";
    $sign.innerHTML = "이미 사용한 단어 -10";
    $sign.classList.remove("success");
    minusHeart();
    startCountdown(); // 타이머 재시작
    return false;
  }
  return true;
};
const isApiWord = async (currentWord) => {
  const query = currentWord;
  const baseURL = window.location.origin.includes("localhost")
    ? "http://localhost:3000"
    : "https://word-chain-devcourse.vercel.app";
  const url = new URL(`${baseURL}/api/dictionary`);

  // 검색어를 쿼리 파라미터로 추가
  const params = new URLSearchParams();
  params.append("q", query);
  url.search = params.toString();

  try {
    const response = await fetch(url);

    const data = await response.json();

    if (!data || !data.channel || !data.channel.item) {
      console.log("단어가 존재하지 않습니다.");
      $sign.innerHTML = "사전에 존재하지 않는 단어 -30";
      $sign.classList.remove("success");
      scoreRenewal(-30);
      minusHeart();
      startCountdown(); // 타이머 재시작
      return false;
    }
    const outputWords = data.channel.item;
    console.log("outputWords:", outputWords);
    return true;
  } catch (error) {
    console.log(error);
    console.error("API 호출 중 오류 발생:", error);
    alert("단어를 확인하는 중 오류가 발생했습니다. 다시 시도해주세요.");
  }
};

const testWord = async (e) => {
  e.preventDefault();
  const $startWord = document.querySelector(".middle > .cardSubtitle");
  const inputWord = $search.value.trim();
  console.log("입력단어 :", inputWord);
  // 입력이 존재하는지 확인
  if (inputWord === "") {
    $sign.innerHTML = "단어를 입력해주세요.";
    $sign.classList.remove("success");
    shakeError();
    return;
  }
  if (inputWord.length === 1) {
    $sign.innerHTML = "2글자 이상 입력해주세요.";
    $sign.classList.remove("success");
    shakeError();
    return;
  }

  // 1. 입력한 단어의 첫 글자와 시작 단어의 마지막 글자가 같은지 확인
  // 2. 중복된 단어가 아닌지 확인
  // 3. 사전 api에 존재하는 단어인지 확인
  if (
    !isMatchingLastAndFirst($startWord.textContent, inputWord) ||
    !isBeforeWord(inputWord) ||
    !(await isApiWord(inputWord))
  ) {
    shakeError();
    $search.value = "";
    return;
  }

  // 조건검사 통과시, 성공
  const $currentWord = document.querySelector(".middle > .cardSubtitle");
  $currentWord.textContent = `현재단어 : ${inputWord}`;
  $sign.innerHTML = "";
  $search.value = "";

  // $bottomText.innerHTML = "성공! 다음 단어로 이어보세요";
  // $bottomText.style.display = "block";
  $sign.innerHTML = "성공! 다음 단어로 이어보세요";
  $sign.classList.add("success");
  $sign.classList.add("bounce");
  setTimeout(() => $sign.classList.remove("bounce"), 1000);

  words.push(inputWord);
  scoreRenewal(20); // 20점 획득
  startCountdown(); // 타이머 재시작
};

$startBtn.addEventListener("click", startGame);
$searchBtn.addEventListener("click", testWord);
$search.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    testWord(e);
  }
});

$endGameBtn.addEventListener("click", showEndBox);
$replayBtn.addEventListener("click", () => {
  location.reload();
});
$innerReplayBtn.addEventListener("click", () => {
  location.reload();
});

const $hamBtn = document.querySelector(".hamBtn");
const $hamCon = document.querySelector(".hamCon");
const showHamContainer = () => {
  $hamCon.classList.toggle("show");
  $hamBtn.classList.toggle("rotate");
};

// hamBtn 클릭시 hamContainer 토글
$hamBtn.addEventListener("click", showHamContainer);
