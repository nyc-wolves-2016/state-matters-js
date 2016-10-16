function setupPieChart() {

  const CHART = document.getElementById("voteChart");

  Chart.defaults.global.responsive = true;
  Chart.defaults.global.defaultFontSize = 20;
  Chart.defaults.global.defaultFontColor = "white";


  var data = {
    labels: [
        "Yay",
        "Nay"
    ],
    datasets: [
        {
            data: [300, 100],
            backgroundColor: [
                "red",
                "blue"
            ],
            hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB"
            ]
        }
      ]
  };

  let lineChart = new Chart(CHART, {
    type: "pie",
    data: data
  });

}

export default setupPieChart;
