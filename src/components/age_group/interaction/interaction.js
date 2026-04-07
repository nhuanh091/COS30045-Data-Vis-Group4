import * as d3 from "d3";

export function addInteractions(
  chart,
  data,
  lines,
  x,
  y,
  color,
  width,
  height,
  monthOrder
) {
  let activeGroup = null;

  // Remove old tooltip if exists
  d3.select("body").selectAll(".tooltip").remove();

  // Tooltip
  const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background", "white")
    .style("padding", "6px")
    .style("border", "1px solid #ccc")
    .style("font-size", "12px")
    .style("pointer-events", "none")
    .style("display", "none");

  // ================= CLICK INTERACTION =================
  lines.on("click", function (event, d) {
    const group = d[0];

    if (activeGroup === group) {
      activeGroup = null;
      lines.attr("opacity", 1);
      chart.selectAll(".dot").remove();
    } else {
      activeGroup = group;

      lines.attr("opacity", l => (l[0] === group ? 1 : 0.2));

      chart.selectAll(".dot").remove();

      chart.selectAll(".dot")
        .data(d[1])
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", d => x(d.MONTH))
        .attr("cy", d => y(+d.value))
        .attr("r", 4)
        .attr("fill", color(group));
    }
  });

  // ================= HOVER + TOOLTIP =================
  chart.selectAll(".overlay").remove();

  chart.append("rect")
    .attr("class", "overlay")
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "transparent")
    .on("mousemove", function (event) {
      const xPos = d3.pointer(event)[0];

      // Find closest month
      const closestMonth = monthOrder.reduce((a, b) => {
        return Math.abs(x(b) - xPos) < Math.abs(x(a) - xPos) ? b : a;
      });

      // Highlight vertical area
      chart.selectAll(".month-highlight").remove();

      chart.append("rect")
        .attr("class", "month-highlight")
        .attr("x", x(closestMonth) - 10)
        .attr("width", 20)
        .attr("height", height)
        .attr("fill", "#081e3e")
        .attr("opacity", 0.05);

      // Get data for that month
      const sameMonthData = data.filter(d => d.MONTH === closestMonth);

      // Tooltip content
      tooltip.style("display", "block")
        .html(`
          <strong>${closestMonth}</strong><br/>
          ${sameMonthData
            .map(d => `${d.age_group}: ${d.value}`)
            .join("<br/>")}
        `)
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 20 + "px");
    })
    .on("mouseout", () => {
      tooltip.style("display", "none");
      chart.selectAll(".month-highlight").remove();
    });
}