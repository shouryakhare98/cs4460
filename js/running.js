// Function to render running stuff
function tiles() {

    // Read running stats
    d3.json("data/vaporfly_stats.json").then(function(data) {

        // Get svg and it's dimensions
        var svg = d3.select("#svg_div").select("svg");
        if (svg.empty()) svg = d3.select("#svg_div").append("svg").attr("width", 900).attr("height", 700);
        var graphG = svg.select(".graphg").empty() ? svg.append("g").attr("class", "graphg") : svg.select(".graphg");
        var svgWidth = +svg.attr("width");
        var svgHeight = +svg.attr("height");

        // Decide margins and get tile widths
        var margin = {top:60, left:60, bottom:60, right:60};
        var tileMargin = 10;
        var tileWidth = (svgWidth - 2 * tileMargin - margin.left - margin.right) / 3;
        var tileHeight = tileWidth;

        // Load tile backgrounds as patterns
        var bg = ["b0", "b1", "b2", "b3", "b4", "b5"];
        bg.forEach(function(img) {
            graphG.append("defs")
                .append("pattern")
                .attr("id", img)
                .attr("patternUnits", "objectBoundingBox")
                .attr("width", "100%")
                .attr("height", "100%")
                .append("image")
                .attr("xlink:href", "images/" + img + ".jpg")
                .attr("width", tileWidth)
                .attr("height", tileHeight);
        });

        // Draw tiles
        var tiles = graphG.selectAll(".tile")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "tile")
            .on("click", function(d) {
                window.open(d.source);
            });

        tiles.append("rect")
            .attr("width", tileWidth)
            .attr("height", tileHeight)
            .attr("x", function(d,i) {
                return margin.left + (tileWidth + tileMargin) * (i % 3);
            })
            .attr("y", -500)
            .transition()
            .duration(golf.animDuration)
            .attr("y", function(d,i) {
                return margin.top + (tileHeight + tileMargin) * Math.floor(i / 3);
            })
            .attr("rx", 15)
            .attr("ry", 15)
            .attr("fill", function(d,i) {
                return "url(#b" + i + ")";
            });

        // Add text to tiles
        tiles.append("text")
            .attr("x", function(d,i) {
                return margin.left + tileWidth/2 + (tileWidth + tileMargin) * (i % 3);
            })
            .attr("y", -500)
            .transition()
            .duration(golf.animDuration)
            .attr("y", function(d,i) {
                return margin.top + tileHeight/2 + (tileHeight + tileMargin) * Math.floor(i / 3) + 20;
            })
            .text(function(d) {
                return d.stat;
            })
            .style("text-anchor", "middle");

        // Render tooltip for tiles
        var tooltip = d3.select("#graphic").select("#tooltip")
        if (tooltip.empty()) {
            tooltip = d3.select("#graphic")
                .append("div")
                .attr("id", "tooltip");
        }

        tiles.on("mouseover", function(d) {
            tooltip.style('left', (d3.event.pageX + 10)+ 'px')
                .style('top', (d3.event.pageY - 25) + 'px')
                .style('display', 'inline-block')
                .html(`${d.description.split("|")[0]}
                    <strong>${d.description.split("|")[1]}</strong>
                    ${d.description.split("|")[2]}`);
        }).on("mouseout", function(d) {
            tooltip.style("display", "none");
        }).on("mousemove", function(d) {
            tooltip.style('left', (d3.event.pageX + 10)+ 'px')
                .style('top', (d3.event.pageY - 25) + 'px')
                .style('display', 'inline-block')
                .html(`${d.description.split("|")[0]}
                    <strong>${d.description.split("|")[1]}</strong>
                    ${d.description.split("|")[2]}`);
        });

    });
}
