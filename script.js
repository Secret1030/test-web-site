const missions = [
  {
    title: "다회용 컵 사용하기",
    description: "음료를 마실 때 일회용 컵 대신 다회용 컵을 사용해 보세요.",
    icon: "🪴"
  },
  {
    title: "사용하지 않는 전등 끄기",
    description: "방을 나올 때 조명과 사용하지 않는 전자기기의 전원을 확인해 보세요.",
    icon: "💡"
  },
  {
    title: "가까운 거리는 걷기",
    description: "가까운 목적지라면 자동차 대신 걷거나 자전거를 이용해 보세요.",
    icon: "🚲"
  },
  {
    title: "올바르게 분리배출하기",
    description: "재활용품을 비우고, 헹구고, 재질에 맞게 분리해 보세요.",
    icon: "♻️"
  },
  {
    title: "필요한 만큼만 소비하기",
    description: "물건을 사기 전에 정말 필요한지 생각하고 음식물 낭비를 줄여 보세요.",
    icon: "🌿"
  }
];

const quizQuestions = [
  {
    question: "깨끗하게 씻은 페트병을 버릴 때 먼저 하면 좋은 일은?",
    options: ["내용물을 비우고 라벨을 분리한다", "뚜껑을 닫은 채 일반 쓰레기에 버린다", "다른 쓰레기와 함께 봉투에 넣는다", "물을 가득 채워 버린다"],
    answer: 0,
    explanation: "내용물을 비우고 라벨을 분리한 뒤, 지역 배출 기준에 따라 배출하세요."
  },
  {
    question: "종이 상자를 재활용하기 전에 하면 좋은 일은?",
    options: ["물에 완전히 적신다", "테이프와 이물질을 제거한다", "플라스틱과 함께 묶는다", "음식물을 안에 넣는다"],
    answer: 1,
    explanation: "테이프와 이물질을 제거하고 상자를 펼쳐 배출하면 좋습니다."
  },
  {
    question: "장바구니를 여러 번 사용하는 주된 이유는?",
    options: ["물건을 더 많이 사기 위해", "쓰레기 무게를 늘리기 위해", "일회용 봉투 사용을 줄이기 위해", "분리배출을 하지 않기 위해"],
    answer: 2,
    explanation: "장바구니를 반복 사용하면 일회용 봉투 소비를 줄이는 데 도움이 됩니다."
  },
  {
    question: "사용하지 않는 방의 조명을 끄면 무엇을 줄이는 데 도움이 될까요?",
    options: ["전기 사용량", "재활용 종이 양", "바다의 염분", "나무의 성장"],
    answer: 0,
    explanation: "불필요한 조명을 끄면 전기 사용량을 줄일 수 있습니다."
  }
];

const $ = (selector) => document.querySelector(selector);
const storageKey = "ourPlanetMissionCount";
let missionIndex = 0;
let completedMissions = Number(localStorage.getItem(storageKey) || 0);
let quizIndex = 0;
let quizScore = 0;
let answered = false;

function renderMission() {
  const mission = missions[missionIndex];
  $("#missionTitle").textContent = mission.title;
  $("#missionDescription").textContent = mission.description;
  $(".mission-illustration").textContent = mission.icon;
  $("#missionFeedback").textContent = "";
  $("#completeMission").disabled = false;
  $("#completeMission").innerHTML = '미션 완료하기 <span aria-hidden="true">✓</span>';
}

function updateMissionProgress() {
  $("#missionCount").textContent = completedMissions;
  $("#progressFill").style.width = `${Math.min(completedMissions * 10, 100)}%`;

  let stage = "🌱";
  let caption = "새싹 단계";
  if (completedMissions >= 10) {
    stage = "🌳";
    caption = "푸른 숲 단계";
  } else if (completedMissions >= 5) {
    stage = "🌿";
    caption = "어린 나무 단계";
  } else if (completedMissions >= 2) {
    stage = "🌱";
    caption = "튼튼한 새싹 단계";
  }
  $("#treeStage").textContent = stage;
  $("#treeCaption").textContent = caption;
}

$("#completeMission").addEventListener("click", () => {
  completedMissions += 1;
  localStorage.setItem(storageKey, String(completedMissions));
  updateMissionProgress();
  $("#missionFeedback").textContent = "미션 완료! 오늘의 작은 실천을 기록했어요.";
  $("#completeMission").disabled = true;
  $("#completeMission").textContent = "완료했어요 ✓";
});

$("#nextMission").addEventListener("click", () => {
  missionIndex = (missionIndex + 1) % missions.length;
  renderMission();
});

function renderQuiz() {
  const question = quizQuestions[quizIndex];
  answered = false;
  $("#quizQuestion").textContent = question.question;
  $("#quizProgress").textContent = `문제 ${quizIndex + 1} / ${quizQuestions.length}`;
  $("#quizProgressFill").style.width = `${((quizIndex + 1) / quizQuestions.length) * 100}%`;
  $("#quizFeedback").textContent = "";
  $("#nextQuestion").disabled = true;
  $("#nextQuestion").textContent = quizIndex === quizQuestions.length - 1 ? "처음부터 다시 ↻" : "다음 문제 →";

  const optionsContainer = $("#quizOptions");
  optionsContainer.replaceChildren();
  question.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "quiz-option";
    button.textContent = `${index + 1}. ${option}`;
    button.addEventListener("click", () => answerQuiz(index));
    optionsContainer.appendChild(button);
  });
  $("#quizScore").textContent = `현재 점수 ${quizScore}점`;
}

function answerQuiz(selectedIndex) {
  if (answered) return;
  answered = true;
  const question = quizQuestions[quizIndex];
  const options = [...document.querySelectorAll(".quiz-option")];
  options.forEach((button, index) => {
    button.disabled = true;
    if (index === question.answer) button.classList.add("correct");
    if (index === selectedIndex && selectedIndex !== question.answer) button.classList.add("incorrect");
  });

  if (selectedIndex === question.answer) {
    quizScore += 1;
    $("#quizFeedback").textContent = `정답입니다! ${question.explanation}`;
  } else {
    $("#quizFeedback").textContent = `아쉽지만 오답이에요. ${question.explanation}`;
  }
  $("#quizScore").textContent = `현재 점수 ${quizScore}점`;
  $("#nextQuestion").disabled = false;
}

$("#nextQuestion").addEventListener("click", () => {
  if (quizIndex === quizQuestions.length - 1) {
    quizIndex = 0;
    quizScore = 0;
  } else {
    quizIndex += 1;
  }
  renderQuiz();
});

renderMission();
updateMissionProgress();
renderQuiz();
