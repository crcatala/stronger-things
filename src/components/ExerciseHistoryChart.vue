<script>
import { Line } from "vue-chartjs";

// const chartColors = {
//   red: "rgb(255, 99, 132)",
//   orange: "rgb(255, 159, 64)",
//   yellow: "rgb(255, 205, 86)",
//   green: "rgb(75, 192, 192)",
//   blue: "rgb(54, 162, 235)",
//   purple: "rgb(153, 102, 255)",
//   grey: "rgb(201, 203, 207)"
// };

export default {
  name: "ExerciseHistoryChart",
  extends: Line,
  // props: ['data', 'options'],
  props: ["xAxisData", "chartData"],
  data() {
    return {
      data: {
        // labels: [
        //   new Date("2018-01-01"),
        //   new Date("2018-01-02"),
        //   new Date("2018-01-03"),
        //   new Date("2018-01-04"),
        //   new Date("2018-01-05")
        // ],
        // labels: this.chartData,
        datasets: [
          {
            label: "Estimated 1RM",
            lineTension: 0,
            backgroundColor: "#f87979",
            // backgroundColor: "#3da9fc",
            // data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 20, 12, 11]
            data: this.chartData
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          text: "Chart.js Time Scale"
        },
        scales: {
          xAxes: [
            {
              type: "time",
              time: {
                // format: timeFormat,
                // round: 'day'
                tooltipFormat: "ll HH:mm"
              },
              scaleLabel: {
                display: true,
                labelString: "Date"
              }
            }
          ],
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "Weight (lbs)"
              }
            }
          ]
        }
      }
    };
  },
  mounted() {
    this.renderChart(this.data, this.options);
  }
};
</script>

<style>
</style>
