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
impute_flag = false;
no_impute_flag = false;
both_flag = false;


// the work flow is like when click on a button it will remove the other one
//or this button is to remove


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

    // console.log('upatechart');
    // **** Draw and Update your chart here ****
    // Update the scales based on new data attributes
    yScale.domain(domainMap[chartScales.y]).nice();
    xScale.domain(domainMap[chartScales.x]).nice();

    console.log('yscale min',yScale.domain()[0],yScale.domain().slice(-1)[0]);
    var xScaleMin = xScale.domain()[0];
    var xScaleMax =xScale.domain().slice(-1)[0];

    console.log('xScaleMin',xScaleMin,xScale(xScaleMin));

    var yScaleMax =yScale.domain().slice(-1)[0];
    var yScaleMin =yScale.domain()[0];

    console.log('yScaleMax',yScaleMax,yScale(yScaleMax));
    console.log('yScaleMin',yScaleMin,yScale(yScaleMin));

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

    filtered_data = whiskey
        .filter(function(d){
            return d[select_x] === 1 || d[select_y] === 1});

    filtered_data_xy = whiskey
        .filter(function(d){
            return d[select_x] === 1 && d[select_y] === 1});


    filtered_x = whiskey
        .filter(function(d){
            return d[select_x] ===1});

    filtered_y = whiskey
        .filter(function(d){
            return d[select_y] ===1});

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
            // // Show the text, otherwise hidden
            // hovered.select('text')
            //     .style('visibility', 'visible');
            // Add stroke to circle to highlight it
            div.transition()
                .duration(200)
                .style("opacity", .9);
            // div	.html(d.Name)
            div	.html(d.Brand)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            hovered.select('circle')
                .style('stroke-width', 2)
                .style('stroke', '#333');
        })
        .on('mouseout', function(d){ // Add hover end event binding
            // Select the hovered g.dot
            var hovered = d3.select(this);
            // Remove the highlighting we did in mouseover
            // hovered.select('text')
            //     .style('visibility', 'hidden');
            hovered.select('circle')
                .style('stroke-width', 0)
                .style('stroke', 'none');
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });

    dotsEnter.append('circle')
        .attr("class","no_impute")
        .style("fill",function(d){
            if(d[select_x] ===1 || d[select_y] === 1){return "url(#diagonal-stripes)";}
            else{return "steelblue";}
        })
        .attr('r', 5);

    // Append a text to the ENTER selection
    // dotsEnter.append('text')
    //     .attr('y', -10)
    //     .text(function(d) {
    //         return d.Name;
    //     });

    d3.selectAll(("input[value='error']")).on("change", function() {
        console.log('onchange error');
        redraw_error();
    });

    d3.selectAll(("input[value='impute']")).on("change", function() {
        filter_impute();
    });

    d3.selectAll(("input[value='no_impute']")).on("change", function() {
        filter_no_impute();
    });

    d3.selectAll(("input[value='both']")).on("change", function() {
        filter_both();
    });

    std_x = d3.deviation(whiskey, function(d) { return d[chartScales.x]; });
    std_y = d3.deviation(whiskey, function(d) { return d[chartScales.y]; });

    console.log('std_x, std_y',std_x,std_y);

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
        .duration(200)
        // .duration(750)
        .attr('transform', function(d) {
            console.log('this gets called merge');
            // Transform the group based on x and y property
            var tx = xScale(d[chartScales.x]);
            var ty = yScale(d[chartScales.y]);
            return 'translate('+[tx, ty]+')';
        });

    d3.selectAll("circle")
        .filter(function(d){return d[select_x] ===1 || d[select_y] ===1})
        .style("fill","url(#diagonal-stripes)");

    d3.selectAll("circle")
        .filter(function(d){return d[select_x] ===0 && d[select_y] === 0})
        .style("fill","steelblue");



    // redraw_error();
    redraw_error();

    if(impute_flag === true){
        filter_impute();
    }else if(no_impute_flag === true){
        filter_no_impute();
    }else if(both_flag === true){
        filter_both();
    }

    function redraw_error() {
        // ****this draws it over the layout already****
        var std_x = d3.deviation(whiskey, function(d) { return d[chartScales.x]; });
        var std_y = d3.deviation(whiskey, function(d) { return d[chartScales.y]; });

        if(typeof dots_line_x === 'undefined'){ // bars
        }else{
            dots_line_x.remove().exit();
        }if(typeof dots_line_y === 'undefined'){ // bars
            console.log('dotschart undefined');
        }else {
            dots_line_y.remove().exit();
            // dots_remove.remove().exit();
        }

        function error_x(){
            dots_line_x = chartG.append("g").selectAll("line")
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
                        return xScale(d[chartScales.x]-std_x/2 + xScaleMin -(d[chartScales.x]-std_x/2)); // this so that the lines do not go over axis
                    }else{
                        return xScale(d[chartScales.x]-std_x/2);
                    }
                })
                .attr("y1", function (d) {
                    return yScale(d[chartScales.y]);
                })
                // .attr("x2", function (d) {
                //     return xScale(d[chartScales.x] +std_x/2);
                // })
                .attr("x2", function (d) {
                    if(xScale(d[chartScales.x]+std_x/2) >= 520){
                        return xScale(xScaleMax);
                    }else{
                        return xScale(d[chartScales.x]+std_x/2);
                    }
                })
                .attr("y2", function (d) {
                    return yScale(d[chartScales.y]);
                });

        }

        function error_y(){
            dots_line_y = chartG.append("g").selectAll("line")
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
                    if(yScale(d[chartScales.y]-std_y/2) >= 520){
                        return yScale(d[chartScales.y]-std_y/2 + yScaleMin-(d[chartScales.y]-std_y/2));
                    }else{
                        return yScale(d[chartScales.y]-std_y/2);
                    }
                })
                .attr("x2", function (d) {
                    return xScale(d[chartScales.x] );
                })
                // .attr("y2", function (d) {
                //     return yScale(d[chartScales.y]+std_y/2);
                // });
                .attr("y2", function (d) {
                    if(yScale(d[chartScales.y]+std_y/2) <= 0){// when it goes over maximum values
                        return yScale(yScaleMax);
                    }else{
                        return yScale(d[chartScales.y]+std_y/2);
                    }
                })
        }

        error_x();
        error_y();

        // if(impute_flag === true){
        //     filter_impute();
        // }else if(no_impute_flag === true){
        //     filter_no_impute();
        // }else if(both_flag === true){
        //     filter_both();
        // }

    }// end of scatter error


    function filter_impute() {

        d3.selectAll("circle")
            .style("fill",function(d){
                if(d[select_x] ===1 || d[select_y] === 1){return "url(#diagonal-stripes)";}
                else{return "steelblue";}
            })
            .style("opacity",function(d){
                if(d[select_x] ===1 || d[select_y] === 1){return 0.8;}
                else{return 0;}
            });

        impute_flag = true;
        no_impute_flag = false;
        both_flag = false;

        redraw_error();

    }// end of imputed filter

    function filter_no_impute() {

        // if(typeof dots_line_x === 'undefined'){ // bars
        // }else{
        //     dots_line_x.remove().exit();
        // }if(typeof dots_line_y === 'undefined'){ // bars
        //     console.log('dotschart undefined');
        // }else {
        //     dots_line_y.remove().exit();
        // }
        d3.selectAll("line").remove().exit();
        
        d3.selectAll("circle")
            .style("fill",function(d){
                if(d[select_x] ===0 && d[select_y] === 0){return "steelblue";}
                else{return "steelblue";}
            })
            .style("opacity",function(d){
                if(d[select_x] ===0 && d[select_y] === 0){return 0.8;}
                else{return 0;}
            });

        impute_flag = false;
        no_impute_flag = true;
        both_flag = false;


    }// end of no filter

    function filter_both() {
        d3.selectAll("circle")
            .filter(function(d){return d[select_x] ===1 || d[select_y] ===1})
            .style("fill","url(#diagonal-stripes)")
            .style("opacity",0.8);

        d3.selectAll("circle")
            .filter(function(d){return d[select_x] ===0 && d[select_y] ===0})
            .style("fill","steelblue")
            .style("opacity",0.8);


        impute_flag = false;
        no_impute_flag = false;
        both_flag = true;

        redraw_error();


    }// end of imputed filter

}// end of updatechart for Scatterplots
