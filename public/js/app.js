// public/js/app.js

// Vue App
const App = Vue.component("app", {
  data() {
    return {
      articleStats: [],
      chart: {},
    };
  },
  async created() {
    // Get article stats
    const url = new URL(
      document.location.protocol +
        "//" +
        document.location.host +
        "/article_stats"
    );
    const articleStatsResp = await fetch(url);
    let articleStats = await articleStatsResp.json();

    // Assign random color to article
    const randomColor = function () {
      var r = Math.floor(Math.random() * 255);
      var g = Math.floor(Math.random() * 255);
      var b = Math.floor(Math.random() * 255);
      return "rgb(" + r + "," + g + "," + b + ")";
    };
    articleStats.forEach((article) => {
      article.color = randomColor();
    });
    this.articleStats = articleStats;

    // Find labels
    let labels = [];
    let minDate = "9"; // This will work for the next ~8000 years
    this.articleStats.forEach((article) => {
      if (article.stats[0].date < minDate) {
        minDate = article.stats[0].date;
        labels = article.stats.map((stat) => {
          return stat.date;
        });
      }
    });

    // Get datasets
    let datasets = this.articleStats.map((article) => {
      let data = [];
      // Fill with 0 until first view
      for (let date of labels) {
        if (date >= article.stats[0].date) {
          break;
        }
        data.push(0);
      }
      // Append views
      data.push(
        ...article.stats.map((stat) => {
          return stat.views;
        })
      );
      //   let color = randomColor();
      return {
        label: article.title,
        data: data,
        fill: false,
        borderColor: article.color,
        backgroundColor: article.color,
      };
    });
    let chartConfig = {
      type: "line",
      data: {
        datasets: datasets,
        labels: labels,
      },
      options: {
        responsive: true,
        // aspectRatio: 3,
        title: {
          display: true,
          text: "Dev.to Article Stats",
        },
        tooltips: {
          mode: "index",
          intersect: false,
        },
        hover: {
          mode: "nearest",
          intersect: true,
        },
        scales: {
          xAxes: [
            {
              display: true,
              scaleLabel: {
                display: true,
                labelString: "Date",
              },
            },
          ],
          yAxes: [
            {
              display: true,
              scaleLabel: {
                display: true,
                labelString: "Views",
              },
            },
          ],
        },
      },
    };
    // console.log("Add chart");
    let ctx = document.getElementById("chart").getContext("2d");
    this.chart = new Chart(ctx, chartConfig);
  },

  template: `
  <div id="app">
    <div>
        <canvas id="chart"></canvas>
    </div>
    <table id="articles">
      <tr>
        <th></th>
        <th>Article</th>
        <th>Views</th>
        <th>Reactions</th>
      </tr>
      <tr v-for="article in articleStats">
        <td :style="{'background-color': article.color, width: '10px'}"></td>
        <td><a :href=article.url class="title">{{ article.title }}</a></td>
        <td>{{ article.stats[article.stats.length - 1].views }}</td>
        <td>{{ article.stats[article.stats.length - 1].reactions }}</td>
      </tr>
    </table>
  </div>
      `,
});

// Mount Vue app
var app = new Vue({
  render: (h) => h(App),
}).$mount("#app");
