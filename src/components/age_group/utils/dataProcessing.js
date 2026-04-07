import * as d3 from "d3";

export function aggregateByMonthAndAge(data) {
  return Array.from(
    d3.rollup(
      data,
      v => d3.sum(v, d => +d.COUNT),
      d => d.MONTH?.trim(),
      d => d.AGE_GROUP
    ),
    ([MONTH, ageMap]) =>
      Array.from(ageMap, ([age_group, value]) => ({
        MONTH,
        age_group,
        value
      }))
  ).flat().filter(d => d.MONTH && d.age_group && !isNaN(d.value));
}