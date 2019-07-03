var circles;
var labels;
var clickedCircles = []; // track clicked circles
var i = 0;

d3.select("#gene_search_box").on("change paste keyup", function() {
// d3.select("#txtName").on("change paste keyup", function() {
    highLight();

});

function highLight() {
    // var txtName = document.getElementById("txtName");
    var txtName = document.getElementById("gene_search_box");

    circles = svg.selectAll("circle");
    circles.style("fill", function(d) {
        if (d.ticker == txtName.value) {
            return "red"
        }else if(d[select_x] ===1 || d[select_y] === 1){
            return "url(#diagonal-stripes)";}
        else{
            return "steelblue";}
    });


}
function trackClicked(clickedCircles){

        circles = svg.selectAll("circle");
        circles.style("fill", function(d) {
            if((clickedCircles.indexOf(d.ticker) >= 0)){
                return "orange";
            } else if(d[select_x] ===1 || d[select_y] === 1){
                return "url(#diagonal-stripes)";}
            else{
                return "steelblue";}
        });

        labels = svg.selectAll(".tickers");
        labels.style("opacity", function(d) {
            if((clickedCircles.indexOf(d.ticker) >= 0)){
                return "1";
            }else{
                return "0";}
        });

}

function textProcess(temp_x,temp_y) {

    let select_x = temp_x.concat("_impute");
    let select_y = temp_y.concat("_impute");


    return {
        select_x,
        select_y
    }
}

// Global functions called when select elements changed
function onXScaleChanged() {
    if(typeof points === 'undefined'){ // this part removes the zoomed redrawn objects
    }else{
        points.remove().exit();
    }
    zoom_called = false;

    svg.selectAll(".tickers").remove().exit();



    var select = d3.select('#xScaleSelect').node();
    // Get current value of select element, save to global chartScales
    chartScales.x = select.options[select.selectedIndex].value;


    // Update chart
    updateChart();
}

function onYScaleChanged() {
    if(typeof points === 'undefined'){ // this part removes the zoomed redrawn objects
    }else{
        points.remove().exit();
    }
    zoom_called = false;

    svg.selectAll(".tickers").remove().exit();


    var select = d3.select('#yScaleSelect').node();
    // Get current value of select element, save to global chartScales
    chartScales.y = select.options[select.selectedIndex].value;

    // Update chart
    updateChart();
}

// Also, declare global variables for missing amount, total amount, and percentage
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

// console.log()

// var padding = {t: 40, r: 40, b: 40, l: 40};
var padding = {t: 50, r: 50, b: 50, l: 50};


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

var transitionScale = d3.transition()
    .duration(600)
    .ease(d3.easeLinear);

//****scatter plot
function updateChart() {

    //comute it hear so that it's possible to adjust axis
    std_x = d3.deviation(whiskey, function(d) { return d[chartScales.x]; });
    std_y = d3.deviation(whiskey, function(d) { return d[chartScales.y]; });

    // **** Draw and Update your chart here ****
    // Update the scales based on new data attributes
    yScale.domain(domainMap[chartScales.y]).nice();
    xScale.domain(domainMap[chartScales.x]).nice();

    xScaleMin = xScale.domain()[0];
    xScaleMax = xScale.domain().slice(-1)[0];

    yScaleMax = yScale.domain().slice(-1)[0];
    yScaleMin = yScale.domain()[0];

    if(chartScales.x === "marketcap"){
        xAxisG.transition()
            .duration(750) // Add transition
            .call(d3.axisBottom(xScale)
                .tickFormat(d3.format(".0s")));
    }else{
        // Update the axes here first
        xAxisG.transition()
            .duration(750) // Add transition
            .call(d3.axisBottom(xScale));
    }

    if(chartScales.y === "marketcap"){
        yAxisG.transition()
            .duration(750) // Add transition
            .call(d3.axisLeft(yScale)
                .tickFormat(d3.format(".0s")));
    }else{
        // Update the axes here first
        yAxisG.transition()
            .duration(750) // Add transition
            .call(d3.axisLeft(yScale));
    }

    // these were declared as local initially
    const select = textProcess(chartScales.x,chartScales.y);

    select_x = select.select_x;
    select_y = select.select_y;

    console.log("select_x and select_y", select_x, select_y);

    var scatter = svg.append("g")
        .attr('transform', 'translate('+[padding.l, padding.t]+')')
        .attr("clip-path", "url(#clip)");

    // Create and position scatterplot circles
    // User Enter, Update (don't need exit)
    dots =
        scatter
        .selectAll('.dot')
        .data(whiskey);

    // Define the div for the tooltip
    var div = d3.select("body").append("div")
        .attr("class", "tooltip");

    //de-select all when clicked oustide
    chartG.on("click",function()
    {
        console.log('outside');
        while (clickedCircles.length > 0) {
            clickedCircles.pop();
        }
        circles = svg.selectAll("circle");

        circles.style('fill', function (d) {
                if (d[select_x] === 1 || d[select_y] === 1) {
                    return "url(#diagonal-stripes)";
                }
                else {
                    return "steelblue";
                }
            });

        labels = svg.selectAll(".tickers");

        labels.style("opacity", 0);


    });

    // var dotsEnter = dots.enter()
    dotsEnter = dots.enter()
        .append('g')
        .attr('class', 'dot')
        .on('mouseover', function(d){ // Add hover start event binding
            var hovered = d3.select(this);
            var attr = ["beta","currprice","pctchg52wks","avgvol","peratio","roe","eps"];

            for( var i = 0; i < attr.length; i++){
                if ( attr[i] === chartScales.x) {
                    attr.splice(i, 1);
                }
                if ( attr[i] === chartScales.y) {
                    attr.splice(i, 1);
                }
            }

            console.log("attr",attr.length,attr);

            div.transition().duration(200)
                .style("opacity", .9);
            // div.html(function(){
            //     console.log('d[select_x] & d[select_y]', d[select_x],typeof d[select_x], d[select_y], typeof d[select_y]);
            //     if(d[select_x] === 1 && d[select_y]===0){
            //         return  "ticker: "+d.ticker + "<br>" + chartScales.x + ": "+ "<span style='color: #FF0000;'>" + d[chartScales.x]+ " (Est.)"+ "</span>"+"<br>" + chartScales.y + ": " + d[chartScales.y]
            //     }else if(d[select_y] === 1 && d[select_x] === 0){
            //         return  "ticker: "+d.ticker + "<br>"+ chartScales.x + ": " + d[chartScales.x]+ "<br>" + chartScales.y + ": " + "<span style='color: #FF0000;'>"+ d[chartScales.y] + " (Est.)"+"</span>"
            //     }else if(d[select_x] === 0 && d[select_y] === 0){
            //         return  "ticker: "+d.ticker + "<br>"+ chartScales.x + ": " + d[chartScales.x]+ "<br>" + chartScales.y + ": " + d[chartScales.y]
            //     }else if(d[select_x] === 1  && d[select_y] === 1){
            //         return  "ticker: "+d.ticker + "<br>"+ chartScales.x + ": " + "<span style='color: #FF0000;'>"+d[chartScales.x]+ " (Est.)"+"</span>"+ "<br>" + chartScales.y + ": " + "<span style='color: #FF0000;'>"+ d[chartScales.y] + " (Est.)"+"</span>"
            //     }
            // })
            div.html(function(){
                console.log('d[select_x] & d[select_y]', d[select_x],typeof d[select_x], d[select_y], typeof d[select_y]);
                if(d[select_x] === 1 && d[select_y]===0){
                    return  "ticker: "+d.ticker + "<br>" + chartScales.x + ": "+ "<span style='color: #FF0000;'>" + d[chartScales.x]+ " (Est.)"+ "</span>"+"<br>" + chartScales.y + ": " + d[chartScales.y] + "<br>" + attr[0] + ": " + d[attr[0]] + "<br>" + attr[1] + ": " + d[attr[1]] + "<br>" + attr[2] + ": " + d[attr[2]] + "<br>" + attr[3] + ": " + d[attr[3]] + "<br>" + attr[4] + ": " + d[attr[4]]
                }else if(d[select_y] === 1 && d[select_x] === 0){
                    return   "ticker: "+d.ticker + "<br>"+ chartScales.x + ": " + d[chartScales.x]+ "<br>" + chartScales.y + ": " + "<span style='color: #FF0000;'>"+ d[chartScales.y] + " (Est.)"+"</span>" + "<br>" + attr[0] + ": " + d[attr[0]] + "<br>" + attr[1] + ": " + d[attr[1]] + "<br>" + attr[2] + ": " + d[attr[2]] + "<br>" + attr[3] + ": " + d[attr[3]] + "<br>" + attr[4] + ": " + d[attr[4]]
                }else if(d[select_x] === 0 && d[select_y] === 0){
                    return   "ticker: "+d.ticker + "<br>"+ chartScales.x + ": " + d[chartScales.x]+ "<br>" + chartScales.y + ": " + d[chartScales.y] + "<br>" + attr[0] + ": " + d[attr[0]] + "<br>" + attr[1] + ": " + d[attr[1]] + "<br>" + attr[2] + ": " + d[attr[2]] + "<br>" + attr[3] + ": " + d[attr[3]] + "<br>" + attr[4] + ": " + d[attr[4]]
                }else if(d[select_x] === 1  && d[select_y] === 1){
                    return   "ticker: "+d.ticker + "<br>"+ chartScales.x + ": " + "<span style='color: #FF0000;'>"+d[chartScales.x]+ " (Est.)"+"</span>"+ "<br>" + chartScales.y + ": " + "<span style='color: #FF0000;'>"+ d[chartScales.y] + " (Est.)"+"</span>" + "<br>" + attr[0] + ": " + d[attr[0]] + "<br>" + attr[1] + ": " + d[attr[1]] + "<br>" + attr[2] + ": " + d[attr[2]] + "<br>" + attr[3] + ": " + d[attr[3]] + "<br>" + attr[4] + ": " + d[attr[4]]
                }
            })
                // .style("left", "1050px")
                .style("left", "1060px")
                .style("top", "100px");
            hovered.select('circle')
                .style('stroke-width', 2)
                .style('stroke', '#333');
        })
        .on("click",function(d) {
            var clicked = d3.select(this);
            console.log("clicked",clicked);
            if ((clickedCircles.indexOf(d.ticker) >= 0)) {
                while ((index = clickedCircles.indexOf(d.ticker)) > -1) {
                    clickedCircles.splice(index, 1);
                }
                clicked.select('circle')
                    .style('fill', function (d) {
                        if (d[select_x] === 1 || d[select_y] === 1) {
                            return "url(#diagonal-stripes)";
                        }
                        else {
                            return "steelblue";
                        }
                    });

                clicked.select('text')
                    .style("opacity",0);


                // clicked.classed("selected", true);
                clicked.classed("selected", false);

                console.log('list of clicked circles', clickedCircles);
            } else {

                clickedCircles.push(d.ticker);
                clicked.select('circle')
                    .style('fill', "orange");


                clicked.select('text')
                    .style("opacity",1);



                clicked.classed("selected", true);

                console.log('list of clicked circles', clickedCircles);
            }
        })
        .on('mouseout', function(d){ // Add hover end event binding
            // Select the hovered g.dot
            var hovered = d3.select(this);
            hovered.select('circle')
                // .style('stroke-width', 0)
                .style('stroke-width', 1)
                .style('stroke', '#000');
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });

    points = dotsEnter.append('circle')
        .attr("class","no_impute")
        .style("fill",function(d){
            if(d[select_x] === 1 || d[select_y] === 1){return "url(#diagonal-stripes)";}
            else{return "steelblue";}
        })
        .attr('r', 5);

    dotsEnter.append("text")
        .attr("class","tickers")
        .attr("x",+10)
        .attr("y",-10)
        .text(function(d){return d.ticker});


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

    redraw_error();

    // var txtName = document.getElementById("txtName");
    var txtName = document.getElementById("gene_search_box");

    if(txtName.value){
        highLight();
    }

    if (clickedCircles.length > 0) {
        trackClicked(clickedCircles);
    }

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
                .attr("class", "normal-line")
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

    }// end of scatter error

    function redraw_error_zoom() {
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
            dots_line_x = chartG.append("g")
                .attr("clip-path", "url(#clip)") //zoom
                .selectAll("line")
                // .attr("clip-path", "url(#clip)") //zoom
                .data(whiskey)
                .enter()
                .filter(function(d){
                    return d[select_x] ===1})
                .append("line")
                .attr("class", "normal-line")
                .attr("x1", function (d) {
                    if(new_xScale(d[chartScales.x]-std_x/2) <= 0){
                        return new_xScale(d[chartScales.x]-std_x/2 + xScaleMin -(d[chartScales.x]-std_x/2)); // this so that the lines do not go over axis
                    }else{
                        return new_xScale(d[chartScales.x]-std_x/2);
                    }
                })
                .attr("y1", function (d) {
                    return new_yScale(d[chartScales.y]);
                })
                .attr("x2", function (d) {
                    if(new_xScale(d[chartScales.x]+std_x/2) >= 520){
                        return new_xScale(xScaleMax);
                    }else{
                        return new_xScale(d[chartScales.x]+std_x/2);
                    }
                })
                .attr("y2", function (d) {
                    return new_yScale(d[chartScales.y]);
                });

        }

        function error_y(){
            dots_line_y = chartG.append("g")
                .attr("clip-path", "url(#clip)") //zoom
                .selectAll("line")
                // .attr("clip-path", "url(#clip)") //zoom
                .data(whiskey)
                .enter()
                .filter(function(d){
                    return d[select_y] ===1})
                .append("line")
                .attr("class", "normal-line")
                .attr("x1", function (d) {
                    return new_xScale(d[chartScales.x] );
                })
                .attr("y1", function (d) {
                    if(new_yScale(d[chartScales.y]-std_y/2) >= 520){
                        return new_yScale(d[chartScales.y]-std_y/2 + yScaleMin-(d[chartScales.y]-std_y/2));
                    }else{
                        return new_yScale(d[chartScales.y]-std_y/2);
                    }
                })
                .attr("x2", function (d) {
                    return new_xScale(d[chartScales.x] );
                })
                .attr("y2", function (d) {
                    if(new_yScale(d[chartScales.y]+std_y/2) <= 0){// when it goes over maximum values
                        return new_yScale(yScaleMax);
                    }else{
                        return new_yScale(d[chartScales.y]+std_y/2);
                    }
                })
        }

        error_x();
        error_y();

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

        if (zoom_called === true) {
            redraw_error_zoom();
        }
        if(zoom_called === false){
            redraw_error();
        }

        // redraw_error();

        // var txtName = document.getElementById("txtName");
        var txtName = document.getElementById("gene_search_box");

        if(txtName.value){
            highLight();
        }

        if (clickedCircles.length > 0) {
            trackClicked(clickedCircles);
        }

        d3.selectAll(".tickers")
            .style("opacity",function(d){
                if(d[select_x] ===1 || d[select_y] === 1){
                    if(clickedCircles.indexOf(d.ticker) >= 0){
                        return 1;
                    }else{
                        return 0;
                    }
                } else{return 0;}
            });



    }// end of imputed filter

    function filter_no_impute() {
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

        // var txtName = document.getElementById("txtName");
        var txtName = document.getElementById("gene_search_box");

        if(txtName.value){
            highLight();
        }

        if (clickedCircles.length > 0) {
            trackClicked(clickedCircles);
        }

        d3.selectAll(".tickers")
            .style("opacity",function(d){
                if(d[select_x] === 0 && d[select_y] === 0){
                    if(clickedCircles.indexOf(d.ticker) >= 0){
                        return 1;
                    }else{
                        return 0;
                    }
                }else{return 0;}
            });

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

        // redraw_error();
        if (zoom_called === true) {
            redraw_error_zoom();
        }
        if(zoom_called === false){
            redraw_error();
        }

        // var txtName = document.getElementById("txtName");
        var txtName = document.getElementById("gene_search_box");

        if(txtName.value){
            highLight();
        }

        if (clickedCircles.length > 0) {
            trackClicked(clickedCircles);
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

        var xAxis = d3.axisBottom(xScale);
        var yAxis = d3.axisLeft(yScale);

        // update axes
        xAxisG.call( xAxis.scale(new_xScale));
        yAxisG.call(yAxis.scale(new_yScale));
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
        redraw_error_zoom();
    }
    //**zoom



}// end of updatechart for Scatterplots
