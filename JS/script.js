// Call all elements

let startPage = document.querySelector(".start");
let startButton = document.getElementById("start-button");
let cutdownPage = document.querySelector(".cutdown-page");
let cutdownElement = document.querySelector(".cutdown-page span");
let playPage = document.querySelector(".play");
let quizArea = document.querySelector(".word");
let answersArea = document.querySelector(".answer");
let resultsPage = document.querySelector(".results");
let chooseTable = document.getElementById("choose-table");

let cutdownTimer;
let cutdownTime = 5;
let currentIndex;
let rightAnswers = 0;
let numOfQuestions = 0;
let numOfDigitYouWant = 100;
let int = null;
let tableType;
let attemptTimeInSecond = 0;

let twoDigit = [];
function createCurrentIndex() {
  for (let i = 0; i < 100; i++) {
    twoDigit.push(i);
  }
  let ranIndex = Math.floor(Math.random() * twoDigit.length);
  currentIndex = twoDigit[ranIndex];
  twoDigit.splice(ranIndex, 1);
}

function getData(apilink) {
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let data = JSON.parse(this.responseText);

      // show q and choises
      showQuestionsAndAnswer(data);

      checkAnswer(data);

      showResults();
    }
  };

  myRequest.open("GET", apilink, true);
  myRequest.send();
}

startButton.onclick = () => {
  startPage.remove();
  document.querySelector(".top-results").style.display = "none";
  cutdownPage.style.display = "block";
  // cutdown
  cutdown(cutdownTime);

  if (chooseTable.value === "object1") {
    apilink = "Object-1.json";
    tableType = "Object 1";
  } else if (chooseTable.value === "object2") {
    apilink = "Object-2.json";
    tableType = "Object 2";
  } else if (chooseTable.value === "action") {
    apilink = "Action.json";
    tableType = "Action";
  }

  getData(apilink);
};

// Cut down for befor play page
function cutdown(duration) {
  cutdownElement.innerHTML = cutdownTime;
  let seconds = duration % 60;

  cutdownTimer = setInterval(() => {
    seconds--;
    cutdownElement.innerHTML = `${seconds}`;

    if (--duration < 1) {
      clearInterval(cutdownTimer);
      cutdownPage.remove();
      playPage.style.display = "block";
    }
  }, 1000);
}

function showQuestionsAndAnswer(data) {
  createCurrentIndex();
  let rightAnswer = data[currentIndex].right_answer;

  let twoDigitElement = document.createElement("h2");
  let twoDigitContent = document.createTextNode(data[currentIndex].word);
  twoDigitElement.appendChild(twoDigitContent);

  document.querySelector(".word").appendChild(twoDigitElement);

  // create answer div
  let mainDiv = document.createElement("div");
  mainDiv.className = "answer";

  //   creat araay from 00 to 99
  let twoDigit = [];
  for (let i = 0; i < 100; i++) {
    twoDigit.push(i < 10 ? `0${i}` : `${i}`);
  }
  //   remove right answer from the array
  twoDigit.splice(rightAnswer, 1);
  let num1, num2;

  for (let i = 0; i < 1; i++) {
    let ranIndex = Math.floor(Math.random() * twoDigit.length);
    num1 = twoDigit[ranIndex];
    //   remove num1 from the array
    twoDigit.splice(ranIndex, 1);
  }

  for (let i = 0; i < 1; i++) {
    let ranIndex = Math.floor(Math.random() * twoDigit.length);
    num2 = twoDigit[ranIndex];
    //   remove num2 from the array
    twoDigit.splice(ranIndex, 1);
  }

  let answerArray = [rightAnswer, num1, num2];

  for (let i = 0; i < 3; i++) {
    ranIndex = Math.floor(Math.random() * answerArray.length);

    let span = document.createElement("span");
    span.dataset.answer = answerArray[ranIndex];
    span.style.cursor = "pointer";
    let spanContent = document.createTextNode(answerArray[ranIndex]);
    span.appendChild(spanContent);
    document.querySelector(".answer").appendChild(span);

    answerArray.splice(ranIndex, 1);
  }
}

let correctResultsDuringAnswer = document.querySelector(".current-result");

function checkAnswer(data) {
  let rightAnswer = data[currentIndex].right_answer;
  let theChoosenAnswer;

  let spans = document.querySelectorAll(".answer span");

  for (let i = 0; i < spans.length; i++) {
    spans[i].onclick = () => {
      numOfQuestions++;
      theChoosenAnswer = spans[i].dataset.answer;

      if (theChoosenAnswer == rightAnswer) {
        // spans[i].classList = "correct";
        rightAnswers++;
        correctResultsDuringAnswer.innerHTML = rightAnswers;
        correctResultsDuringAnswer.classList = "correct";
        // correctResultsDuringAnswer.classList = "correct";
      } else {
        // spans[i].classList = "wrong";
        correctResultsDuringAnswer.classList = "wrong";
      }
      quizArea.innerHTML = "";
      answersArea.innerHTML = "";

      if (numOfQuestions > 0) {
        if (int !== null) {
          clearInterval(int);
        }
        int = setInterval(displayTimer, 10);
      }
      if (numOfQuestions === numOfDigitYouWant) {
        clearInterval(int);

        document.querySelector(".top-results").style.display = "block";

        if (chooseTable.value === "object1") {
          newResult("objectOne", objectOneResults, "object-1-tbody");
        } else if (chooseTable.value === "object2") {
          newResult("objectTwo", objectTwoResults, "object-2-tbody");
        } else if (chooseTable.value === "action") {
          newResult("action", actionResults, "action-tbody");
        }
      }

      showQuestionsAndAnswer(data);

      checkAnswer(data);

      showResults();
    };
  }
}
// Stop Watch .correct

let [milliseconds, seconds, minutes] = [0, 0, 0];
let timerRef = document.querySelector(".play .timer span");

function displayTimer() {
  milliseconds += 10;

  if (milliseconds == 1000) {
    milliseconds = 0;
    seconds++;

    if (seconds == 60) {
      seconds = 0;
      minutes++;
    }
  }

  let m = minutes < 10 ? "0" + minutes : minutes;
  let s = seconds < 10 ? "0" + seconds : seconds;
  let ms =
    milliseconds < 10
      ? "00" + milliseconds
      : milliseconds < 100
      ? "0" + milliseconds
      : milliseconds;

  if (numOfQuestions === 0) {
    timerRef.innerHTML = `00:00:00`;
  }
  timerRef.innerHTML = `${m > 0 ? m + ":" : ""}${s}:${ms}`;

  attemptTimeInSecond = minutes * 60 + seconds + milliseconds / 1000;
}

// Show Results
function showResults() {
  if (numOfQuestions === numOfDigitYouWant) {
    playPage.remove();
    resultsPage.style.display = "block";

    document.querySelector(".results .score").innerHTML = rightAnswers;

    document.querySelector(".results .time").innerHTML = timerRef.innerHTML;
    document.querySelector(".results .accuracy").innerHTML = `${Math.round(
      (rightAnswers / numOfDigitYouWant) * 100
    )}%`;
    document.querySelector(".results .table").innerHTML = tableType;
  }
}
// results table function

function getDateOfToday() {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  let yyyy = today.getFullYear();

  today = dd + "-" + mm + "-" + yyyy;
  return today;
}

let objectOneResults = [];

if (localStorage.objectOne) {
  objectOneResults = JSON.parse(localStorage.objectOne);
} else {
  objectOneResults = [];
}

let objectTwoResults = [];
if (localStorage.objectTwo) {
  objectTwoResults = JSON.parse(localStorage.objectTwo);
} else {
  objectTwoResults = [];
}

let actionResults = [];
if (localStorage.action) {
  actionResults = JSON.parse(localStorage.action);
} else {
  actionResults = [];
}

function newResult(localStorageName, tableArray, tableId) {
  let newPlayer = {
    score: rightAnswers,
    time: timerRef.innerHTML,
    date: getDateOfToday(),
    attemptTimeInSecond: attemptTimeInSecond,
  };

  tableArray.push(newPlayer);
  localStorage.setItem(localStorageName, JSON.stringify(tableArray));
  showResultsTable(tableId, tableArray);
}

function showResultsTable(tableId, tableArray) {
  let table = "";

  tableArray.sort(
    (a, b) => b.score - a.score || a.attemptTimeInSecond - b.attemptTimeInSecond
  );

  for (let i = 0; i < tableArray.length; i++) {
    if (i === 5) break;
    table += `
      <tr>
        <td>${i + 1}</td>
        <td>${tableArray[i].score}</td>
        <td>${tableArray[i].time}</td>
        <td>${tableArray[i].date}</td>
      </tr> 
    `;
  }
  document.getElementById(tableId).innerHTML = table;
}

showCompleteTables();
showResultsTable("object-1-tbody", objectOneResults);
showResultsTable("object-2-tbody", objectTwoResults);
showResultsTable("action-tbody", actionResults);

function showCompleteTables() {
  if (objectOneResults.length === 0) {
    document.getElementById("result-table1").style.display = "none";
  }
  if (objectTwoResults.length === 0) {
    document.getElementById("result-table2").style.display = "none";
  }
  if (actionResults.length === 0) {
    document.getElementById("result-table3").style.display = "none";
  }
}

document
  .querySelector(".results .container .main-page")
  .addEventListener("click", () => {
    console.log("reload");
    location.reload();
  });
