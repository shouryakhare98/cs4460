
// Get svg and it's dimensions
var svg = d3.select("#main").select("svg");
var graphG = svg.append("g").attr("class", "line-plot");
var svgWidth = +svg.attr("width");
var svgHeight = +svg.attr("height");

// Define margins and graph dimensions
var margin = {top:40, left:30, bottom:20, right:30}
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Get color scale
var tournaments = ["us_open", "pga_champ", "masters", "the_open"];
var colorScale = d3.scaleOrdinal(d3.schemeCategory10)
    .domain(tournaments);

// Color checkbox labels based on color scale
tournaments.forEach(function(tournament) {
    d3.select("#" + tournament + "_label")
        .style("color", function(d) { return colorScale(tournament); })
});

// Create date parser
var parseDate = d3.timeParse('%Y');

// Read golf data
d3.csv("./data/golf_drive_distance_yards.csv").then(function(data) {

    // Create scales for axes
    var xScale = d3.scaleTime()
        .domain(d3.extent(data, function(d) {return d.year;}))
        .range([0, width])
        .nice();

    var yScale = d3.scaleLinear()
        .domain([250,310])
        .range([height, 0])
        .nice();

    // Draw axes
    var xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    graphG.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(30,570)")
        .call(xAxis);

    var yAxis = d3.axisLeft(yScale);
    graphG.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + [margin.left,margin.bottom] + ")")
        .call(yAxis);

    // Draw tournamets and add callbacks for checkbox updates
    tournaments.forEach(function(tournament) {
        if (d3.select("#" + tournament).property("checked")) {
            draw(tournament);
        }

        d3.select("#" + tournament).on("change", function() {
            update(tournament);
        })
    });

    // Function to draw lines based on list of tournaments given
    function draw(tournament) {

        // Filter -1 values
        var filteredData = data.filter(function(d) {
            return d[tournament] != -1;
        });

        var lineInterpolate = d3.line()
            .x(function(d) { return xScale(d.year); })
            .y(function(d) { return yScale(+d[tournament]); });

        var line = graphG.append("path")
            .datum(filteredData)
            .attr("transform", "translate(" + [margin.left,margin.bottom] + ")")
            .transition()
            .duration(1000)
            .attr("d", lineInterpolate)
            .attr("stroke", function(d) { return colorScale(tournament); })
            .attr("stroke-width", 4)
            .attr("fill", "none")
            .attr("id", tournament + "_path");
    }

    // Function to update line graph on checkbox updates
    function update(tournament) {
        if (d3.select("#" + tournament).property("checked")) {
            draw(tournament);
        } else {
            graphG.selectAll("#" + tournament + "_path")
                .transition()
                .duration(1000)
                .attr("stroke-width", 0)
                .remove();
        }
    }
});
