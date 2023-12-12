function createAccountsByDayGraph(selector, data) {
  const element = document.getElementById(selector);
  new Chart(
    element,
    {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'Accounts created',
            data: data.map((i) => ({ x: i.date, y: i.count })),
          }
        ]
      }
    }
  );
}

function createOverTimeGraph(selector, data1, data2) {

  // merge data1 and data2
  fillMissingDates(data1, data2);

  // data3 is the substraction of data2 by data1;
  let data3 = [];
  for (let i = 0; i < data2.length; i++) {
    let date = data2[i].date;
    let count = data2[i].count - data1[i].bans;

    data3.push({ date, count });
  }

  const element = document.getElementById(selector);
  new Chart(
    element,
    {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'Bans Over Time',
            data: data1.map(i => ({ x: i.date, y: i.bans })),
          },
          {
            label: 'Accounts Registered Over Time',
            data: data2.map((i) => ({ x: i.date, y: i.count })),
          },
          {
            label: 'Active Accounts Over Time',
            data: data3.map((i) => ({ x: i.date, y: i.count })),
          }
        ]
      }
    }
  );
}

function fillMissingDates(data1, data2) {
  // Extract all unique dates from both arrays
  const allDates = [...new Set([...data1.map(item => item.date), ...data2.map(item => item.date)])];

  // Sort the dates in ascending order
  allDates.sort((a, b) => {
    const dateA = a.split('/').reverse().join('-');
    const dateB = b.split('/').reverse().join('-');
    return new Date(dateA) - new Date(dateB);
  });

  // Function to get the nearest previous date
  function getNearestPreviousDate(date, array) {
    array.sort((a, b) => {
      const dateA = a.split('/').reverse().join('-');
      const dateB = b.split('/').reverse().join('-');
      return new Date(dateA) - new Date(dateB);
    });

    let targetDate = new Date(date.split('/').reverse().join('-'));

    let nearestDate = null;

    for (let i = array.length - 1; i >= 0; i--) {
      const itemDate = new Date(array[i].split('/').reverse().join('-'));

      if (itemDate <= targetDate) {
        nearestDate = itemDate;
        break;
      }
    }

    return nearestDate;
  }

  // Iterate through allDates and fill missing dates in data1 and data2
  allDates.forEach(date => {
    const data1Item = data1.find(item => item.date === date);
    const data2Item = data2.find(item => item.date === date);

    if (!data1Item) {
      const prevDate = getNearestPreviousDate(date, data1.map(item => item.date));

      if (!prevDate) {
        data1.push({ date, bans: 0 });
        return;
      }

      const prevValue = data1.find(item => item.date === formatDate(prevDate));
      data1.push({ date, bans: prevValue.bans || 0 });
    }

    if (!data2Item) {
      const prevDate = getNearestPreviousDate(date, data2.map(item => item.date));

      if (!prevDate) {
        data2.push({ date, count: 0 });
        return;
      }

      const prevValue = data2.find(item => item.date === formatDate(prevDate));
      data2.push({ date, count: prevValue.count || 0 });
    }
  });

  // Sort the arrays by date if needed
  data1.sort((a, b) => {
    const dateA = a.date.split('/').reverse().join('-');
    const dateB = b.date.split('/').reverse().join('-');
    return new Date(dateA) - new Date(dateB);
  });
  data2.sort((a, b) => {
    const dateA = a.date.split('/').reverse().join('-');
    const dateB = b.date.split('/').reverse().join('-');
    return new Date(dateA) - new Date(dateB);
  });
}

function formatDate(date) {
  let day = date.getDate();
  let month = date.getMonth();
  const year = date.getFullYear();

  if (day < 10) {
    day = `0${day}`;
  }

  month += 1;

  if (month < 10) {
    month = `0${month}`;
  }

  return `${day}/${month}/${year}`;
}

let delayTimer;
let search = document.getElementById("search-bar");

function handleSearch() {
  clearTimeout(delayTimer);


  delayTimer = setTimeout(() => {
    if (search.value.length > 0) {
      const currentURL = new URL(window.location.href);
      currentURL.searchParams.set("q", search.value);
      currentURL.hash = "search-bar";
      window.location.href = currentURL.toString();
    } else {
      const newURL = new URL(window.location.href);
      newURL.searchParams.delete("q");
      newURL.hash = "search-bar";
      window.location.href = newURL.toString();
    }
  }, 800);
}
