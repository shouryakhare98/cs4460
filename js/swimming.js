
function scatterPlot() {

    // Read swimming data
    d3.csv("./data/swimming.csv").then(function(data) {

        // Get svg and it's dimensions (remove previous graph)
        var svg = d3.select("#svg_div").select("svg");
        var graphG = svg.append("g").attr("class", "scatter-plot");
        var svgWidth = +svg.attr("width");
        var svgHeight = +svg.attr("height");

        // Define margins and graph dimensions
        var margin = {top:40, left:70, bottom:40, right:15}
        var width = svgWidth - margin.left - margin.right;
        var height = svgHeight - margin.top - margin.bottom;

        // Parse data dates and times
        var parseDate = d3.timeParse("%d-%b-%y");
        var parseTime = d3.timeParse("%M:%S.%L");
        data.forEach(function(d) {
            d.date = parseDate(d.date);
            d.time = parseTime(d.time);
        })

        // Keep track of checked event
        var checkedEvent = d3.select("input[name='swimming']:checked").node().id;
        var allEvents = ["50_free", "200_butterfly", "400_indv_medley", "400_free", "200_back"];

        // Create scales, groups and labels for axes
        var xScale = d3.scaleTime().range([0, width]);
        var yScale = d3.scaleTime().range([height, 0]);

        var xAxisG = graphG.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(" + [margin.left,svgHeight - margin.bottom] + ")");
        var yAxisG = graphG.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + [margin.left,margin.bottom] + ")");

        graphG.append("text")
            .attr("class", "x label")
            .text("Year")
            .attr("transform", "translate(480,695)");
        graphG.append("text")
            .attr("class", "y label")
            .text("Time (Min:Sec)")
            .attr("transform", "translate(10,350) rotate(-90)");

        // Create domain maps for date and time
        domainMap = {};
        allEvents.forEach(function(event) {
            domainMap[event] = {};
            domainMap[event]["date"] = d3.extent(filterData(event), function(d) {
                return d.date;
            });
            domainMap[event]["time"] = d3.extent(filterData(event), function(d) {
                return d.time;
            });
        });

        // Set up callbacks for radio buttons
        d3.selectAll("input[name='swimming']").on("change", function() {
            checkedEvent = this.id;
            update();
        });

        // Call update to plot initial graph
        update();

        // Function to update chart based on selected radio button
        function update() {

            // Plot innovations
            plotInnovations("data/swimming_innovations.json");

            // Update scales based on new domains
            xScale.domain(domainMap[checkedEvent].date).nice();
            yScale.domain(domainMap[checkedEvent].time).nice();

            // Update axes
            xAxisG.transition()
                .duration(1000)
                .call(d3.axisBottom(xScale));
            yAxisG.transition()
                .duration(1000)
                .call(d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S.%L")));

            graphG.selectAll(".dot").remove();

            // Create dots for scatterplot
            var dots = graphG.selectAll(".dot")
                .data(filterData(checkedEvent))
                .enter()
                .append("g")
                .style("z-index", 1);

            dots.append("circle")
                .attr("class", "dot")
                .attr("transform", function(d) {
                    var tx = xScale(d.date) + margin.left;
                    return "translate("+[tx,-10]+")";
                })
                .transition()
                .duration(1000)
                .attr("transform", function(d) {
                    var tx = xScale(d.date) + margin.left;
                    var ty = yScale(d.time) + margin.bottom;
                    return "translate("+[tx,ty]+")";
                })
                .attr("r", 6)
                .attr("fill", function(d) {
                    if (d.full_body_suit == "yes") {
                        return "#E6E600";
                    } else {
                        return "#A6A6A6";
                    }
                });

            // Render tooltip for dots
            var tooltip = d3.select("#graphic").select("#tooltip")
            if (tooltip.empty()) {
                tooltip = d3.select("#graphic")
                    .append("div")
                    .attr("id", "tooltip");
            }

            dots.on("mouseover", function(d) {
                tooltip.style('left', (d3.event.pageX + 10)+ 'px')
                    .style('top', (d3.event.pageY - 25) + 'px')
                    .style('display', 'inline-block')
                    .html(`<strong>Name: </strong>${d.swimmer}<br />
                        <strong>Time: </strong>${(d.time).getSeconds()+"."+(d.time).getMilliseconds()+" sec"}<br />
                        <strong>Full Body Suit: </strong>${d.full_body_suit.charAt(0).toUpperCase() + d.full_body_suit.slice(1)}`);
            }).on("mouseout", function(d) {
                tooltip.style("display", "none");
            }).on("mousemove", function(d) {
                tooltip.style('left', (d3.event.pageX + 10)+ 'px')
                    .style('top', (d3.event.pageY - 25) + 'px')
                    .style('display', 'inline-block')
                    .html(`<strong>Name: </strong>${d.swimmer}<br />
                        <strong>Time: </strong>${(d.time).getSeconds()+"."+(d.time).getMilliseconds()+" sec"}<br />
                        <strong>Full Body Suit: </strong>${d.full_body_suit.charAt(0).toUpperCase() + d.full_body_suit.slice(1)}`);
            });
        }

        // Function to filter data based on event
        function filterData(event) {
            return data.filter(function(d) {
                return d.event == event;
            });
        }

        // Function to plot innovations
        function plotInnovations(sourceFile) {
            d3.json(sourceFile).then(function(innovations) {

                graphG.selectAll(".innovations").remove();

                innov_line = graphG.selectAll(".innovations")
                    .data(innovations)
                    .enter()
                    .append("g")
                    .attr("class", "innovations")
                    .style("z-index", -1);

                // Render flag image for each innovation
                innov_line.append("svg:image")
                    .attr("x", function(d) {
                        return xScale(parseDate(d.date)) + margin.left - 10;
                    })
                    .attr("y", function(d) {
                        return -1000;
                    })
                    .transition()
                    .duration(golf.animDuration)
                    .attr("y", function(d) {
                        return margin.top - 6;
                    })
                    .attr("height", "630px")
                    .attr("xlink:href", "images/swim_rope.png");

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
                        .html(`<strong>${"20" + d.date.split("-")[2]}</strong><br />${d.name}`);
                }).on("mouseout", function(d) {
                    tooltip.style("display", "none");
                }).on("mousemove", function(d) {
                    tooltip.style('left', (d3.event.pageX + 10)+ 'px')
                        .style('top', (d3.event.pageY - 25) + 'px')
                        .style('display', 'inline-block')
                        .html(`<strong>${"20" + d.date.split("-")[2]}</strong><br />${d.name}`);
                });
            })
        }
    });
}
