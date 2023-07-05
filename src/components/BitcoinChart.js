
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { getBitcoinData } from "../utils/api";

export default function BitcoinChart() {
  const chartRef = useRef(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bitcoinData = await getBitcoinData();
        setData(bitcoinData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const margin = { top: 20, right: 20, bottom: 30, left: 50 };
      const width = 800 - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;

      const svg = d3
        .select(chartRef.current)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      const x = d3
        .scaleTime()
        .domain(d3.extent(data, (d) => new Date(d.date)))
        .range([0, width]);

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.price)])
        .range([height, 0]);

      const line = d3
        .line()
        .x((d) => x(new Date(d.date)))
        .y((d) => y(d.price));

      svg
        .append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);

      svg
        .append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

      svg.append("g").attr("class", "y-axis").call(d3.axisLeft(y));
    }
  }, [data]);

  return <div ref={chartRef}></div>;
}
