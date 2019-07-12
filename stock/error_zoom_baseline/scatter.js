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
        if (d.ticker == txtName.value && d[select_x] === 0 && d[select_y] === 0) {
            return "red"
        }else if((clickedCircles.indexOf(d.ticker) >= 0)){
            return "orange";
        } else if(d[select_x] ===1 || d[select_y] === 1){
            return "none";}
        else{
            return "steelblue";}
    });

    circles.style("stroke", function(d) {
        if (d.ticker == txtName.value && d[select_x] === 0 && d[select_y] === 0) {
            return "black"
        }else if((clickedCircles.indexOf(d.ticker) >= 0)){
            return "black";
        } else if(d[select_x] ===1 || d[select_y] === 1){
            return "none";}
        else{
            return "black";}
    });


}

function trackClicked(clickedCircles){
        circles = svg.selectAll("circle");
        circles.style("fill", function(d) {
            if((clickedCircles.indexOf(d.ticker) >= 0)){
                if(d[select_x] === 0 && d[select_y] === 0){
                    return "orange";
                }else{
                    return "none";
                }
            }
            else{
                return "steelblue";}
        });

        circles.style("stroke", function(d) {
            if((clickedCircles.indexOf(d.ticker) >= 0)){
                if(d[select_x] === 0 && d[select_y] === 0){
                    return "black";
                }else{
                    return "none";
                }
            }
            else{
                return "black";}
        });

        labels = svg.selectAll(".tickers");
        labels.style("opacity", function(d) {
            if((clickedCircles.indexOf(d.ticker) >= 0)){
                if(d[select_x] === 0 && d[select_y] === 0){
                    return "1";
                }else{
                    return "0";
                }
                // return "1";
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
    .attr("transform", "translate(0,-20)")
    // .attr("transform", "translate(-20,0)")
    .attr("width", chartWidth)
    .attr("height", chartHeight+20);
/**/

// var clipping = chartG.appne("g")
//     .attr("clip-path","url(#clip)");

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

    console.log("std_x",chartScales.x, std_x);
    console.log("std_y",chartScales.y, std_y);


    // **** Draw and Update your chart here ****
    // Update the scales based on new data attributes
    yScale.domain(domainMap[chartScales.y]).nice();
    // xScale.domain(domainMap[chartScales.x]).nice();
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

    // var scatter = chartG.append("g")
    //     // .attr('transform', 'translate('+[padding.l, padding.t]+')')
    //     .attr("clip-path", "url(#clip)");

    // Create and position scatterplot circles
    // User Enter, Update (don't need exit)
    dots =
        scatter
        .selectAll('.dot')
        .data(whiskey);

    // Define the div for the tooltip
    var div = d3.select("body").append("div")
        .attr("class", "tooltip");

    //reset button click
    d3.select("#reset").on("click",function()
    {
        console.log('outside');
        while (clickedCircles.length > 0) {
            clickedCircles.pop();
        }
        circles = svg.selectAll("circle");

        circles.style('fill', function (d) {
            if (d[select_x] === 1 || d[select_y] === 1) {
                return "none";
            }
            else {
                return "steelblue";
            }
        });

        circles.style('stroke', function (d) {
            if (d[select_x] === 1 || d[select_y] === 1) {
                return "none";
            }
            else {
                return "black";
            }
        });

        labels = svg.selectAll(".tickers");

        labels.style("opacity", 0);
    });

    function tooltip(d){
        var attr = ["beta","pctchg52wks","avgvol","peratio","roe","eps"];

        // var ticker,currprice,beta, pct52, avgvol,peratio,roe,eps = " "," "," "," "," "," "," "," ";
        console.log('ticker',d.ticker);

        var ticker = "Ticker: "+d.ticker + "<br>";
        var currprice = "Current price per share: " + "<span style='color: #008000;'>" + d.currprice + "</span>"+ "<br>";

        //text process
        var beta_x = "beta".concat("_impute");
        var pctchg52wks_x = "pctchg52wks".concat("_impute");
        var avgvol_x = "avgvol".concat("_impute");
        var peratio_x = "peratio".concat("_impute");
        var roe_x = "roe".concat("_impute");
        var eps_x = "eps".concat("_impute");

        if(d[beta_x] === 1){
            var beta = "Beta" + ": " + "<span style='color: #FF0000;'>"+ "missing"+"</span>" + "<br>"
        }else if(d[beta_x] === 0){
            var beta =  "Beta" + ": " + d.beta + "<br>"
        }

        if(d[pctchg52wks_x] === 1){
            var pctchg52wks =  "Price change over 52 weeks" + ": " + "<span style='color: #FF0000;'>"+ "missing"+"</span>" + "<br>"
        }else if(d[pctchg52wks_x] === 0){
            var pctchg52wks = "Price change over 52 weeks" + ": " + d.pctchg52wks + "<br>"
        }

        if(d[avgvol_x] === 1){
            var avgvol = "Average volume" + ": " + "<span style='color: #FF0000;'>"+ "missing" +"</span>" + "<br>"
        }else if(d[avgvol_x] === 0){
            var avgvol = "Average volume" + ": " + d.avgvol + "<br>"
        }

        if(d[peratio_x] === 1){
            var peratio = "PE Ratio" + ": " + "<span style='color: #FF0000;'>"+ "missing" +"</span>" + "<br>"
        }else if(d[peratio_x] === 0){
            var peratio = "PE Ratio" + ": " + d.peratio + "<br>"
        }

        if(d[roe_x] === 1){
            var roe = "ROE" + ": " + "<span style='color: #FF0000;'>"+ "missing" +"</span>" + "<br>"
        }else if(d[roe_x] === 0){
            var roe = "ROE" + ": " + d.roe + "<br>"
        }

        if(d[eps_x] === 1){
            var eps = "EPS" + ": " + "<span style='color: #FF0000;'>"+ "missing" +"</span>" + "<br>"
        }else if(d[eps_x] === 0){
            var eps = "EPS" + ": " + d.eps + "<br>"
        }

        return ticker + currprice + beta + pctchg52wks + avgvol + peratio + roe + eps;
    }

    // var dotsEnter = dots.enter()
    dotsEnter = dots.enter()
        .append('g')
        .attr('class', 'dot')
        .on('mouseover', function(d){ // Add hover start event binding
            var hovered = d3.select(this);
            var attr = ["beta","pctchg52wks","avgvol","peratio","roe","eps"];

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
            div.html(function(){
                console.log('d[select_x] & d[select_y]', d[select_x],typeof d[select_x], d[select_y], typeof d[select_y]);
                return tooltip(d);
            })
                .style("left", "1060px")
                .style("top", "100px");
            hovered.select('circle')
                .style('stroke-width', 2)
                .style('stroke', '#333');
        })
        .on("click",function(d) {
            //display buttons
            var clicked = d3.select(this);
            console.log("clicked",clicked);
            if ((clickedCircles.indexOf(d.ticker) >= 0)) {
                // document.getElementById('reset').style.display = "block";
                while ((index = clickedCircles.indexOf(d.ticker)) > -1) {
                    clickedCircles.splice(index, 1);
                }
                clicked.select('circle')
                    .style('fill', function (d) {
                        if (d[select_x] === 1 || d[select_y] === 1) {
                            return "none";
                        }
                        else {
                            return "steelblue";
                        }
                    });

                clicked.select('circle')
                    .style('stroke', function (d) {
                        if (d[select_x] === 1 || d[select_y] === 1) {
                            return "none";
                        }
                        else {
                            return "black";
                        }
                    });

                clicked.select('text')
                    .style("opacity",0);

                // clicked.classed("selected", true);
                clicked.classed("selected", false);

                console.log('list of clicked circles', clickedCircles);
            } else {
                // document.getElementById('reset').style.display = "none";

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
            if(d[select_x] === 1 || d[select_y] === 1){return "none";}
            else{return "steelblue";}
        })
        .style("stroke",function(d){
            if(d[select_x] === 1 || d[select_y] === 1){return "none";}
            else{return "black";}
        })
        .attr('r', 5);

    dotsEnter.append("text")
        .attr("class","tickers")
        .attr("x",+10)
        .attr("y",-10)
        .text(function(d){return d.ticker});

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
        .style("fill","none")
        .style("stroke","none");

    d3.selectAll("circle")
        .filter(function(d){return d[select_x] ===0 && d[select_y] === 0})
        .style("fill","steelblue")
        .style("stroke","black");

    // var txtName = document.getElementById("txtName");
    var txtName = document.getElementById("gene_search_box");

    if (clickedCircles.length > 0) {
        trackClicked(clickedCircles);
    }

    if(txtName.value){
        highLight();
    }

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


        if(chartScales.x === "marketcap"){
            var xAxis = d3.axisBottom(xScale).tickFormat(d3.format(".0s"));
        }else{
            // Update the axes here first
            var xAxis = d3.axisBottom(xScale);

        }

        if(chartScales.y === "marketcap"){
            var yAxis = d3.axisLeft(yScale).tickFormat(d3.format(".0s"));
        }else{
            var yAxis = d3.axisLeft(yScale);

        }

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
    }
    //**zoom

}// end of updatechart for Scatterplots
