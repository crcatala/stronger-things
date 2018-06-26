<script>
import { Line } from "vue-chartjs";

export default {
  name: "ExerciseHistoryChart",
  extends: Line,
  // props: ['data', 'options'],
  props: ["xAxisData", "chartData"],
  data() {
    return {
      data: {
        datasets: [
          {
            label: "Estimated 1RM",
            lineTension: 0,
            backgroundColor: "#f87979",
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
