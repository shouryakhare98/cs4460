function golf() {
    // Read drive distance data
    d3.csv("./data/golf_drive_distance_yards.csv").then(function(data) {

        d3.selectAll("svg > *").remove();

        // Get svg and it's dimensions
        var svg = d3.select("#svg_div").select("svg");
        var graphG = svg.append("g").attr("class", "graphg");
        var svgWidth = +svg.attr("width");
        var svgHeight = +svg.attr("height");

        // Define margins and graph dimensions
        var margin = {top:40, left:47, bottom:40, right:30}
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

        // Create scales for axes
        var xScale = d3.scaleTime()
            .domain(d3.extent(data, function(d) {return d.year;}))
            .range([0, width])
            .nice();

        var yScale = d3.scaleLinear()
            .domain([250,310])
            .range([height, 0])
            .nice();

        // Draw axes and axes lables
        var xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
        var xAxisG = graphG.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(" + [margin.left,svgHeight - margin.bottom] + ")");

        xAxisG.transition()
            .duration(1000)
            .call(xAxis);

        xAxisG.append("text")
            .attr("class", "x label")
            .attr("transform", "translate(412,35)")
            .text("Year");

        var yAxis = d3.axisLeft(yScale);
        var yAxisG = graphG.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + [margin.left,margin.bottom] + ")");

        yAxisG.transition()
            .duration(1000)
            .call(yAxis);

        yAxisG.append("text")
            .attr("class", "y label")
            .attr("transform", "translate(-33,275) rotate(-90)")
            .text("Average Drive Distance (Yards)");

        // Plot golf innovation
        plotInnovations("./data/golf_innovations.json");

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

        // Method to plot innovation data from JSON file
        function plotInnovations(sourceFile) {
            d3.json(sourceFile).then(function(innovations) {
                var innov_line = graphG.selectAll(".innovations")
                    .data(innovations)
                    .enter()
                    .append("g")
                    .attr("class", "innovations");

                // Render flag image for each innovation
                innov_line.append("svg:image")
                    .attr("x", -200)
                    .attr("y", function(d) {
                        return margin.top + 20;
                    })
                    .transition()
                    .duration(1000)
                    .attr("x", function(d) {
                        return xScale(d.year) + margin.left - 3;
                    })
                    .attr("height", "600px")
                    .attr("xlink:href", "images/golf_flag.png");

                // Create tooltip for innovation
                var tooltip = d3.select("#graphic").select("#tooltip")
                if (tooltip.empty()) {
                    tooltip = d3.select("#graphic")
                        .append("div")
                        .attr("id", "tooltip");
                }

                innov_line.on("mouseover", function(d) {
                    tooltip.style('left', (d3.event.pageX + 10)+ 'px')
                        .style('top', (d3.event.pageY - 25) + 'px')
                        .style('display', 'inline-block')
                        .html(`<strong>${d.year}</strong><br />${d.name}`);
                }).on("mouseout", function(d) {
                    tooltip.style("display", "none");
                }).on("mousemove", function(d) {
                    tooltip.style('left', (d3.event.pageX + 10)+ 'px')
                        .style('top', (d3.event.pageY - 25) + 'px')
                        .style('display', 'inline-block')
                        .html(`<strong>${d.year}</strong>
                            <br />${d.name}`);
                });
            });
        }
    });
}
