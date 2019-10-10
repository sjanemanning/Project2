// Define SVG area dimensions
var svgWidth = 1100;
var svgHeight = 500;

 // set the dimensions and margins of the graph
 var chartMargin = { top: 20, right: 40, bottom: 60, left: 100 };
// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;
// Select body, append SVG area to it, and set the dimensions
var svg = d3.select("#bar")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);
// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);
var categoryurl = '/categoryprofit'; ``
//var shipurl = '/shipprofit';
d3.json(categoryurl).then(function (categorydata) {
  console.log(categorydata);
  categorydata.forEach(function (d1) {
    d1[0] = (d1[0]);
    console.log(d1[0])
    console.log(d1[1])
  });
  // Cast the hours value to a number for each piece of categorydata
  categorydata.forEach(function (d) {
    d[1] = +d[1];
  });
  // Configure a band scale for the horizontal axis with a padding of 0.1 (10%)
  var xBandScale = d3.scaleBand()
    .domain(categorydata.map(d => d[0]))
    .range([0, chartWidth])
    .padding(0.1);
  // Create a linear scale for the vertical axis.
  let hours = categorydata.map(d => d[1]);
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(hours)])
    .range([chartHeight, 0]);
  // Create two new functions passing our scales in as arguments
  // These will be used to create the chart's axes
  var bottomAxis = d3.axisBottom(xBandScale);
  var leftAxis = d3.axisLeft(yLinearScale).ticks(10);
  // Append two SVG group elements to the chartGroup area,
  // and create the bottom and left axes inside of them
  chartGroup.append("g")
    .call(leftAxis);
  chartGroup.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);
  // Create one SVG rectangle per piece of categorydata
  // Use the linear and band scales to position each rectangle within the chart
  chartGroup.selectAll(".bar")
    .data(categorydata)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr('stroke', 'red')
    .attr('opacity', 0.6)
    .attr("x", d => xBandScale(d[0]))
    .attr("y", d => yLinearScale(d[1]))
    .attr("width", xBandScale.bandwidth())
    .attr("height", d => chartHeight - yLinearScale(d[1]));

    svg.append("text")
    .attr("x", 20)
    .attr("y", 240)
    .style("text-anchor", "middle")
    .text("Profit");
    svg.append("text")
    .attr("x", chartWidth / 1.60)
    .attr("y", chartHeight + chartMargin.bottom)
    .style("text-anchor", "middle")
    .text("Products");
  // Text title
  svg.append("text")
    .attr("x", chartWidth / 2)
    .attr("y", 15)
    .style("title", "middle")
    .text("Bar Graph comparing profit and product");
});
