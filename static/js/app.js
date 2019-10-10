var svgWidth = 960;
var svgHeight = 500;
// set the dimensions and margins of the graph
var margin = { top: 20, right: 40, bottom: 60, left: 100 };
width = svgWidth - margin.left - margin.right;
height = svgHeight - margin.top - margin.bottom;
// append the svg object to the body of the page
var svg = d3.select("#line")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
var shipurl = '/shipprofit';
d3.json(shipurl).then(function (data) {
  console.log(data);
  data.forEach(function (d) {
    d[0] = d3.timeParse("%Y-%m")(d[0]);
    // d[1] = +d[1];
    console.log(d[0])
  });
  // Add X axis --> it is a date format
  var x = d3.scaleTime()
    .domain(d3.extent(data, d => d[0]))
    .range([0, width]);
  // Text label for the x axis
  svg.append("text")
    .attr("x", 20)
    .attr("y", 240)
    .style("text-anchor", "middle")
    .text("Profit");
  // Add Y axis
  var y = d3.scaleLinear()
    .domain(d3.extent(data, d => d[1]))
    .range([height, 0]);
  // Text label for the y axis
  svg.append("text")
    .attr("x", width / 1.60)
    .attr("y", height + margin.bottom)
    .style("text-anchor", "middle")
    .text("Date");
  // Text title
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", 15)
    .style("title", "middle")
    .text("Line Graph comparing profit and returns");
  chartGroup.append("g")
    .classed('axis', true)
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));
  chartGroup.append("g")
    .classed('axis', true)
    .call(d3.axisLeft(y));
  // Add the line
  chartGroup.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x(function (d) { return x(d[0]) })
      .y(function (d) { return y(d[1]) })
    )

});
/// jeffs choloropleth
Plotly.d3.json('/stateprofit', function (jsonData) {
  console.log('jsonData:', jsonData);
  var data = [{
    type: 'choropleth',
    locationmode: 'USA-states',
    locations: jsonData['abbreviation'],
    z: jsonData['profit'],
    text: jsonData['State'],
    autocolorscale: false,
    zmin: -26000,
    zmax: 77000,
    colorscale: [
      [0, 'rgb(255,0,0)'], [0.25, 'rgb(255,255,255)'],[1, 'rgb(0,0,255)']
  ],
    colorbar: {
      title: 'USD',
      thickness: 30,
      tickprefix: '$',
  },
  }];
  var layout = {
    title: 'Profit & Loss by State<br>2013 - 2017',
    geo: {
      scope: 'usa',
      countrycolor: 'rgb(255, 255, 255)',
      showland: true,
      landcolor: 'rgb(217, 217, 217)',
      showlakes: true,
      lakecolor: 'rgb(255, 255, 255)',
      subunitcolor: 'rgb(255, 255, 255)',
      lonaxis: {},
      lataxis: {}
    }
  };
  Plotly.plot("jeffs-map", data, layout, {
    showLink: false
  });
});
