## 레트로한 끝말잇기 게임

html, css, javascript만을 이용해 구현한 간단한 끝말잇기 게임입니다.
Node.js로 프록시 서버를 실행한 후, PC및 모바일 브라우저에서 게임을 즐길 수 있도록 구성되어 있습니다.

## 실행

https://word-chain-devcourse.vercel.app/ 에서 직접 게임을 즐길 수 있습니다.

<img src="https://github.com/user-attachments/assets/a9ec71d8-13f5-48a4-b5be-53455989922c" width="30%" style="display:inline-block;">
<img src="https://github.com/user-attachments/assets/7adbf853-fd76-41e9-a3f9-5d80632c7444" width="30%" style="display:inline-block;">
<img src="https://github.com/user-attachments/assets/587670cd-d6cc-47fd-b998-77d813a4b3de" width="30%" style="display:inline-block;">

## 요구사항

이 게임을 실행하기 위해서는 표준국어대사전 api키 발급이 필요합니다.

표준국어대사전 api키 -> (https://stdict.korean.go.kr/openapi/openApiInfo.do) 에서 발급 가능
회원가입 후 '오픈 API 사용 신청'탭에서 신청이 가능합니다. '도메인' 입력부분에는, 도메인이 따로 없어서 '신청 사유'를 적어주었습니다.

## 설치 및 실행 방법

1. 원하는 파일의 위치를 열고, 이 저장소를 클론합니다.

```
  git clone https://github.com/dalsu0222/WordChain.git
  cd wordChain
```

2. 필요한 라이브러리들을 다운받아줍니다. (단, node.js가 반드시 설치되어 있어야 합니다.)

   `npm install`

3. `.env`파일을 따로 루트디렉토리에 생성해주고, 발급받은 개인 api키를 `.env` 파일에 입력합니다.

   이때, `.env` 파일의 내용에는 `API_KEY=AAA...본인키로대체` 작성해줍니다. 주의해야할 점은 키에는 문자열("", '') 기호를 써주지 않아야 합니다 .

4. 프록시 서버를 실행합니다.

   `node server.js`

5. '서버 프리워밍 완료'라는 메세지가 터미널에 뜨면 프록시 서버및 API 서버가 정상적으로 실행된 것입니다.

   프록시 서버가 실행된 후, 웹사이트를 실행합니다. index.html을 두 번 클릭하거나, VSCode 등에서 "Live Server" 플러그인을 사용하여 실행할 수 있습니다.(ALT L + ALT O)

## 게임 규칙 설명

- 제한시간(10초)내에 단어를 입력합니다.
- 끝말잇기에 한번 성공할때마다 20점씩 획득합니다.
- 처음 시작 시 목숨 3개가 주어집니다. 목숨이 0개가 되는 순간, 게임이 종료됩니다.
- 감점의 경우는 3가지가 있습니다. 감점과 동시에 목숨이 1개씩 차감됩니다.
  - 이번판 이미 입력한 적이 있는 단어인 경우(-10)
  - 타이머 10초가 지나버린경우(-20)
  - 입력된 단어가 끝말잇기 규칙에 위배되는 경우(-30)
- 게임도중 종료나 처음부터 시작이 가능합니다.
- 두음법칙이 적용된 정답 입력도 가능합니다.
