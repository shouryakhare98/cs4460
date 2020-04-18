
// Draw initial graph
function drawInitial() {
    setTimeout(clearSvg, 500);
    setTimeout(function() {
        toggleInputs(enable="#golf-inputs", disable="#swim-inputs");
    }, 750);
    setTimeout(lineGraph, 1000);
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
    toggleInputs(enable="#swim-inputs", disable="#golf-inputs");
    clearSvg();
    scatterPlot();
}

// Function to clear svg
function clearSvg() {
    d3.selectAll("svg>*").transition().duration(golf.animDuration/4).style("opacity", 0).remove();
}

// Function to toggle inputs
function toggleInputs(enable=null, disable=null) {
    if (disable) {
        d3.select(disable)
            .transition()
            .duration(200)
            .style("opacity", 0)
            .style("pointer-events", "none")
            .style("z-index", -1);
    }

    if (enable) {
        d3.select(enable)
            .transition()
            .duration(1200)
            .style("opacity", 1)
            .style("pointer-events", "all")
            .style("z-index", 0);
    }
}

// Function for swim to golf transition
function swimToGolf() {
    clearSvg();
    toggleInputs(enable="#golf-inputs", disable="#swim-inputs");
    lineGraph();
}

// Dummy function that does nothing
function dummyFunc() {

}

// Display running
function displayRun() {
    toggleInputs(enable=null, disable="#swim-inputs");
    toggleInputs(enable=null, disable="#golf-inputs");
    clearSvg();
    tiles();
}

//Array of all the graph functions
//Will be called from the scroller functionality

let activationFunctions = [
    zoomOut,
    graphiteZoom,
    titleistZoom,
    hybridClubZoom,
    zoomOut,
    displaySwim,
    dummyFunc,
    displayRun,
    dummyFunc,
    clearSvg
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
        if (activeIndex == 4 && sign == -1) {
            swimToGolf();
        } else if (activeIndex == 5 && sign == -1) {
            dummyFunc();
        } else if (activeIndex == 6 && sign == -1) {
            displaySwim();
        } else if (activeIndex == 7 && sign == -1) {
            dummyFunc();
        } else if (activeIndex == 8 && sign == -1) {
            displayRun();
        } else {
            activationFunctions[i]();
        }
    })
    lastIndex = activeIndex;
})
