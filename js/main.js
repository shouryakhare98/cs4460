
// Get svg and it's dimensions
var svg = d3.select("#main").select("svg");
var graphG = svg.append("g").attr("class", "line-plot");
var svgWidth = +svg.attr("width");
var svgHeight = +svg.attr("height");

// Define margins and graph dimensions
var margin = {top:40, left:20, bottom:20, right:30}
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Get color scale
var tournaments = ["us-open", "pga-champ", "masters", "the-open"];
var colorScale = d3.scaleOrdinal(d3.schemeCategory10)
    .domain(tournaments);

// Create date parser
var parseDate = d3.timeParse('%Y');

// Read golf data
d3.csv("./data/golf_drive_distance_yards.csv").then(function(data) {

    // Parse date for each drive average
    data.forEach(function(drive) {
        drive.year = parseDate(drive.year);
    });

    // Create scales for axes
    var xScale = d3.scaleTime()
        .domain([1980,2019])
        .range([0, width])
        .nice();

    var yScale = d3.scaleLinear()
        .domain([0,350])
        .range([height, 0])
        .nice();

    // Draw axes
    var xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    graphG.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(30, 570)")
        .call(xAxis);

    var yAxis = d3.axisLeft(yScale);
    graphG.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(30,20)")
        .call(yAxis);

    // Draw all tournament drives
    tournaments.forEach(function(tournament) {
        var lineInterpolate = d3.line()
            .x(function(d) { return xScale(d.year); })
            .y(function(d) { return yScale(+d[tournament]); });

        var line = graphG.append("path")
            .datum(data)
            .attr("d", lineInterpolate)
            .attr("stroke", function(d) { return colorScale(tournament); })
            .attr("stroke-width", 4)
            .attr("fill", "none");
    });
});
