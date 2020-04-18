
// Object to hold golf data
var golf = {}

function lineGraph(zoomDict = null, redraw = false) {
    // Read drive distance data
    d3.csv("./data/golf_drive_distance_yards.csv").then(function(data) {

        // Get svg and it's dimensions
        var svg = d3.select("#svg_div").select("svg");
        if (svg.empty()) svg = d3.select("#svg_div").append("svg").attr("width", 900).attr("height", 700);
        var graphG = svg.select(".graphg").empty() ? svg.append("g").attr("class", "graphg") : svg.select(".graphg");
        var svgWidth = +svg.attr("width");
        var svgHeight = +svg.attr("height");

        // Define margins and graph dimensions
        golf.margin = {top:40, left:47, bottom:40, right:30};
        golf.width = svgWidth - golf.margin.left - golf.margin.right;
        golf.height = svgHeight - golf.margin.top - golf.margin.bottom;

        // Get color scale
        var tournaments = ["us_open", "pga_champ", "masters", "the_open"];
        golf.colorScale = d3.scaleOrdinal(d3.schemeCategory10)
            .domain(tournaments);

        // Color checkbox labels based on color scale
        tournaments.forEach(function(tournament) {
            d3.select("#" + tournament + "_label")
                .style("color", function(d) {
                    return golf.colorScale(tournament);
                })
        });

        // Create scales for axes
        golf.xScale = d3.scaleTime()
            .domain(d3.extent(data, function(d) {return d.year;}))
            .range([0, golf.width])
            .nice();

        golf.yScale = d3.scaleLinear()
            .domain([250,310])
            .range([golf.height, 0])
            .nice();

        // Set animation duration
        golf.animDuration = 1250;

        // Draw from scratch if nothing to zoom
        if (!zoomDict) {
            fullDraw();
            plotInnovations("./data/golf_innovations.json");
        } else {
            if (redraw) {
                drawClipRect();
                drawAxes();
            }

            zoom(zoomDict);
        }

        // Method to draw everything from scratch
        function fullDraw() {
            // Draw clip rectangle
            drawClipRect();

            drawAxes();

            // Draw tournamets and add callbacks for checkbox updates
            tournaments.forEach(function(tournament) {
                if (d3.select("#" + tournament).property("checked")) {
                    draw(tournament);
                }

                d3.select("#" + tournament).on("change", function() {
                    update(tournament);
                })
            });
        }

        // Draw axes and axes lables
        function drawAxes() {

            var xAxis = d3.axisBottom(golf.xScale).tickFormat(d3.format("d"));
            var xAxisG = graphG.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(" + [golf.margin.left,svgHeight - golf.margin.bottom] + ")");

            xAxisG.transition()
                .duration(golf.animDuration)
                .call(xAxis);

            xAxisG.append("text")
                .attr("class", "x label")
                .attr("transform", "translate(412,35)")
                .text("Year");

            var yAxis = d3.axisLeft(golf.yScale);
            var yAxisG = graphG.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(" + [golf.margin.left,golf.margin.bottom] + ")");

            yAxisG.transition()
                .duration(golf.animDuration)
                .call(yAxis);

            yAxisG.append("text")
                .attr("class", "y label")
                .attr("transform", "translate(-33,275) rotate(-90)")
                .text("Average Drive Distance (Yards)");
        }

        // Method to draw lines based on list of tournaments given
        function draw(tournament) {

            // Filter -1 values
            var filteredData = data.filter(function(d) {
                return d[tournament] != -1;
            });

            var lineInterpolate = d3.line()
                .x(function(d) { return golf.xScale(d.year); })
                .y(function(d) { return golf.yScale(+d[tournament]); });

            var line = graphG.select("#" + tournament + "_path")
            if (line.empty()) {
                line = graphG.append("path")
                    .datum(filteredData)
                    .attr("transform", "translate(" + [golf.margin.left,golf.margin.bottom] + ")")
                    .transition()
                    .duration(golf.animDuration)
                    .attr("d", lineInterpolate)
                    .attr("stroke", function(d) {
                        return golf.colorScale(tournament);
                    })
                    .attr("stroke-width", 4)
                    .attr("fill", "none")
                    .attr("id", tournament + "_path")
                    .attr("clip-path", "url(#clip-rect)");
            } else {
                line.datum(filteredData)
                    .attr("transform", "translate(" + [golf.margin.left,golf.margin.bottom] + ")")
                    .transition()
                    .duration(golf.animDuration)
                    .attr("d", lineInterpolate)
                    .attr("stroke", function(d) {
                        return golf.colorScale(tournament);
                    })
                    .attr("stroke-width", 4)
                    .attr("fill", "none")
                    .attr("id", tournament + "_path")
                    .attr("clip-path", "url(#clip-rect)");
            }
        }

        // Method to update line graph on checkbox updates
        function update(tournament) {
            if (d3.select("#" + tournament).property("checked")) {
                draw(tournament);
            } else {
                graphG.selectAll("#" + tournament + "_path")
                    .transition()
                    .duration(golf.animDuration)
                    .attr("stroke-width", 0)
                    .remove();
            }
        }

        // Method to plot innovation data from JSON file
        function plotInnovations(sourceFile) {
            d3.json(sourceFile).then(function(innovations) {

                graphG.selectAll(".innovations").remove();

                innov_line = graphG.selectAll(".innovations")
                    .data(innovations)
                    .enter()
                    .append("g")
                    .attr("class", "innovations");

                // Render flag image for each innovation
                innov_line.append("svg:image")
                    .attr("x", function(d) {
                        return golf.xScale(d.year) + golf.margin.left - 3;
                    })
                    .attr("y", function(d) {
                        return -1000;
                    })
                    .transition()
                    .duration(golf.animDuration)
                    .attr("y", function(d) {
                        return golf.margin.top + 20;
                    })
                    .attr("height", "600px")
                    .attr("xlink:href", "images/golf_flag.png");

                // Render tooltip for innovations
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
                        .html(`<strong>${d.year}</strong><br />${d.name}`);
                });
            });
        }

        // Method to update graph when zooming
        function zoom(zoomDict) {

            // Update scales
            golf.xScale.domain(zoomDict.xDomain).nice();
            golf.yScale.domain(zoomDict.yDomain).nice();

            // Update axes
            var xAxisG = graphG.select(".x.axis")
                .transition()
                .duration(750)
                .call(d3.axisBottom(golf.xScale).tickFormat(d3.format("d")));

            var yAxisG = graphG.select(".y.axis")
                .transition()
                .duration(750)
                .call(d3.axisLeft(golf.yScale));

            // Update line graph
            tournaments.forEach(function(tournament) {
                update(tournament);
            });

            // Update innovation flags
            plotInnovations("data/golf_innovations.json");
        }

        // Method to clip line graphs
        function drawClipRect() {
            var clip = graphG
                .append("clipPath")
                .attr("id", "clip-rect")
                .append("rect")
                .attr("width", golf.xScale(2020) - golf.xScale(1980) + 30)
                .attr("height", golf.yScale(250) - golf.yScale(310))
                .attr("transform", "translate(" + [golf.margin.left - 45,golf.margin.bottom] + ")")
                .style("stroke", "black")
                .style("fill", "none");
        }
    });
}
