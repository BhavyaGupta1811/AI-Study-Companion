const Filter = require("bad-words");

const filter = new Filter();

const offTopicWords = [
  "instagram",
  "insta",
  "facebook",
  "snapchat",
  "whatsapp",
  "netflix",
  "movie",
  "movies",
  "anime",
  "series",
  "reel",
  "reels",
  "meme",
  "memes",
  "pubg",
  "bgmi",
  "valorant",
  "freefire",
  "free fire",
  "cod",
  "gaming",
  "game",
  "party",
  "club",
  "date",
  "dating",
  "crush",
  "boyfriend",
  "girlfriend",
  "love",
  "ipl",
  "football",
  "cricket",
];

const studyWords = [
  "study",
  "revision",
  "revise",
  "chapter",
  "notes",
  "lecture",
  "assignment",
  "homework",
  "exam",
  "test",
  "quiz",
  "question",
  "answer",
  "doubt",
  "practice",
  "subject",
  "physics",
  "chemistry",
  "math",
  "mathematics",
  "biology",
  "english",
  "history",
  "geography",
  "economics",
  "computer",
  "coding",
  "programming",
  "java",
  "javascript",
  "python",
  "react",
  "mern",
  "dsa",
  "os",
  "dbms",
  "cn",
  "oops",
  "cgpa",
  "semester",
  "gate",
  "jee",
  "neet",
];

function containsAny(text, words) {
  return words.some((word) => text.includes(word));
}

const moderateMessage = (message = "") => {
  const text = message.trim().toLowerCase();

  if (!text) {
    return {
      allowed: false,
      reason: "Message cannot be empty.",
    };
  }

  if (text.length > 500) {
    return {
      allowed: false,
      reason: "Message cannot exceed 500 characters.",
    };
  }

  if (filter.isProfane(text)) {
    return {
      allowed: false,
      reason: "Please avoid inappropriate language.",
    };
  }

  if (/(.)\1{9,}/.test(text)) {
    return {
      allowed: false,
      reason: "Spam message detected.",
    };
  }

  if (containsAny(text, offTopicWords) && !containsAny(text, studyWords)) {
    return {
      allowed: false,
      reason: "FocusFlow chat is only for study-related discussions.",
    };
  }
  return {
    allowed: true,
  };
};

module.exports = moderateMessage;
