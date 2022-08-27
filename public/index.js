async function main() {
  const timeChartCanvas = document.querySelector("#time-chart");
  const highestPriceChartCanvas = document.querySelector(
    "#highest-price-chart"
  );
  const averagePriceChartCanvas = document.querySelector(
    "#average-price-chart"
  );
  //   const response = await fetch("https://api.twelvedata.com/time_series?symbol=GME,MSFT,DIS,BNTX&interval=30min&apikey=44daff06ebb04fd7a040c77d1a56e9b4");
  //   const result = await response.json();

  // let GME = result.GME;
  // let MSFT = result.MSFT;
  // let DIS = result.DIS;
  // let BNTX = result.BNTX;

  //   const { GME, MSFT, DIS, BNTX } = result;
  const { GME, MSFT, DIS, BNTX } = mockData;

  const stocks = [GME, MSFT, DIS, BNTX];

  // Activity Incorrect. No reverse() needed in dataset. Only this line.
  stocks.forEach((stock) => stock.values.reverse());

  // Stock Price Over Time
  new Chart(timeChartCanvas.getContext("2d"), {
    type: "line",
    data: {
      labels: stocks[0].values.map((value) => value.datetime),
      datasets: stocks.map((stock) => ({
        label: stock.meta.symbol,
        data: stock.values.map((value) => parseFloat(value.high)),
        backgroundColor: getColor(stock.meta.symbol),
        borderColor: getColor(stock.meta.symbol),
      })),
    },
  });

  // Highest Stock Price
  new Chart(highestPriceChartCanvas.getContext("2d"), {
    type: "bar",
    data: {
      labels: stocks.map(stock => stock.meta.symbol),
      datasets: [{
        label: 'Highest',
        data: stocks.map(stock => calcHighest(stock.values)),
        backgroundColor: stocks.map(stock => getColor(stock.meta.symbol)),
        borderColor: stocks.map(stock => getColor(stock.meta.symbol)),
    }],
    },
  });

  // Average Stock Price
  new Chart(averagePriceChartCanvas.getContext("2d"), {
    type: "pie",
    data: {
      labels: stocks.map(stock => stock.meta.symbol),
      datasets: [{
          data: stocks.map(stock => calcAverage(stock.values)),
          backgroundColor: stocks.map(stock => getColor(stock.meta.symbol)),
          borderColor: stocks.map(stock => getColor(stock.meta.symbol)),
        },
      ],
    },
  });

  // Get Color Function
  function getColor(stock) {
    if (stock === "GME") {
      return "rgba(61, 161, 61, 0.7)";
    }
    if (stock === "MSFT") {
      return "rgba(209, 4, 25, 0.7)";
    }
    if (stock === "DIS") {
      return "rgba(18, 4, 209, 0.7)";
    }
    if (stock === "BNTX") {
      return "rgba(166, 43, 158, 0.7)";
    }
  }

  // Calculate the Highest Value
  function calcHighest(values) {
    let highNum = 0;
    values.forEach((value) => {
      if (parseFloat(value.high) > highNum) {
        highNum = parseFloat(value.high);
      }
    });
    return highNum;
  }

  // Calculate the Average Value
  function calcAverage(values) {
    let total = 0;
    values.forEach((value) => {
      total += parseFloat(value.high);
    });
    return total / values.length;
  }
}

main();
