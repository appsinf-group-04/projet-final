const mongoose = require("mongoose");
const { getBansOverTime, getBansByDay } = require("../src/database/stats");
const { populateUserDB, unpopulateUserDB } = require("../src/utils/populate");

describe("Stats", () => {

  let users = [];

  beforeAll(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/projet-final")
      .catch((err) => console.log(err));

    users = await populateUserDB(100);
  });

  afterAll(async () => {
    await unpopulateUserDB(users);

    await mongoose.connection.close();
  });

  test("Bans over time should be ok", async () => {
    const bansByDay = await getBansByDay();
    let sum = 0;

    for (const day of bansByDay) {
      sum += day.bans;
    }

    const bansOverTime = await getBansOverTime();

    expect(bansOverTime).toHaveLength(bansByDay.length);
    expect(bansOverTime[bansOverTime.length - 1].bans).toBe(sum);
  });
});
