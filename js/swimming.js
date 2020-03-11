// Read swimming data
d3.csv("./data/swimming.csv").then(function(data) {

    // Get svg and it's dimensions
    var svg = d3.select("#swim_main").select("svg");
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
        .attr("transform", "translate(375,590)");
    graphG.append("text")
        .attr("class", "y label")
        .text("Time (Min:Sec)")
        .attr("transform", "translate(12,300) rotate(-90)");

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
            .append("circle")
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
            .attr("r", 3)
            .attr("fill", function(d) {
                if (d.full_body_suit == "yes") {
                    return "#FF0000";
                } else {
                    return "#0000FF";
                }
            });

    }

    // Function to filter data based on event
    function filterData(event) {
        return data.filter(function(d) {
            return d.event == event;
        });
    }
});
