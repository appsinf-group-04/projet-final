const UserModel = require("../models/user");
const PostModel = require("../models/post");
const { formatDate, getNextDay } = require("../utils/utils");

async function getAccountsCreatedByDay() {
  const users = await UserModel.find({});

  const accounts = users.map((user) => {
    const date = user.createdAt;
    const formattedDate = formatDate(date);
    return formattedDate;
  });

  const accountsByDay = [];
  for (const account of accounts) {
    const existingDay = accountsByDay.find((day) => day.date === account);

    if (existingDay) {
      existingDay.count += 1;
    } else {
      accountsByDay.push({ date: account, count: 1 });
    }
  }

  accountsByDay.sort((a, b) => {
    const dateA = a.date.split("/").reverse().join("-");
    const dateB = b.date.split("/").reverse().join("-");
    return new Date(dateA) - new Date(dateB);
  });

  const final = [];

  for (let i = 0; i < accountsByDay.length - 1; i++) {
    let date = new Date(accountsByDay[i].date.split("/").reverse().join("-"));
    const nextArrayDate = new Date(
      accountsByDay[i + 1].date.split("/").reverse().join("-"),
    );

    final.push(accountsByDay[i]);

    while (getNextDay(date) < nextArrayDate) {
      date = getNextDay(date);
      final.push({ date: formatDate(date), count: 0 });
    }
  }

  if (accountsByDay.length > 0) {
    final.push(accountsByDay[accountsByDay.length - 1]);
  }

  return final;
}

async function getAccountsOverTime() {
  const data = await getAccountsCreatedByDay();

  const accountsOverTime = [];
  let total = 0;

  for (const day of data) {
    total += day.count;
    accountsOverTime.push({ date: day.date, count: total });
  }

  return accountsOverTime;
}

async function getPostsCreatedByDay() {
  const posts = await PostModel.find({});

  const postsByDay = [];
  for (const post of posts) {
    const date = post.createdAt;
    const dateFormatted = formatDate(date);

    const existingDay = postsByDay.find((day) => day.date === dateFormatted);

    if (existingDay) {
      existingDay.count += 1;
    } else {
      postsByDay.push({ date: dateFormatted, count: 1 });
    }
  }

  postsByDay.sort((a, b) => {
    const dateA = a.date.split("/").reverse().join("-");
    const dateB = b.date.split("/").reverse().join("-");
    return new Date(dateA) - new Date(dateB);
  });

  const final = [];

  for (let i = 0; i < postsByDay.length - 1; i++) {
    let date = new Date(postsByDay[i].date.split("/").reverse().join("-"));
    const nextArrayDate = new Date(
      postsByDay[i + 1].date.split("/").reverse().join("-"),
    );

    final.push(postsByDay[i]);

    while (getNextDay(date) < nextArrayDate) {
      date = getNextDay(date);
      final.push({ date: formatDate(date), count: 0 });
    }
  }

  if (postsByDay.length > 0) {
    final.push(postsByDay[postsByDay.length - 1]);
  }

  return final;
}

async function getBansOverTime() {
  const data = await getBansByDay();

  const bansOverTime = [];
  let total = 0;

  for (const day of data) {
    total += day.bans;
    bansOverTime.push({ date: day.date, bans: total });
  }

  return bansOverTime;
}

async function getBansByDay() {
  const users = await UserModel.find({});

  const bans = users.filter((user) => {
    return user.ban.banned;
  });

  const bansByDay = [];
  for (const ban of bans) {
    const date = ban.ban.at;
    const dateFormatted = formatDate(date);

    const existingDay = bansByDay.find((day) => day.date === dateFormatted);

    if (existingDay) {
      existingDay.bans += 1;
    } else {
      bansByDay.push({ date: dateFormatted, bans: 1 });
    }
  }

  bansByDay.sort((a, b) => {
    const dateA = a.date.split("/").reverse().join("-");
    const dateB = b.date.split("/").reverse().join("-");
    return new Date(dateA) - new Date(dateB);
  });

  const final = [];

  for (let i = 0; i < bansByDay.length - 1; i++) {
    let date = new Date(bansByDay[i].date.split("/").reverse().join("-"));
    const nextArrayDate = new Date(
      bansByDay[i + 1].date.split("/").reverse().join("-"),
    );

    final.push(bansByDay[i]);

    while (getNextDay(date) < nextArrayDate) {
      date = getNextDay(date);
      final.push({ date: formatDate(date), bans: 0 });
    }
  }

  if (bansByDay.length > 0) {
    final.push(bansByDay[bansByDay.length - 1]);
  }

  return final;
}

module.exports = {
  getAccountsCreatedByDay,
  getPostsCreatedByDay,
  getBansOverTime,
  getBansByDay,
  getAccountsOverTime,
};
