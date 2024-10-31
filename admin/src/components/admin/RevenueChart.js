import React from "react";
import { Line } from "react-chartjs-2";

const RevenueChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: "Revenue",
        data: data.map(item => item.total),
        fill: false,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  };

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        }
      },
      y: {
        title: {
          display: true,
          text: 'Revenue',
        }
      }
    },
  };

  return <Line data={chartData} options={options} />;
};

export default RevenueChart;
