var circles;

d3.select("#gene_search_box").on("change paste keyup", function() {
// d3.select("#txtName").on("change paste keyup", function() {
    highLight();

});

function highLight() {
    // var txtName = document.getElementById("txtName");
    var txtName = document.getElementById("gene_search_box");

    circles = svg.selectAll("circle");
    circles.style("fill", function(d) {
        if (d.Brand == txtName.value) {
            return "red"
        }else if(d[select_x] ===1 || d[select_y] === 1){
            return "url(#diagonal-stripes)";}
        else{
            return "steelblue";}
    });

}

function redraw_animation() {
    var std_x = d3.deviation(whiskey, function(d) { return d[chartScales.x]; });
    var std_y = d3.deviation(whiskey, function(d) { return d[chartScales.y]; });

    // var transition_x = d3.selectAll(".impute_x");
    var transition_x = d3.selectAll("circle")
        .filter(function(d){return d[select_x] ===1; });

    function repeat_x(){
        transition_x
            .transition()
            .duration(1000)
            .attr("cx", function (d) {
                if(xScale(d[chartScales.x]-std_x/2) <= 0){
                    return xScale(d[chartScales.x]-std_x/2 + xScaleMin -(d[chartScales.x]-std_x/2))-xScale(d[chartScales.x]); // this so that the lines do not go over axis
                }else{
                    return xScale(d[chartScales.x]-std_x/2) -xScale(d[chartScales.x]);
                }
            })
            .transition()
            .duration(1000)
            .attr("cx", function (d) {
                if(xScale(d[chartScales.x]+std_x/2) >= 520){
                    return xScale(xScaleMax) -xScale(d[chartScales.x]);
                }else{
                    return xScale(d[chartScales.x]+std_x/2) -xScale(d[chartScales.x]);
                }
            })
            .transition()
            .duration(1000)
            .attr("cx", function (d) {
                return xScale(d[chartScales.x]) -xScale(d[chartScales.x]);
            });
    }

    function repeat_y(){
        var transition_y = d3.selectAll("circle").filter(function(d){return d[select_y] === 1});
        transition_y
            .transition()
            .duration(1000)
            .attr("cy", function (d) {
                if(yScale(d[chartScales.y]-std_y/2) >= 520){
                    return yScale(d[chartScales.y]-std_y/2 + yScaleMin-(d[chartScales.y]-std_y/2)) -yScale(d[chartScales.y]);
                }else{
                    return yScale(d[chartScales.y]-std_y/2) - yScale(d[chartScales.y]);
                }
            })
            .transition()
            .duration(1000)
            .attr("cy", function (d) {
                if(yScale(d[chartScales.y]+std_y/2) <= 0){// when it goes over maximum values
                    return yScale(yScaleMax) -yScale(d[chartScales.y]);
                }else{
                    return yScale(d[chartScales.y]+std_y/2) - yScale(d[chartScales.y]);
                }
            })
            .transition()
            .duration(1000)
            .attr("cy", function (d) {
                return yScale(d[chartScales.y]) - yScale(d[chartScales.y]);
            });

    }

    var transition_xy = d3.selectAll("circle").filter(function(d){return d[select_x] ===1 && d[select_y] === 1 ; });

    function repeat_xy(){
        transition_xy
            .transition()
            .duration(1000)
            .attr("cx", function (d) {
                if(xScale(d[chartScales.x]-std_x/2) <= 0){
                    return xScale(d[chartScales.x]-std_x/2 + xScaleMin -(d[chartScales.x]-std_x/2)) -xScale(d[chartScales.x]); // this so that the lines do not go over axis
                }else{
                    return xScale(d[chartScales.x]-std_x/2)-xScale(d[chartScales.x]);
                }
            })
            .transition()
            .duration(1000)
            .attr("cx", function (d) {
                if(xScale(d[chartScales.x]+std_x/2) >= 520){
                    return xScale(xScaleMax) -xScale(d[chartScales.x]);
                }else{
                    return xScale(d[chartScales.x]+std_x/2) -xScale(d[chartScales.x]);
                }
            })
            .transition()
            .duration(1000)
            .attr("cx", function (d) {
                return xScale(d[chartScales.x]) -xScale(d[chartScales.x]);
            })
            .transition()
            .duration(1000)
            .attr("cy", function (d) {
                if(yScale(d[chartScales.y]-std_y/2) >= 520){
                    return yScale(d[chartScales.y]-std_y/2 + yScaleMin-(d[chartScales.y]-std_y/2)) -yScale(d[chartScales.y]);
                }else{
                    return yScale(d[chartScales.y]-std_y/2) -yScale(d[chartScales.y]);
                }
            })
            .transition()
            .duration(1000)
            .attr("cy", function (d) {
                if(yScale(d[chartScales.y]+std_y/2) <= 0){// when it goes over maximum values
                    return yScale(yScaleMax) -yScale(d[chartScales.y]);
                }else{
                    return yScale(d[chartScales.y]+std_y/2) -yScale(d[chartScales.y]);
                }
            })
            .transition()
            .duration(1000)
            .attr("cy", function (d) {
                return yScale(d[chartScales.y]) -yScale(d[chartScales.y]);
            });

    }

    if(select_x === select_y){
        repeat_xy();
    }else{
        repeat_x();
        repeat_y();

    }

}// end of animation


// Global functions called when select elements changed
function onXScaleChanged() {

    if(typeof points === 'undefined'){ // this part removes the zoomed redrawn objects
    }else{
        points.remove().exit();
    }
    zoom_called = false;

    var select = d3.select('#xScaleSelect').node();
    // Get current value of select element, save to global chartScales
    chartScales.x = select.options[select.selectedIndex].value;

    console.log('XScale change');
    // Update chart

    updateChart();
}

function onYScaleChanged() {
    if(typeof points === 'undefined'){ // this part removes the zoomed redrawn objects
    }else{
        points.remove().exit();
    }
    zoom_called = false;



    var select = d3.select('#yScaleSelect').node();
    // Get current value of select element, save to global chartScales
    chartScales.y = select.options[select.selectedIndex].value;


    // Update chart
    updateChart();
}

function restart_animation(){
    // restart_animation_zoom()

    if (zoom_called === true) {
        console.log('restart_animation_zoom');
        restart_animation_zoom()
    }
    if(zoom_called === false){
        console.log('redraw_animation');

        redraw_animation()
    }
}

function restart_animation_zoom(){
    // var new_xScale = d3.event.transform.rescaleX(xScale);
    // var new_yScale = d3.event.transform.rescaleY(yScale);

    var xScaleMin = new_xScale.domain()[0];
    var xScaleMax = new_xScale.domain().slice(-1)[0];

    var yScaleMax = new_yScale.domain().slice(-1)[0];
    var yScaleMin = new_yScale.domain()[0];

    var std_x = d3.deviation(whiskey, function(d) { return d[chartScales.x]; });
    var std_y = d3.deviation(whiskey, function(d) { return d[chartScales.y]; });

    // var transition_x = d3.selectAll(".impute_x");
    var transition_x = d3.selectAll("circle")
        .filter(function(d){return d[select_x] ===1; });

    function repeat_x(){
        transition_x
            .transition()
            .duration(1000)
            .attr("cx", function (d) {
                if(new_xScale(d[chartScales.x]-std_x/2) <= 0){
                    return new_xScale(d[chartScales.x]-std_x/2 + xScaleMin -(d[chartScales.x]-std_x/2))-new_xScale(d[chartScales.x]); // this so that the lines do not go over axis
                }else{
                    return new_xScale(d[chartScales.x]-std_x/2) - new_xScale(d[chartScales.x]);
                }
            })
            .transition()
            .duration(1000)
            .attr("cx", function (d) {
                if(new_xScale(d[chartScales.x]+std_x/2) >= 520){
                    return new_xScale(xScaleMax) - new_xScale(d[chartScales.x]);
                }else{
                    return new_xScale(d[chartScales.x]+std_x/2) - new_xScale(d[chartScales.x]);
                }
            })
            .transition()
            .duration(1000)
            .attr("cx", function (d) {
                return new_xScale(d[chartScales.x]) - new_xScale(d[chartScales.x]);
            });
    }

    function repeat_y(){
        var transition_y = d3.selectAll("circle").filter(function(d){return d[select_y] === 1});

        transition_y
            .transition()
            .duration(1000)
            .attr("cy", function (d) {
                if(new_yScale(d[chartScales.y]-std_y/2) >= 520){
                    return new_yScale(d[chartScales.y]-std_y/2 + yScaleMin-(d[chartScales.y]-std_y/2)) - new_yScale(d[chartScales.y]);
                }else{
                    return new_yScale(d[chartScales.y]-std_y/2) - new_yScale(d[chartScales.y]);
                }
            })
            .transition()
            .duration(1000)
            .attr("cy", function (d) {
                if(new_yScale(d[chartScales.y]+std_y/2) <= 0){// when it goes over maximum values
                    return new_yScale(yScaleMax) - new_yScale(d[chartScales.y]);
                }else{
                    return new_yScale(d[chartScales.y]+std_y/2) - new_yScale(d[chartScales.y]);
                }
            })
            .transition()
            .duration(1000)
            .attr("cy", function (d) {
                return new_yScale(d[chartScales.y]) - new_yScale(d[chartScales.y]);
            });

    }

    var transition_xy = d3.selectAll("circle").filter(function(d){return d[select_x] ===1 && d[select_y] === 1 ; });

    function repeat_xy(){

        transition_xy
            .transition()
            .duration(1000)
            .attr("cx", function (d) {
                if(new_xScale(d[chartScales.x]-std_x/2) <= 0){
                    return new_xScale(d[chartScales.x]-std_x/2 + xScaleMin -(d[chartScales.x]-std_x/2)) - new_xScale(d[chartScales.x]); // this so that the lines do not go over axis
                }else{
                    return new_xScale(d[chartScales.x]-std_x/2)- new_xScale(d[chartScales.x]);
                }
            })
            .transition()
            .duration(1000)
            .attr("cx", function (d) {
                if(new_xScale(d[chartScales.x]+std_x/2) >= 520){
                    return new_xScale(xScaleMax) - new_xScale(d[chartScales.x]);
                }else{
                    return new_xScale(d[chartScales.x]+std_x/2) - new_xScale(d[chartScales.x]);
                }
            })
            .transition()
            .duration(1000)
            .attr("cx", function (d) {
                return new_xScale(d[chartScales.x]) - new_xScale(d[chartScales.x]);
            })
            .transition()
            .duration(1000)
            .attr("cy", function (d) {
                if(new_yScale(d[chartScales.y]-std_y/2) >= 520){
                    return new_yScale(d[chartScales.y]-std_y/2 + yScaleMin-(d[chartScales.y]-std_y/2)) - new_yScale(d[chartScales.y]);
                }else{
                    return new_yScale(d[chartScales.y]-std_y/2) - new_yScale(d[chartScales.y]);
                }
            })
            .transition()
            .duration(1000)
            .attr("cy", function (d) {
                if(new_yScale(d[chartScales.y]+std_y/2) <= 0){// when it goes over maximum values
                    return new_yScale(yScaleMax) - new_yScale(d[chartScales.y]);
                }else{
                    return new_yScale(d[chartScales.y]+std_y/2) - new_yScale(d[chartScales.y]);
                }
            })
            .transition()
            .duration(1000)
            .attr("cy", function (d) {
                return new_yScale(d[chartScales.y]) - new_yScale(d[chartScales.y]);
            });

    }

    if(select_x === select_y){
        repeat_xy();
    }else{
        repeat_x();
        repeat_y();

    }
}


function textProcess(temp_x,temp_y) {
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

    let select_x = temp_x.concat("_impute");
    let select_y = temp_y.concat("_impute");


    return {
        select_x,
        select_y
    }
}

// this part is for the filtering per radio
impute_flag = false;
no_impute_flag = false;
both_flag = false;
zoom_called = false;

// the work flow is like when click on a button it will remove the other one
//or this button is to remove
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

// **zoom**create a clipping region
// svg.append("defs").append("clipPath")
chartG.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", chartWidth)
    .attr("height", chartHeight);
/**/

var xAxisG = chartG.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate('+[0, chartHeight]+')');

var yAxisG = chartG.append('g')
.attr('class', 'y axis');
    // .attr('class', 'y-axis'); //there was a overlap in class name for bar

var transitionScale = d3.transition()
    .duration(600)
    .ease(d3.easeLinear);



//****scatter plot
function updateChart() {
    // **** Draw and Update your chart here ****
    // Update the scales based on new data attributes
    yScale.domain(domainMap[chartScales.y]).nice();
    xScale.domain(domainMap[chartScales.x]).nice();

    xScaleMin = xScale.domain()[0];
    xScaleMax = xScale.domain().slice(-1)[0];

    yScaleMax =yScale.domain().slice(-1)[0];
    yScaleMin =yScale.domain()[0];

    // Update the axes here first, added gx, gy variable for zoom
    xAxisG.transition()
        .duration(750) // Add transition
        .call(d3.axisBottom(xScale));
    yAxisG.transition()
        .duration(750) // Add transition
        .call(d3.axisLeft(yScale));

    // these were declared as local initially
    const select = textProcess(chartScales.x,chartScales.y);

    select_x = select.select_x;
    select_y = select.select_y;

    // Create and position scatterplot circles
    // User Enter, Update (don't need exit)
    dots = chartG
        // .selectAll('circle')
        .append("g") //zoom, this helps it stay in the region
        .attr("clip-path", "url(#clip)") //zoom
        .selectAll('.dot')
        // .data(data);
        .data(whiskey);

    // Define the div for the tooltip
    var div = d3.select("body").append("div")
        .attr("class", "tooltip");

    // var dotsEnter = dots.enter()
    dotsEnter = dots.enter()
        .append('g')
        .attr('class', 'dot')
        // .classed("points_g", true) //zoom
        .on('mouseover', function(d){ // Add hover start event binding
            var hovered = d3.select(this);
            console.log('hovered',hovered);
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html(function(){
                if(d[select_x]===1 && d[select_y]===0){
                    return  "Brand: "+d.Brand + "<br>" +chartScales.x + ": "+ "<span style='color: #FF0000;'>" + d[chartScales.x]+ " (Est.)"+ "</span>"+"<br>" + chartScales.y + ": " + d[chartScales.y]
                }else if(d[select_y] === 1 && d[select_x] === 0){
                    return  "Brand: "+d.Brand + "<br>" + chartScales.x + ": " + d[chartScales.x]+ "<br>" + chartScales.y + ": " + "<span style='color: #FF0000;'>"+ d[chartScales.y] + " (Est.)"+"</span>"
                }else if(d[select_x] ===0 && d[select_y] === 0){
                    return  "Brand: "+d.Brand + "<br>" + chartScales.x + ": " + d[chartScales.x]+ "<br>" + chartScales.y + ": " + d[chartScales.y]
                }else if(d[select_x] ===1  && d[select_y] === 1){
                    return  "Brand: "+d.Brand + "<br>" + chartScales.x + ": " + "<span style='color: #FF0000;'>"+d[chartScales.x]+ " (Est.)"+"</span>"+ "<br>" + chartScales.y + ": " + "<span style='color: #FF0000;'>"+ d[chartScales.y] + " (Est.)"+"</span>"
                }
            })
                .style("left", "1050px")
                .style("top", "100px");
            hovered.select('circle')
                .style('stroke-width', 2)
                .style('stroke', '#333');
        })
        .on('mouseout', function(d){ // Add hover end event binding
            var hovered = d3.select(this);
            // Remove the highlighting we did in mouseover
            // hovered.select('text')
            //     .style('visibility', 'hidden');
            hovered.select('circle')
                // .style('stroke-width', 0)
                // .style('stroke', 'none');
                .style('stroke-width', 1)
                .style('stroke', '#000');
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });

    // Append a circle to the ENTER selection
    // dotsEnter = dotsEnter.append('circle')
    //it is using a new variable to get rid of redrawing
    points = dotsEnter.append('circle')
        // .attr("class","no_impute")
        .attr("cx",function(d){xScale(d[chartScales.x])})
        .attr("cy",function(d){yScale(d[chartScales.y])})
        .style("fill",function(d){
            if(d[select_x] ===1 || d[select_y] === 1){return "url(#diagonal-stripes)";}
            else{return "steelblue";}
        })
        .attr('r', 5);



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

    // restart_animation();
    redraw_animation();//should renew this again

    var txtName = document.getElementById("gene_search_box");

    if(txtName.value){
        highLight();
    }

    if(impute_flag === true){
        filter_impute();
    }else if(no_impute_flag === true){

        filter_no_impute();
    }else if(both_flag === true){
        filter_both();
    }


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

        var txtName = document.getElementById("gene_search_box");


        if(txtName.value){
            highLight();
        }

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

        // var txtName = document.getElementById("txtName");
        var txtName = document.getElementById("gene_search_box");

        if(txtName.value){
            highLight();
        }


    }// end of no filter

    function filter_both() {
        // zoom_called = false;

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

        // var txtName = document.getElementById("txtName");
        var txtName = document.getElementById("gene_search_box");


        if(txtName.value){
            highLight();
        }

    }// end of imputed filter

    //**zoom
    // Pan and zoom
    var zoom = d3.zoom()
    // .scaleExtent([.5, 20]) // default setting will be .scaleExtent([0, infinity])
        .extent([[0, 0], [chartWidth, chartHeight]])
        .on("zoom", zoomed);

    // svg.append("rect")
    chartG.append("rect")
        .attr("width", chartWidth)
        .attr("height", chartHeight)
        .style("fill", "none")
        .style("pointer-events", "all")
        .call(zoom);

    function zoomed() {


        // create new scale ojects based on event
        new_xScale = d3.event.transform.rescaleX(xScale);
        new_yScale = d3.event.transform.rescaleY(yScale);

        // console.log('new_xScale',new_xScale);
        var xAxis = d3.axisBottom(xScale);
        var yAxis = d3.axisLeft(yScale);

// update axes
        xAxisG.call( xAxis.scale(new_xScale));
        yAxisG.call(yAxis.scale(new_yScale));
        // dots.data(dotsEnter)
        //dotsenter when have a subject it does update but weird
        // dotsEnter.data(dots)
        //     // .attr('cx', function(d) {return new_xScale(0)})
        //     // .attr('cy', function(d) {return new_yScale(0)});
        //     .attr('cx', function(d) {return new_xScale(d[chartScales.x])})
        //     .attr('cy', function(d) {return new_yScale(d[chartScales.y])});

        // it does update now
        points = dots.merge(dotsEnter)
        // dots.merge(dotsEnter)
        //     .transition() // Add transition - this will interpolate the translate() on any changes
            // .duration(750)
            .attr('transform', function(d) {
                console.log('this gets called merge');
                // Transform the group based on x and y property
                var tx = new_xScale(d[chartScales.x]);
                var ty = new_yScale(d[chartScales.y]);
                return 'translate('+[tx, ty]+')';
            });

        zoom_called = true;
        restart_animation_zoom();

        // restart_animation()


    }
    //**zoom


}// end of updatechart for Scatterplots