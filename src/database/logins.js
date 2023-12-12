const LoginsModel = require("../models/logins");
const { formatDate, getNextDay } = require("../utils/utils");

async function logNewLogin(date) {
  const today = formatDate(date || new Date());
  let document = await LoginsModel.findOne({ day: today });

  if (!document) {
    document = new LoginsModel({ day: today });
  }

  document.count += 1;
  await document.save();
}

async function getLoginsPerDay() {
  const logins = await LoginsModel.find({});

  logins.sort((a, b) => {
    const dateA = a.day.split("/").reverse().join("-");
    const dateB = b.day.split("/").reverse().join("-");
    return new Date(dateA) - new Date(dateB);
  });

  const final = [];

  for (let i = 0; i < logins.length - 1; i++) {
    let date = new Date(logins[i].day.split("/").reverse().join("-"));
    const nextArrayDate = new Date(
      logins[i + 1].day.split("/").reverse().join("-"),
    );

    final.push(logins[i]);

    while (getNextDay(date) < nextArrayDate) {
      date = getNextDay(date);
      final.push({ day: formatDate(date), count: 0 });
    }
  }

  if (logins.length > 0) {
    final.push(logins[logins.length - 1]);
  }

  return final;
}

module.exports = {
  logNewLogin,
  getLoginsPerDay,
};
