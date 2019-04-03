// Global functions called when select elements changed
function onXScaleChanged() {
    var select = d3.select('#xScaleSelect').node();
    // Get current value of select element, save to global chartScales
    chartScales.x = select.options[select.selectedIndex].value;

    console.log('XScale change');
    // Update chart
    updateChart();
}

function onYScaleChanged() {
    var select = d3.select('#yScaleSelect').node();
    // Get current value of select element, save to global chartScales
    chartScales.y = select.options[select.selectedIndex].value;

    // Update chart
    updateChart();
}

// Also, declare global variables for missing amount, total amount, and percentage
missing_count = 0;
total_count = 0;
per = 0;

// the work flow is like when click on a button it will remove the other one
//or this button is to remove
function drawBar() {
    // $('scatter_view').remove();
    document.getElementById('bar_view').style.display = "inline";
    document.getElementById('bar_radio').style.display = "inline";
    document.getElementById('scatter_radio').style.display = "none";
    document.getElementById('scatter_view').style.display = "none";
}

//show scatter when after click button
function drawScatter() {
    // d3.select("#scatter_view").select("svg").remove();
    document.getElementById('scatter_view').style.display = "inline";
    document.getElementById('scatter_radio').style.display = "inline";
    document.getElementById('bar_radio').style.display = "none";
    document.getElementById('bar_view').style.display = "none";
}

var svg = d3.select('svg');

// Get layout parameters
var svgWidth = +svg.attr('width');
var svgHeight = +svg.attr('height');

var padding = {t: 40, r: 40, b: 40, l: 40};

// Compute chart dimensions
var chartWidth = svgWidth - padding.l - padding.r;
var chartHeight = svgHeight - padding.t - padding.b;

// Create a group element for appending chart elements
var chartG = svg.append('g')
    .attr('transform', 'translate('+[padding.l, padding.t]+')');

var xAxisG = chartG.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate('+[0, chartHeight]+')');

var yAxisG = chartG.append('g')
// .attr('class', 'y axis');
    .attr('class', 'y-axis'); //there was a overlap in class name for bar


var transitionScale = d3.transition()
    .duration(600)
    .ease(d3.easeLinear);

//****scatter plot
function updateChart() {

    // console.log('upatechart');
    // **** Draw and Update your chart here ****
    // Update the scales based on new data attributes
    yScale.domain(domainMap[chartScales.y]).nice();
    xScale.domain(domainMap[chartScales.x]).nice();

    // Update the axes here first
    xAxisG.transition()
        .duration(750) // Add transition
        .call(d3.axisBottom(xScale));
    yAxisG.transition()
        .duration(750) // Add transition
        .call(d3.axisLeft(yScale));

    // these were declared as local initially
    temp_x = chartScales.x;
    temp_y = chartScales.y;

    if(temp_x === "Age"){
        temp_x ="age";
    }else if(temp_x === "Rating"){
        temp_x="rate"
    }else if(temp_x === "Price"){
        temp_x="price"
    }else if(temp_x === "ABV"){
        temp_x="abv"
    }
    if(temp_y === "Age"){
        temp_y ="age";
    }else if(temp_y === "Rating"){
        temp_y="rate"
    }else if(temp_y === "Price"){
        temp_y="price"
    }else if(temp_y === "ABV"){
        temp_y="abv"
    }

    select_x = temp_x.concat("_impute");
    select_y = temp_y.concat("_impute");

    console.log('select_x',select_x);
    console.log('select_y', select_y);

    filtered_data = whiskey
        .filter(function(d){
            return d[select_x] === 1 || d[select_y] === 1});

    filtered_data_xy = whiskey
        .filter(function(d){
            return d[select_x] === 1 && d[select_y] === 1});


    filtered_x = whiskey
        .filter(function(d){
            return d[select_x] ===1});

    console.log("filtered_x",filtered_x);
    filtered_y = whiskey
        .filter(function(d){
            return d[select_y] ===1});
    console.log("filtered_y",filtered_y);

    noimpute_data = whiskey
        .filter(function(d){
            return d[select_x] === 0 && d[select_y] === 0});

    // Create and position scatterplot circles
    // User Enter, Update (don't need exit)
    dots = chartG.selectAll('.dot')
        .data(whiskey);
    // .data(noimpute_data);


    // Define the div for the tooltip
    var div = d3.select("body").append("div")
        .attr("class", "tooltip");

    // filter it
    dotsEnter = dots.enter()
        .append('g')
        .attr('class', 'dot')
        // .attr("id","id_"+i)
        // .attr("fill","steelblue")
        .on('mouseover', function(d){ // Add hover start event binding
            var hovered = d3.select(this);
            // Show the text, otherwise hidden
            hovered.select('text')
                .style('visibility', 'visible');
            // Add stroke to circle to highlight it
            hovered.select('circle')
                .style('stroke-width', 2)
                .style('stroke', '#333');
        })
        .on('mouseout', function(d){ // Add hover end event binding
            // Select the hovered g.dot
            var hovered = d3.select(this);
            // Remove the highlighting we did in mouseover
            hovered.select('text')
                .style('visibility', 'hidden');
            hovered.select('circle')
                .style('stroke-width', 0)
                .style('stroke', 'none');
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });

    // Append a circle to the ENTER selection
    // dotsEnter.append('circle')
    //     .attr('r', 3);
    dotsEnter.append('circle')
        .attr("class","no_impute")
        .style("fill",function(d){
            if(d[select_x] ===1 || d[select_y] === 1){return "url(#diagonal-stripes)";}
            else{return "steelblue";}
        })
        .attr('r', 5);

    dotsEnter.append('text')
        .attr('y', -10)
        .text(function(d) {
            // console.log('price impute',d.price_impute);
            return d.Name;
        });

    std_x = d3.deviation(whiskey, function(d) { return d[chartScales.x]; });
    std_y = d3.deviation(whiskey, function(d) { return d[chartScales.y]; });

    dotsEnter.append("line")
    // .filter(function(d){
    //     return d[select_x] ===1})
        .attr("class", "normal-line")
        .attr("x1", function(d){return -xScale(d[chartScales.x])})
        .attr("y1", 0)
        .attr("x2", function(d){return -xScale(d[chartScales.x]+10)})
        // .attr("x2", function(d){retur})
        .style("opacity",0)
        .attr("y2", 0);

    // this is for y
    dotsEnter.append("line")
    // .filter(function(d){
    //     return d[select_y] === 1})
        .attr("class", "normal-line")
        .attr("x1", 0)
        .attr("y1",function(d){return yScale(d[chartScales.y])})
        .attr("x2", 0)
        .style("opacity",0)
        .attr("y2", function(d){return yScale(d[chartScales.y]-10)});

    // d3.selectAll(".error-line-x").style("opacity",1);
    // d3.selectAll(".error-line-y").style("opacity",1);

    d3.selectAll("line")
        .filter(function(d){return d[select_x] === 1 || d[select_y] === 1})
        .style("opacity","1");

    d3.selectAll("line")
        .filter(function(d){return d[select_x] === 0 && d[select_y] === 0})
        .style("opacity","0");


    d3.selectAll("circle")
        .filter(function(d){return d[select_x] ===1 || d[select_y] ===1})
        .style("fill","url(#diagonal-stripes)");

    d3.selectAll("circle")
        .filter(function(d){return d[select_x] ===0 && d[select_y] === 0})
        .style("fill","steelblue");

    // std_x = d3.deviation(whiskey, function(d) { return d[chartScales.x]; });
    // std_y = d3.deviation(whiskey, function(d) { return d[chartScales.y]; });
    //
    // dotsEnter.append("line")
    //     // .filter(function(d){
    //     //     return d[select_x] ===1})
    //     .attr("class", "error-line-x")
    //     .attr("x1", 0 )
    //     .attr("y1", 0)
    //     .attr("x2", -std_x)
    //     .style("opacity",0)
    //     .attr("y2", 0);
    //
    // // this is for y
    // dotsEnter.append("line")
    //     // .filter(function(d){
    //     //     return d[select_y] === 1})
    //     .attr("class", "error-line-y")
    //     .attr("x1", 0)
    //     .attr("y1",0)
    //     .attr("x2", 0)
    //     .style("opacity",0)
    //     .attr("y2", -std_y);
    //
    // d3.selectAll("line")
    //     .filter(function(d){return d[select_x] ===1 || d[select_y] ===1})
    //     .style("opacity","1");
    //
    // d3.selectAll("line")
    //     .filter(function(d){return d[select_x] ===0 && d[select_y] ===0})
    //     .style("opacity","0");


    // dotsEnter.append("line")
    //     .filter(function(d){
    //         return d[select_x] ===1})
    //     .attr("class", "error-line")
    //     .attr("x1", -std_x )
    //     .attr("y1", 0)
    //     .attr("x2", +std_x)
    //     .style("opacity",0)
    //     .attr("y2", 0);
    //
    // // this is for y
    // dotsEnter.append("line")
    //     .filter(function(d){
    //         return d[select_y] ===1})
    //     .attr("class", "error-line")
    //     .attr("x1", 0)
    //     .attr("y1",std_y)
    //     .attr("x2", 0)
    //     .style("opacity",0)
    //     .attr("y2", -std_y);

    //

    // d3.selectAll("circle")
    //     .filter(function(d){return d[select_x] ===1})
    //         .append("line")
    //         .attr("class", "normal-line")
    //         .style("opacity",1)
    //         .attr("x1", function (d) {
    //             return xScale(0);
    //         })
    //         .attr("y1", function (d) {
    //             // return yScale(d[chartScales.y]+1);
    //             return yScale(-d[chartScales.y]);
    //         })
    //         .attr("x2", function (d) {
    //             return xScale(0);
    //         })
    //         .attr("y2", function (d) {
    //             // return yScale(d[chartScales.y]-1);
    //             return yScale(-d[chartScales.y]-0.6);
    //         });


    // dotsEnter.append("line")
    //     .filter(function(d){
    //         return d[select_x] === 1 })
    //     .attr("class", "normal-line")
    //     .style("opacity",1)
    //     .attr("x1", function (d) {
    //         return xScale(0);
    //     })
    //     .attr("y1", function (d) {
    //         // return yScale(d[chartScales.y]+1);
    //         return yScale(-d[chartScales.y]);
    //     })
    //     .attr("x2", function (d) {
    //         return xScale(0);
    //     })
    //     .attr("y2", function (d) {
    //         // return yScale(d[chartScales.y]-1);
    //         return yScale(-d[chartScales.y]-0.6);
    //     });
    //
    // dotsEnter.append("line")
    //     .filter(function(d){
    //         return d[select_y] === 1 })
    //     .attr("class", "normal-line")
    //     .style("opacity",1)
    //     .attr("x1", function (d) {
    //         return xScale(-d[chartScales.x]);
    //     })
    //     .attr("y1", function (d) {
    //         // return yScale(d[chartScales.y]+1);
    //         return yScale(0);
    //     })
    //     .attr("x2", function (d) {
    //         return xScale(-d[chartScales.x]-0.6);
    //     })
    //     .attr("y2", function (d) {
    //         // return yScale(d[chartScales.y]-1);
    //         return yScale(0);
    //     });

    d3.selectAll(("input[value='ticks_on']")).on("change", function() {
        console.log('ticks_on');
        redraw_ticks_on();
    });

    // ENTER + UPDATE selections - bindings that happen on all updateChart calls
    dots.merge(dotsEnter)
        .transition() // Add transition - this will interpolate the translate() on any changes
        .duration(750)
        .attr('transform', function(d) {
            console.log('this gets called merge');
            // Transform the group based on x and y property
            var tx = xScale(d[chartScales.x]);
            var ty = yScale(d[chartScales.y]);
            return 'translate('+[tx, ty]+')';
        });

    d3.selectAll("line")
        .filter(function(d){return d[select_x] ===1 || d[select_y] ===1})
        .style("opacity","1");

    d3.selectAll("line")
        .filter(function(d){return d[select_x] ===0 && d[select_y] ===0})
        .style("opacity","0");

    function redraw_ticks_on() {
        // if(typeof dots_chart_line === 'undefined'){ // bars
        // }else{
        //     dots_chart_line.remove().exit();
        // }if(typeof dots_chart_line_y === 'undefined'){ // bars
        //     console.log('dotschart undefined');
        // }else {
        //     dots_chart_line_y.remove().exit();
        //     // dots_remove.remove().exit();
        // }if(typeof dots_chart_x === 'undefined'){ // bars
        //     console.log('dotschart undefined');
        // }else{
        //     dots_chart_x.remove().exit(); //remove some of the encodings
        // }if(typeof dots_chart_y === 'undefined'){ // bars
        //     console.log('dotschart undefined');
        // }else{
        //     dots_chart_y.remove().exit(); //remove some of the encodings
        // }

        // where it is missing, so if the value is imputed than it will show little lines next to it
        dots_chart_line_x = chartG.append("g")
            .selectAll("line")
            // .data(filtered_x)
            .data(filtered_x)
            // .data(filtered_data)
            .enter()
            // .filter(function(d){
            //     return d[select_x] === 1 })
            .append("line")
            .attr("opacity",1)
            .attr("class", "normal-line")
            .attr("x1", function (d) {
                return xScale(d[chartScales.x]);
            })
            .attr("y1", function (d) {
                // return yScale(d[chartScales.y]+1);
                return yScale(0);
            })
            .attr("x2", function (d) {
                return xScale(d[chartScales.x]);
            })
            .attr("y2", function (d) {
                // return yScale(d[chartScales.y]-1);
                return yScale(-0.6);
            });

        dots_chart_line_y = chartG.append("g")
            .selectAll("line")
            // .data(filtered_data)
            // .data(filtered_y)
            .data(filtered_y)
            .enter()
            // .filter(function(d){
            //     return d[select_y] === 1 })
            .append("line")
            .attr("opacity",1)
            .attr("class", "normal-line")
            .attr("x1", function (d) {
                return xScale(-3.5);
            })
            .attr("y1", function (d) {
                // return yScale(d[chartScales.y]+1);
                return yScale(d[chartScales.y]);
            })
            .attr("x2", function (d) {
                return xScale(0);
            })
            .attr("y2", function (d) {
                // return yScale(d[chartScales.y]-1);
                return yScale(d[chartScales.y]);
            });


        // dots_chart_line_x = chartG.append("g").selectAll("line")
        //     // .data(filtered_x)
        //     .data(filtered_data_xy)
        //     // .data(filtered_data)
        //     .enter()
        //     // .filter(function(d){
        //     //     return d[select_x] === 1 })
        //     .append("line")
        //     .attr("class", "normal-line-x")
        //     .attr("x1", function (d) {
        //         return xScale(0);
        //     })
        //     .attr("y1", function (d) {
        //         // return yScale(d[chartScales.y]+1);
        //         return yScale(d[chartScales.y]);
        //     })
        //     .attr("x2", function (d) {
        //         return xScale(0.6);
        //     })
        //     .attr("y2", function (d) {
        //         // return yScale(d[chartScales.y]-1);
        //         return yScale(d[chartScales.y]);
        //     });
        //
        // console.log('filtered_x', filtered_x);
        //
        // dots_chart_line_y = chartG.append("g").selectAll("line")
        //     // .data(filtered_data)
        //     // .data(filtered_y)
        //     .data(filtered_y)
        //     .enter()
        //     // .filter(function(d){
        //     //     return d[select_y] === 1 })
        //     .append("line")
        //     .attr("class", "normal-line-y")
        //     .attr("x1", function (d) {
        //         return xScale(d[chartScales.x]);
        //     })
        //     .attr("y1", function (d) {
        //         // return yScale(d[chartScales.y]+1);
        //         return yScale(0);
        //     })
        //     .attr("x2", function (d) {
        //         return xScale(d[chartScales.x]);
        //     })
        //     .attr("y2", function (d) {
        //         // return yScale(d[chartScales.y]-1);
        //         return yScale(0.6);
        //     });
        //
        // console.log('filtered_y', filtered_y);

        // d3.selectAll(".impute_x").
        // var impute_x = d3.selectAll(".impute_x").each(function(d){
        //     console.log("impute_x each here");
        //     console.log(d);
        //
        // });
        //
        // impute_x.enter().append("line")
        //     .attr("opacity",1)
        //     .attr("class", "normal-line-x")
        //     .attr("x1", function (d) {
        //         return xScale(-0.6);
        //     })
        //     .attr("y1", function (d) {
        //         // return yScale(d[chartScales.y]+1);
        //         return yScale(d[chartScales.y]);
        //     })
        //     .attr("x2", function (d) {
        //         return xScale(0.6);
        //     })
        //     .attr("y2", function (d) {
        //         // return yScale(d[chartScales.y]-1);
        //         return yScale(d[chartScales.y]);
        //     });

        // dots_chart_line = chartG.append("g").selectAll("line")
        //     .data(filtered_data)
        //     .enter()
        //     .filter(function(d){
        //         return d[select_x] ===1})
        //     .append("line")
        //     .attr("class", "error-line")
        //     .attr("x1", function (d) {
        //         return xScale(d[chartScales.x]-std_x );
        //     })
        //     .attr("y1", function (d) {
        //         return yScale(d[chartScales.y]);
        //     })
        //     .attr("x2", function (d) {
        //         return xScale(d[chartScales.x] +std_x);
        //     })
        //     .attr("y2", function (d) {
        //         return yScale(d[chartScales.y]);
        //     });

    }// end of unfilled

}// end of updatechart for Scatterplots