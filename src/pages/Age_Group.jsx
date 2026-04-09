import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { drawLineChart } from "../components/age_group/charts/lineChart";
import { aggregateByMonthAndAge } from "../components/age_group/utils/dataProcessing";
import "../styles/age_group.css";


const Age_Group = () => {
  const chartRef = useRef();

  const [data, setData] = useState([]);

  // Filters
  const [year, setYear] = useState("All");
  const [ageGroup, setAgeGroup] = useState("All");

  // Load data
  useEffect(() => {
  d3.csv("/data/positive_drug_cleaned.csv")
    .then(raw => {
      console.log("CSV columns:", Object.keys(raw[0]));

      const aggregated = aggregateByMonthAndAge(raw);

      console.log("Aggregated:", aggregated.slice(5));

      setData(aggregated);
    })
    .catch(err => console.error("CSV ERROR:", err));
  }, []);

  // Apply filters
  const filteredData = data.filter(d => {
    return (
      (year === "All" || d.MONTH.includes(year)) &&
      (ageGroup === "All" || d.age_group === ageGroup)
    );
  });

  // Draw chart
  useEffect(() => {
    if (filteredData.length > 0) {
      drawLineChart(chartRef.current, filteredData);
      
    }
  }, [filteredData]);

  return (
    <div className="parent">

      {/* ================= DIV 1: LINE CHART ================= */}
      <div className="div1">
        <h3>Positive Drug Tests by Age Group</h3>

        {/* Filters */}
        <div style={{ marginBottom: "10px" }}>
          <select onChange={e => setYear(e.target.value)}>
            <option value="All">All Years</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
          </select>

          <select onChange={e => setAgeGroup(e.target.value)}>
            <option value="All">All Age Groups</option>
            <option value="0-16">0-16</option>
            <option value="17-25">17-25</option>
            <option value="26-39">26-39</option>
            <option value="40-64">40-64</option>
            <option value="65+">65+</option>
          </select>
        </div>

        {/* Chart */}
        <div ref={chartRef}></div>
      </div>

      {/* Other sections */}
      <div className="div2">Other chart</div>
      <div className="div3">Other chart</div>
      <div className="div4">Other chart</div>

    </div>
  );
};

export default Age_Group;