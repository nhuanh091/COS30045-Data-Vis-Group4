import * as d3 from "d3";
import { addInteractions } from "../interaction/interaction";

export function drawLineChart(container, data) {
  d3.select(container).selectAll("*").remove();

  const width = container.clientWidth || 600;
  const height = 350;
  const margin = { top: 50, right: 100, bottom: 50, left: 60 };

  const svg = d3.select(container)
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const chart = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // ✅ Define correct month order
  const monthOrder = [
    "Jan 2023","Feb 2023","Mar 2023","Apr 2023","May 2023","June 2023",
    "July 2023","Aug 2023","Sept 2023","Oct 2023","Nov 2023","Dec 2023",
    "Jan 2024","Feb 2024","Mar 2024","Apr 2024","May 2024","June 2024",
    "July 2024","Aug 2024","Sept 2024","Oct 2024","Nov 2024","Dec 2024"
  ];

  // Group data by age group
  const grouped = d3.group(data, d => d.age_group);

  // Sort each group
  grouped.forEach(values => {
    values.sort(
      (a, b) => monthOrder.indexOf(a.MONTH) - monthOrder.indexOf(b.MONTH)
    );
  });

  // X scale (STRING)
  const x = d3.scalePoint()
    .domain(monthOrder)
    .range([0, innerWidth])
    .padding(0.5);

  // Y scale
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => +d.value)])
    .nice()
    .range([innerHeight, 0]);

  // Color
  const color = d3.scaleOrdinal()
    .domain([...grouped.keys()])
    .range(d3.schemeCategory10);

  // Axes
  chart.append("g")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(
      d3.axisBottom(x)
        .tickValues(monthOrder.filter((d, i) => i % 3 === 0)) // show every 3 months
    );

  chart.append("g")
    .call(d3.axisLeft(y));

  // Labels
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .text("Positive Drug Tests by Age Group (2023–2024)");

  svg.append("text")
    .attr("x", width / 2)
    .attr("y", height - 5)
    .attr("text-anchor", "middle")
    .text("Month");

  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", 15)
    .attr("text-anchor", "middle")
    .text("Number of Positive Tests");

  // Line generator
  const line = d3.line()
    .x(d => x(d.MONTH))
    .y(d => y(+d.value));
    console.log("Invalid MONTH:", 
    data.filter(d => !monthOrder.includes(d.MONTH))
    );

  // Draw lines
  const lines = chart.selectAll(".line")
    .data([...grouped])
    .enter()
    .append("path")
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", d => color(d[0]))
    .attr("stroke-width", 2)
    .attr("d", d => line(d[1]));

  // Interactions
  addInteractions(chart, data, lines, x, y, color, innerWidth, innerHeight, monthOrder);
}