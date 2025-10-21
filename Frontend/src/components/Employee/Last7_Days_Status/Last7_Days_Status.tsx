import React from "react";
import ReactApexChart from "react-apexcharts";
import "./Last7_Days_Status.css";

interface DailyAttendance {
  day: string; // YYYY-MM-DD
  hoursWorked: number; // fractional hours
}

interface Last7_Days_StatusProps {
  data: DailyAttendance[];
}

const Last7_Days_Status: React.FC<Last7_Days_StatusProps> = ({ data }) => {
  const maxHours = Math.max(...data.map((d) => d.hoursWorked), 8);

  const series = [
    {
      name: "Hours Worked",
      data: data.map((d) => ({
        x: d.day,
        y: parseFloat(d.hoursWorked.toFixed(2)),
        goals: [
          {
            name: "Expected",
            value: 8,
            strokeHeight: 4,
            strokeColor: "#775DD0",
          },
        ],
      })),
    },
  ];

  const options: ApexCharts.ApexOptions = {
    chart: { type: "bar", height: 300, toolbar: { show: false } },
    plotOptions: { bar: { columnWidth: "50%" } },
    colors: ["#0115a9ff"],
    dataLabels: { enabled: false },
    legend: {
      show: true,
      showForSingleSeries: true,
      customLegendItems: ["Hours Worked", "Expected"],
      markers: { fillColors: ["#0115a9ff", "#775DD0"] },
    },
    xaxis: {
      categories: data.map((d) => d.day),
      labels: { rotate: -45, rotateAlways: true, style: { fontSize: "12px", colors: "#333" } },
    },
    yaxis: {
      min: 0,
      max: Math.ceil(maxHours) + 1,
      tickAmount: Math.ceil(maxHours) + 1,
      labels: { formatter: (val) => val.toString() },
      title: { text: "Hours Worked" },
    },
    grid: { borderColor: "#eee" },
  };

  return (
    <div className="last7_days_status_container">
      <h3 className="title">Last 7 Days Status</h3>
      <ReactApexChart options={options} series={series} type="bar" height={300} />
    </div>
  );
};

export default Last7_Days_Status;
