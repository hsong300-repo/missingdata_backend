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

function restart_animation(){
    var std_x = d3.deviation(whiskey, function(d) { return d[chartScales.x]; });
    var std_y = d3.deviation(whiskey, function(d) { return d[chartScales.y]; });

    // var transition_x = d3.selectAll(".impute_x");
    var transition_x = d3.selectAll("circle").filter(function(d){return d[select_x] ===1; });

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

    var transition_y = d3.selectAll("circle").filter(function(d){return d[select_y] ===1; });

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

    var transition_xy = d3.selectAll("circle").filter(function(d){return d[select_x] ===1 && d[select_y] === 1 ; });

    function repeat_xy(){
        transition_xy.transition()
            .duration(1000)
            // .attr('x',-std_x)
            .attr('cx',-std_x)
            .transition()
            .duration(1000)
            .attr('cx',std_x)
            .transition()
            .duration(1000)
            .attr("cx", 0)
            .transition()
            .duration(1000)
            .attr('cy',-std_y)
            .transition()
            .duration(1000)
            .attr('cy',std_y)
            .transition()
            .duration(1000)
            .attr("cy", 0);

    }

    if(select_x === select_y){
        repeat_xy();
    }else{
        repeat_x();
        repeat_y();
    }


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

    std_x = d3.deviation(whiskey, function(d) { return d[chartScales.x]; });
    std_y = d3.deviation(whiskey, function(d) { return d[chartScales.y]; });

    // Create and position scatterplot circles
    // User Enter, Update (don't need exit)
    dots = chartG.selectAll('.dot')
        .data(whiskey);
    // .data(noimpute_data);

    // dots.exit().remove();

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

    d3.selectAll(("input[value='animation']")).on("change", function() {
        redraw_animation();
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

    // ENTER + UPDATE selections - bindings that happen on all updateChart calls
    dots.merge(dotsEnter)
    // dots.merge(dotsEnter)
        .transition() // Add transition - this will interpolate the translate() on any changes
        .duration(750)
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
        .filter(function(d){return d[select_x] ===0 && d[select_y] ===0})
        .style("fill","steelblue");


    if(impute_flag === true){
        filter_impute();
    }else if(no_impute_flag === true){
        filter_no_impute();
    }else if(both_flag === true){
        filter_both();
    }

    restart_animation();

    function redraw_animation() {

        var std_x = d3.deviation(whiskey, function(d) { return d[chartScales.x]; });
        var std_y = d3.deviation(whiskey, function(d) { return d[chartScales.y]; });

            // var transition_x = d3.selectAll(".impute_x");
        var transition_x = d3.selectAll("circle").filter(function(d){return d[select_x] ===1; });

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

        var transition_y = d3.selectAll("circle").filter(function(d){return d[select_y] ===1; });

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

        var transition_xy = d3.selectAll("circle").filter(function(d){return d[select_x] ===1 && d[select_y] === 1 ; });

        function repeat_xy(){
            transition_xy.transition()
                .duration(1000)
                // .attr('x',-std_x)
                .attr('cx',-std_x)
                .transition()
                .duration(1000)
                .attr('cx',std_x)
                .transition()
                .duration(1000)
                .attr("cx", 0)
                .transition()
                .duration(1000)
                .attr('cy',-std_y)
                .transition()
                .duration(1000)
                .attr('cy',std_y)
                .transition()
                .duration(1000)
                .attr("cy", 0);

        }

        if(select_x === select_y){
            repeat_xy();
        }else{
            repeat_x();
            repeat_y();
        }

    }// end of animation

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

        // d3.selectAll("circle")
        //     .filter(function(d){return d[select_x] ===1 })
        //     .style('fill',)
        //     .style("opacity",1);
        //
        // d3.selectAll("circle")
        //     .filter(function(d){return d[select_y] ===1 })
        //     .style("opacity",1);

    }// end of imputed filter

    function filter_no_impute() {

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

        // d3.selectAll("circle")
        //     .style("fill",function(d){
        //         if(d[select_x] ===1 || d[select_y] === 1){return "url(#diagonal-stripes)";}
        //         else{return "steelblue";}
        //     })
        //     .style("opacity",0.8);

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

    }// end of imputed filter






}// end of updatechart for Scatterplots