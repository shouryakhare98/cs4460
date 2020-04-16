
// Draw initial graph
function drawInitial() {
    lineGraph();
}

// Zoom out to original
function zoomOut() {
    var zoomDict = {
        xDomain: [1980, 2019],
        yDomain: [250, 310],
    }

    lineGraph(zoomDict);
}

// Graphite shaft zoom
function graphiteZoom() {
    var zoomDict = {
        xDomain: [1994, 1997],
        yDomain: [255, 268],
    };

    lineGraph(zoomDict);
}

// Titleist zoom
function titleistZoom() {
    var zoomDict = {
        xDomain: [1999.5, 2001.5],
        yDomain: [267, 281]
    };

    lineGraph(zoomDict);
}

// Hybrid club zoom
function hybridClubZoom() {

    var zoomDict = {
        xDomain: [2001, 2003],
        yDomain: [274, 287]
    };

    lineGraph(zoomDict);
}

// Swim graph
function displaySwim() {
    toggleInputs("#swim-inputs", "#golf-inputs");
    clearSvg();
    scatterPlot();
}

// Going from swim to golf
function swimToGolf() {
    toggleInputs("#golf-inputs", "#swim-inputs");
    clearSvg();

    var zoomDict = {
        xDomain: [2001, 2003],
        yDomain: [274, 287]
    };
    lineGraph(zoomDict, redraw=true)
}

// Function to clear svg
function clearSvg() {
    d3.selectAll("svg>*").transition().duration(golf.animDuration/4).style("opacity", 0).remove();
}

// Function to toggle inputs
function toggleInputs(enable, disable) {
    d3.select(disable)
        .transition()
        .duration(200)
        .style("opacity", 0)
        .style("pointer-events", "none")
        .style("z-index", -1);

    d3.select(enable)
        .transition()
        .duration(1200)
        .style("opacity", 1)
        .style("pointer-events", "all")
        .style("z-index", 0);
}

//Cleaning Function
//Will hide all the elements which are not necessary for a given chart type

function clean(chartType){
    let svg = d3.select('#vis').select('svg')
    if (chartType !== "isScatter") {
        svg.select('.scatter-x').transition().attr('opacity', 0)
        svg.select('.scatter-y').transition().attr('opacity', 0)
        svg.select('.best-fit').transition().duration(200).attr('opacity', 0)
    }
    if (chartType !== "isMultiples"){
        svg.selectAll('.lab-text').transition().attr('opacity', 0)
            .attr('x', 1800)
        svg.selectAll('.cat-rect').transition().attr('opacity', 0)
            .attr('x', 1800)
    }
    if (chartType !== "isFirst"){
        svg.select('.first-axis').transition().attr('opacity', 0)
        svg.selectAll('.small-text').transition().attr('opacity', 0)
            .attr('x', -200)
    }
    if (chartType !== "isHist"){
        svg.selectAll('.hist-axis').transition().attr('opacity', 0)
    }
    if (chartType !== "isBubble"){
        svg.select('.enrolment-axis').transition().attr('opacity', 0)
    }
}

//Array of all the graph functions
//Will be called from the scroller functionality

let activationFunctions = [
    zoomOut,
    graphiteZoom,
    titleistZoom,
    hybridClubZoom,
    displaySwim
];

//All the scrolling function
//Will draw a new graph based on the index provided by the scroll


let scroll = scroller()
    .container(d3.select('#graphic'))
scroll()

let lastIndex, activeIndex = 0

drawInitial();

scroll.on('active', function(index){
    d3.selectAll('.step')
        .transition().duration(500)
        .style('opacity', function (d, i) {return i === index ? 1 : 0.1;});

    activeIndex = index
    let sign = (activeIndex - lastIndex) < 0 ? -1 : 1;
    let scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
    scrolledSections.forEach(i => {
        if (activeIndex == 3 && sign == -1) {
            swimToGolf();
        } else {
            activationFunctions[i]();
        }
    })
    lastIndex = activeIndex;
})

scroll.on('progress', function(index, progress){
    if (index == 2 & progress > 0.7){

    }
})
