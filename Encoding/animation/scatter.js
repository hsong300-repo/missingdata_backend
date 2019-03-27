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

function restart_animation(){
    var transition_x = d3.selectAll(".impute_x");

    function repeat_x(){
        transition_x.transition()
            .duration(1000)
            // .attr('x',-std_x)
            .attr('cx',-std_x)
            .transition()
            .duration(1000)
            .attr('cx',std_x)
            .transition()
            .duration(1000)
            .attr("cx", 0);
    }

    var transition_y = d3.selectAll(".impute_y");
    // var transition_y = d3.selectAll(".impute")
    //     .filter(function(d){
    //         return d[select_y] ===1 });

    function repeat_y(){
        transition_y.transition()
            .duration(1000)
            .attr('cy',-std_y)
            .transition()
            .duration(1000)
            .attr('cy',std_y)
            .transition()
            .duration(1000)
            .attr("cy", 0);
    }

    repeat_x();
    repeat_y();

    d3.selectAll(".error-line")
        .style("opacity",0);

}

// Also, declare global variables for missing amount, total amount, and percentage
missing_count = 0;
total_count = 0;
per = 0;


// the work flow is like when click on a button it will remove the other one
//or this button is to remove
function drawBar() {
    document.getElementById('bar_view').style.display = "inline";
    document.getElementById('bar_radio').style.display = "inline";
    document.getElementById('scatter_radio').style.display = "none";
    document.getElementById('scatter_view').style.display = "none";
}

//show scatter when after click button
function drawScatter() {
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

    // var dotsEnter = dots.enter()
    dotsEnter = dots.enter()
        .append('g')
        .attr('class', 'dot')
        .attr("fill","steelblue")
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
    dotsEnter.append('circle')
        .filter(function(d){
            return d[select_x] === 0 && d[select_y] === 0})
        .attr("class","no_impute")
        .style("fill","steelblue")
        .attr('r', 4);

    dotsEnter.append('circle')
        .filter(function(d){
            return d[select_x] ===1 || d[select_y] === 1})
        .attr("class","impute")
        .style("fill","steelblue")
        .style("opacity",0)
        .attr('r', 4);

    dotsEnter.append('circle')
        .filter(function(d){
            return d[select_x] ===1 })
        .style("fill","#87CEFA")
        .attr("class","impute_x")
        .style("opacity",1)
        .attr('r', 4);

    dotsEnter.append('circle')
        .filter(function(d){
            return d[select_y] === 1})
        .style("fill","#87CEFA")
        .attr("class","impute_y")
        .style("opacity",1)
        .attr('r', 4);
    //
    // dotsEnter.append('circle')
    //     .filter(function(d){
    //         return d[select_x] ===1 && d[select_y] === 1})
    //     .attr("class","impute")
    //     .style("fill","pink")
    //     .style("opacity",1)
    //     .attr('r', 4);


    std_x = d3.deviation(whiskey, function(d) { return d[chartScales.x]; });
    std_y = d3.deviation(whiskey, function(d) { return d[chartScales.y]; });

    dotsEnter.append('text')
        .attr('y', -10)
        .text(function(d) {
            // console.log('price impute',d.price_impute);
            return d.Name;
            // return d.Brand
            // return d[chartScales.x];
        });

    d3.selectAll(("input[value='animation']")).on("change", function() {
        console.log('onchange animation');
        redraw_animation();
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


    if(typeof dots_chart === 'undefined'){ // bars
        console.log('dotschart undefined');
    }else{
        dots_chart.remove().exit(); //remove some of the encodings
    }
    if(typeof dots_chart_line === 'undefined'){ // bars
        console.log('dotschart undefined');
    }else{
        dots_chart_line.remove().exit();
        // dots_remove.remove().exit();

    }if(typeof dots_chart_line_y === 'undefined'){ // bars
        console.log('dotschart undefined');
    }else {
        dots_chart_line_y.remove().exit();
        // dots_remove.remove().exit();
    }if(typeof dots_chart_x === 'undefined'){ // bars
        console.log('dotschart undefined');
    }else{
        dots_chart_x.remove().exit(); //remove some of the encodings
    }if(typeof dots_chart_y === 'undefined'){ // bars
        console.log('dotschart undefined');
    }else{
        dots_chart_y.remove().exit(); //remove some of the encodings
    }

    function redraw_pattern() {

        // if(typeof dots_chart === 'undefined'){ // bars
        // }else{
        //     dots_chart.remove().exit(); //remove some of the encodings
        // }
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


        // dots_chart = chartG.append("g").attr('class', "Scatter")
        //     .selectAll("circle")
        //     // .data(whiskey)
        //     .data(filtered_data)
        //     .enter()
        //     .append('circle')
        //     .style("fill", 'url(#diagonal-stripes)')
        //     // .attr('stroke', '#000')
        //     // .attr('stroke-width', 1)
        //     .attr("cx", function (d) {
        //         return xScale(d[chartScales.x]);
        //     })
        //     .attr("cy", function (d) {
        //         return yScale(d[chartScales.y]);
        //     })
        //     .attr('r', 4);

        // d3.selectAll(".impute")
        //     .style("fill", 'url(#diagonal-stripes)').style("opacity",1);

        d3.selectAll(".impute_x")
            .style("fill", 'url(#diagonal-stripes)').style("opacity",1);


        d3.selectAll(".impute_y")
            .style("fill", 'url(#diagonal-stripes)').style("opacity",1);


        d3.selectAll(".no_impute")
            .style("fill", 'steelblue').style("opacity",1);

        d3.selectAll(".rect_impute")
            .style("opacity",0);

        d3.selectAll(".rect_impute_x").style("opacity",0);

        d3.selectAll(".rect_impute_y").style("opacity",0);


        shape_check = false;


    }// end of pattern

    function redraw_animation() {

        // if(typeof dots_chart_line === 'undefined'){ // bars
        // }else{
        //     dots_chart_line.remove().exit();
        // }if(typeof dots_chart_line_y === 'undefined'){ // bars
        //         console.log('dotschart undefined');
        // }else {
        // dots_chart_line_y.remove().exit();
        // // dots_remove.remove().exit();
        // }if(typeof dots_chart_x === 'undefined'){ // bars
        //     console.log('dotschart undefined');
        // }else{
        //     dots_chart_x.remove().exit(); //remove some of the encodings
        // }if(typeof dots_chart_y === 'undefined'){ // bars
        //     console.log('dotschart undefined');
        // }else{
        //     dots_chart_y.remove().exit(); //remove some of the encodings
        // }

        // if(typeof dots_chart === 'undefined'){ // bars
        //      dots_chart_x = chartG.append("g").attr('class', "Scatter")
        //         .selectAll("circle")
        //         .data(whiskey)
        //         .enter()
        //         .append('circle')
        //         .filter(function(d){
        //                 return d[select_x] ===1 })
        //         .style("stroke", 'steelblue')
        //         // .style("stroke-width", 1)
        //         .style("fill", 'steelblue')
        //         .attr("cx", function (d) {
        //             return xScale(d[chartScales.x]);
        //         })
        //         .attr("cy", function (d) {
        //             return yScale(d[chartScales.y]);
        //         })
        //         .attr('r', 4);
        //
        //     dots_chart_y = chartG.append("g").attr('class', "Scatter")
        //         .selectAll("circle")
        //         .data(whiskey)
        //         .enter()
        //         .append('circle')
        //         .filter(function(d){
        //                 return d[select_y] ===1 })
        //         .style("stroke", 'steelblue')
        //         // .style("stroke-width", 1)
        //         .style("fill", 'steelblue')
        //         .attr("cx", function (d) {
        //             return xScale(d[chartScales.x]);
        //         })
        //         .attr("cy", function (d) {
        //             return yScale(d[chartScales.y]);
        //         })
        //         .attr('r', 4);
        //     shape_check = false;
        // }else{
        //       dots_chart_x = dots_chart.filter(function(d){
        //             return d[select_x] ===1 });
        //       dots_chart_y = dots_chart.filter(function(d){
        //             return d[select_y] ===1 });
        // }
        //
        //
        //
        // if(shape_check === false){
        //      move_x = dots_chart_x.transition()
        //         .duration(2000)
        //         .attr('cx',0)
        //         .transition()
        //         .duration(2000)
        //         .attr('cx',420)
        //         .transition()
        //         .duration(2000)
        //         .attr("cx", function (d) {
        //             return xScale(d[chartScales.x]);
        //         });
        //
        //     move_y = dots_chart_y.transition()
        //         .filter(function(d){
        //                 return d[select_y] ===1 })
        //         .duration(2000)
        //         // .attr('cy',420)
        //         .attr('cy',0)
        //         .transition()
        //         .duration(2000)
        //         .attr('cy',420)
        //         .transition()
        //         .duration(2000)
        //         .attr("cy", function (d) {
        //             return yScale(d[chartScales.y]);
        //         });
        // }else if(shape_check === true){
        //      move_x = dots_chart_x.transition()
        //         .duration(2000)
        //         .attr('x',0)
        //         .transition()
        //         .duration(2000)
        //         .attr('x',420)
        //         .transition()
        //         .duration(2000)
        //         .attr("x", function (d) {
        //             return xScale(d[chartScales.x]);
        //         });
        //
        //     move_y = dots_chart_y.transition()
        //         .filter(function(d){
        //                 return d[select_y] ===1 })
        //         .duration(2000)
        //         // .attr('cy',420)
        //         .attr('y',0)
        //         .transition()
        //         .duration(2000)
        //         .attr('y',420)
        //         .transition()
        //         .duration(2000)
        //         .attr("y", function (d) {
        //             return yScale(d[chartScales.y]);
        //         });
        // }

        // var std_x = d3.deviation(whiskey, function(d) { return d[chartScales.x]; });
        // var std_y = d3.deviation(whiskey, function(d) { return d[chartScales.y]; });

        if(shape_check === false){
            var transition_x = d3.selectAll(".impute_x");

            function repeat_x(){
                transition_x.transition()
                    .duration(1000)
                    // .attr('x',-std_x)
                    .attr('cx',-std_x)
                    .transition()
                    .duration(1000)
                    .attr('cx',std_x)
                    .transition()
                    .duration(1000)
                    .attr("cx", 0);
            }

            var transition_y = d3.selectAll(".impute_y");
            // var transition_y = d3.selectAll(".impute")
            //     .filter(function(d){
            //         return d[select_y] ===1 });

            function repeat_y(){
                transition_y.transition()
                    .duration(1000)
                    .attr('cy',-std_y)
                    .transition()
                    .duration(1000)
                    .attr('cy',std_y)
                    .transition()
                    .duration(1000)
                    .attr("cy", 0);
            }

            repeat_x();
            repeat_y();

        }else{
            var transition_x = d3.selectAll(".rect_impute_x");

            // .transition().duration(2000);
            function repeat_x(){
                transition_x.transition()
                    .duration(1000)
                    // .attr('x',-std_x)
                    .attr('x',-std_x)
                    .transition()
                    .duration(1000)
                    .attr('x',std_x)
                    .transition()
                    .duration(1000)
                    .attr("x", 0);
            }


            var transition_y= d3.selectAll(".rect_impute_y");

            function repeat_y(){
                transition_y.transition()
                    .duration(1000)
                    .attr('y',-std_y)
                    .transition()
                    .duration(1000)
                    .attr('y',std_y)
                    .transition()
                    .duration(1000)
                    .attr("y", 0);
            }

            repeat_x();
            repeat_y();

        }


        // .transition().duration(2000);

        // transition.attr("y", function(d){
        //         return height-y(d.value);
        //     }).attr("height",0)
        //     .transition().duration(2000)
        //     .attr("y", 0)
        //     .attr("height",function(d){
        //         return height -y(d.value);
        //     });

        shape_check = false;

        // dots_chart_x = chartG.append("g").attr('class', "Scatter")
        //     .selectAll("circle")
        //     .data(whiskey)
        //     .enter()
        //     .append('circle')
        //     .filter(function(d){
        //             return d[select_x] ===1 })
        //     .style("stroke", '#87CEFA')
        //     .style("stroke-width", 1)
        //     .style("fill", '#fff')
        //     .attr("cx", function (d) {
        //         return xScale(d[chartScales.x]);
        //     })
        //     .attr("cy", function (d) {
        //         return yScale(d[chartScales.y]);
        //     })
        //     .attr('r', 4);

        // dots_chart_y = chartG.append("g").attr('class', "Scatter")
        //     .selectAll("circle")
        //     .data(whiskey)
        //     .enter()
        //     .append('circle')
        //     .filter(function(d){
        //             return d[select_y] ===1 })
        //     .style("stroke", '#87CEFA')
        //     .style("stroke-width", 1)
        //     .style("fill", '#fff')
        //     .attr("cx", function (d) {
        //         return xScale(d[chartScales.x]);
        //     })
        //     .attr("cy", function (d) {
        //         return yScale(d[chartScales.y]);
        //     })
        //     .attr('r', 4);


        repeat_x();
        repeat_y();

        d3.selectAll(".error-line")
            .style("opacity",0);

    }// end of animation




}// end of updatechart for Scatterplots