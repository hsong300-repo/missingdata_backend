// Global functions called when select elements changed
function onXScaleChanged() {
    var select = d3.select('#xScaleSelect').node();
    // Get current value of select element, save to global chartScales
    chartScales.x = select.options[select.selectedIndex].value;


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

// console.log()

var padding = {t: 40, r: 40, b: 40, l: 40};

// Compute chart dimensions
var chartWidth = svgWidth - padding.l - padding.r;
var chartHeight = svgHeight - padding.t - padding.b;

// Create a group element for appending chart elements
var chartG = svg.append('g')
    .attr('transform', 'translate('+[padding.l, padding.t]+')');

var xAxisG = chartG.append('g')
    .attr('class', 'x axis')
    // .attr('transform', 'translate('+[0, chartHeight]+')');
    .attr('transform', 'translate('+[0, chartHeight]+')');

var yAxisG = chartG.append('g')
// .attr('class', 'y axis');
    .attr('class', 'y-axis'); //there was a overlap in class name for bar

var transitionScale = d3.transition()
    .duration(600)
    .ease(d3.easeLinear);

//****scatter plot
function updateChart() {

    //comute it hear so that it's possible to adjust axis
    std_x = d3.deviation(whiskey, function(d) { return d[chartScales.x]; });
    std_y = d3.deviation(whiskey, function(d) { return d[chartScales.y]; });

    console.log('std_x',std_x);
    console.log('std_y',std_y);

    // console.log('upatechart');
    // **** Draw and Update your chart here ****
    // Update the scales based on new data attributes
    yScale.domain(domainMap[chartScales.y]).nice();
    xScale.domain(domainMap[chartScales.x]).nice();

    console.log('yscale min',yScale.domain()[0],yScale.domain().slice(-1)[0]);
    var xScaleMin = xScale.domain()[0];
    console.log('xScaleMin',xScaleMin,xScale(xScaleMin));

    yScaleMax =yScale.domain().slice(-1)[0];


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

    // var dotsEnter = dots.enter()
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
    // dotsEnter.append('circle')
    //     .filter(function(d){
    //         return d[select_x] === 0 && d[select_y] === 0})
    //     .attr("class","no_impute")
    //     .style("fill","steelblue")
    //     .attr('r', 4);

    dotsEnter.append('circle')
        .attr("class","no_impute")
        .style("fill",function(d){
            if(d[select_x] ===1 || d[select_y] === 1){return "url(#diagonal-stripes)";}
            else{return "steelblue";}
        })
        .attr('r', 5);


    // Append a text to the ENTER selection
    dotsEnter.append('text')
        .attr('y', -10)
        .text(function(d) {
            return d.Name;
        });

    d3.selectAll(("input[value='error']")).on("change", function() {
        console.log('onchange error');
        redraw_error();
    });

    std_x = d3.deviation(whiskey, function(d) { return d[chartScales.x]; });
    std_y = d3.deviation(whiskey, function(d) { return d[chartScales.y]; });

    // dotsEnter.append("line")
    // // .filter(function(d){
    // //     return d[select_x] ===1})
    //     .attr("class", "normal-line")
    //     .attr("x1", -(std_x/2) )
    //     .attr("y1", 0)
    //     .attr("x2", +(std_x/2))
    //     .style("opacity",0)
    //     .attr("y2", 0);
    //
    // // this is for y
    // dotsEnter.append("line")
    // // .filter(function(d){
    // //     return d[select_y] === 1})
    //     .attr("class", "normal-line")
    //     .attr("x1", 0)
    //     .attr("y1",(std_y/2))
    //     .attr("x2", 0)
    //     .style("opacity",0)
    //     .attr("y2", -(std_y/2));

    // ENTER + UPDATE selections - bindings that happen on all updateChart calls
    dots.merge(dotsEnter)
        .transition() // Add transition - this will interpolate the translate() on any changes
        .duration(500)
        // .duration(750)
        .attr('transform', function(d) {
            console.log('this gets called merge');
            // Transform the group based on x and y property
            var tx = xScale(d[chartScales.x]);
            var ty = yScale(d[chartScales.y]);
            return 'translate('+[tx, ty]+')';
        });

    console.log('std x std y',std_x,std_y);
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

    redraw_error();
    // setInterval(function(){},1000);


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
    //     .attr("class", "error-line-x")
    //     .attr("x1", -(std_x/2) )
    //     .attr("y1", 0)
    //     .attr("x2", +(std_x/2))
    //     .style("opacity",0)
    //     .attr("y2", 0);
    //
    // // this is for y
    // dotsEnter.append("line")
    //     .filter(function(d){
    //         return d[select_y] === 1})
    //     .attr("class", "error-line-y")
    //     .attr("x1", 0)
    //     .attr("y1",(std_y/2))
    //     .attr("x2", 0)
    //     .style("opacity",0)
    //     .attr("y2", -(std_y/2));
    //
    // d3.selectAll(".error-line-x").style("opacity",1);
    // d3.selectAll(".error-line-y").style("opacity",1);



    function redraw_error() {
        // ****this draws it over the layout already****
        var std_x = d3.deviation(whiskey, function(d) { return d[chartScales.x]; });
        var std_y = d3.deviation(whiskey, function(d) { return d[chartScales.y]; });

        if(typeof dots_chart_line_x === 'undefined'){ // bars
        }else{
            dots_chart_line_x.remove().exit();
        }if(typeof dots_chart_line_y === 'undefined'){ // bars
            console.log('dotschart undefined');
        }else {
            dots_chart_line_y.remove().exit();
            // dots_remove.remove().exit();
        }

        function error_x(){
            dots_chart_line_x = chartG.append("g").selectAll("line")
                .data(whiskey)
                .enter()
                .filter(function(d){
                    return d[select_x] ===1})
                .append("line")
                // .transition() // Add transition - this will interpolate the translate() on any changes
                .attr("class", "normal-line")
                // .attr("x1", function (d) {
                //     console.log("log data x scale",xScale(d[chartScales.x]),d[chartScales.x],xScale(d[chartScales.x]+std_y/2),d[chartScales.x]+std_y/2);
                //     return xScale(d[chartScales.x]-std_x/2 );
                // })
                .attr("x1", function (d) {
                    if(xScale(d[chartScales.x]-std_x/2) <= 0){
                        console.log('minus',xScale(d[chartScales.x]-std_x/2),xScale(d[chartScales.x]),d[chartScales.x]-std_x/2,d[chartScales.x]);
                        return xScale(d[chartScales.x]-std_x/2 + xScaleMin -(d[chartScales.x]-std_x/2));
                    }else{
                        return xScale(d[chartScales.x]-std_x/2);
                    }
                })
                .attr("y1", function (d) {
                    return yScale(d[chartScales.y]);
                })
                .attr("x2", function (d) {
                    return xScale(d[chartScales.x] +std_x/2);
                })
                .attr("y2", function (d) {
                    return yScale(d[chartScales.y]);
                });
                // .style("opacity",function(d){
                //     if(xScale(d[chartScales.x]-std_x/2 < 0)){return 0;}
                //     else{return 1;}
                // });
        }

        function error_y(){
            dots_chart_line_y = chartG.append("g").selectAll("line")
                .data(whiskey)
                .enter()
                .filter(function(d){
                    return d[select_y] ===1})
                .append("line")
                .attr("class", "normal-line")
                .attr("x1", function (d) {
                    return xScale(d[chartScales.x] );
                })
                .attr("y1", function (d) {
                    return yScale(d[chartScales.y]-std_y/2);
                })
                .attr("x2", function (d) {
                    return xScale(d[chartScales.x] );
                })
                // .attr("y2", function (d) {
                //     return yScale(d[chartScales.y]+std_y/2);
                // });
                .attr("y2", function (d) {
                    // console.log("log data y scale",yScale(d[chartScales.y]),d[chartScales.y],yScale(d[chartScales.y]+std_y/2),d[chartScales.y]+std_y/2);
                    return yScale(d[chartScales.y]+std_y/2);
                });
                // .style("opacity",function(d){
                //     console.log(d[chartScales.y]-std_y/2,d[chartScales.y],std_y/2);
                //     if(yScale(d[chartScales.y]-std_y/2 < yScaleMax)){return 0;}
                //     else{return 1;}
                // })
        }

        setTimeout(error_x(),2000);
        setTimeout(error_y(),2000);

        // if(typeof dots_chart === 'undefined'){ // bars
        //      dots_chart = chartG.append("g").attr('class', "Scatter")
        //     .selectAll("circle")
        //     // .data(whiskey)
        //     .data(filtered_data)
        //     .enter()
        //     .append('circle')
        //     .style("fill", 'red')
        //     .attr("cx", function (d) {
        //         return xScale(d[chartScales.x]);
        //     })
        //     .attr("cy", function (d) {
        //         return yScale(d[chartScales.y]);
        //     })
        //     // .attr('r', 4);
        //     .attr('r', 4);
        //
        //      dots_chart_line = chartG.append("g").selectAll("line")
        //     .data(filtered_data)
        //     .enter()
        //     .filter(function(d){
        //         return d[select_x] ===1})
        //     .append("line")
        //     .attr("class", "error-line")
        //     .attr("x1", function (d) {
        //         return xScale(d[chartScales.x]-std_x/2 );
        //     })
        //     .attr("y1", function (d) {
        //         return yScale(d[chartScales.y]);
        //     })
        //     .attr("x2", function (d) {
        //         return xScale(d[chartScales.x] +std_x/2);
        //     })
        //     .attr("y2", function (d) {
        //         return yScale(d[chartScales.y]);
        //     });
        //
        // dots_chart_line_y = chartG.append("g").selectAll("line")
        //     .data(filtered_data)
        //     .enter()
        //     .filter(function(d){
        //         return d[select_y] ===1})
        //     .append("line")
        //     .attr("class", "error-line")
        //     .attr("x1", function (d) {
        //         return xScale(d[chartScales.x] );
        //     })
        //     .attr("y1", function (d) {
        //         return yScale(d[chartScales.y]+std_y/2);
        //     })
        //     .attr("x2", function (d) {
        //         return xScale(d[chartScales.x] );
        //     })
        //     .attr("y2", function (d) {
        //         return yScale(d[chartScales.y]-std_y/2);
        //     });
        // }else{
        //     // dots_chart.remove().exit(); //remove some of the encodings


        // }
        //*****upto this part****

        // this is for x
        // d3.selectAll(".error-line").style("opacity",1);

        // d3.selectAll(".error-line").style("opacity",1);

        // d3.selectAll(".error-line-x").style("opacity",1);
        // d3.selectAll(".error-line-y").style("opacity",1);



    }// end of scatter error

}// end of updatechart for Scatterplots
