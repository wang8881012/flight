// saveData.js
const passengers = [
  {
    name: "Wang Xiao Ming",
    gender: "女性",
    id: "F222222222",
    passport: "11112462",
    birth: "1999/01/01",
    expire: "2028/6/10",
    issueCountry: "中華民國(台灣)",
    nationality: "中華民國(台灣)"
  },
  {
    name: "Chen Mei Mei",
    gender: "女性",
    id: "A123456789",
    passport: "2223344",
    birth: "1990/05/05",
    expire: "2030/02/10",
    issueCountry: "中華民國(台灣)",
    nationality: "中華民國(台灣)"
  }
];

localStorage.setItem("passengers", JSON.stringify(passengers));
console.log("✅ 測試旅客資料已儲存到 localStorage");