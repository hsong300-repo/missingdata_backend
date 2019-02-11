// Global functions called when select elements changed
function onXScaleChanged() {
    var select = d3.select('#xScaleSelect').node();
    // Get current value of select element, save to global chartScales
    chartScales.x = select.options[select.selectedIndex].value;

    console.log('select x',chartScales.x);

    if(typeof dots_chart === 'undefined'){ // bars
    }else{
        dots_chart.remove().exit(); //remove some of the encodings
    }
    if(typeof dots_chart_line === 'undefined'){ // bars
    }else{
        dots_chart_line.remove().exit();
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

    // Update chart
    updateChart();
}

function onYScaleChanged() {
    var select = d3.select('#yScaleSelect').node();
    // Get current value of select element, save to global chartScales
    chartScales.y = select.options[select.selectedIndex].value;

    if(typeof dots_chart === 'undefined'){ // bars
    }else{
        dots_chart.remove().exit(); //remove some of the encodings
    }
    if(typeof dots_chart_line === 'undefined'){ // bars
    }else{
        dots_chart_line.remove().exit();
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
    .attr('class', 'y axis');

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

    // whiskey.filter(function(d){return ChartScales.x})

    // Create and position scatterplot circles
    // User Enter, Update (don't need exit)
    dots = chartG.selectAll('.dot')
        .data(whiskey);

    // var filtered_data = whiskey.filter(function(d){return d[chartScales.x] ==="1.0"});

    var temp_x = chartScales.x;
    var temp_y = chartScales.y;

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

    var select_x = temp_x.concat("_impute");
    var select_y = temp_y.concat("_impute");

    filtered_data = whiskey
        .filter(function(d){
            return d[select_x] === 1 || d[select_y] === 1});

    filtered_x = whiskey
            .filter(function(d){
                return d[select_x] ===1});
    filtered_y = whiskey
            .filter(function(d){
                return d[select_y] ===1});
    // var filtered_y = whiskey
    //     .filter(function(d){
    //         // console.log('chartScales.x',d[concat_selection],concat_selection, d[concat_selection] === 1)
    //         // console.log('chartScales.x',d[chartScales.x] ===1)
    //         return d[select_y] ===1});
    // console.log('filtered_x',filtered_x);
    // console.log('filtered_y',filtered_y);
    // console.log('concat',filtered_x.concat(filtered_y));


    // var dotsEnter = dots.enter()
    dotsEnter = dots.enter()
        .append('g')
        .attr('class', 'dot')
        .attr("fill","steelblue")
        .on('mouseover', function(d){ // Add hover start event binding
            // Select the hovered g.dot
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
        });

    // Append a circle to the ENTER selection
    // dotsEnter.append('circle')
    //     .attr('r', 3);
    dotsEnter.append('circle')
       // .filter(function(d){
       //      return d[select_x] ===0 && d[select_y] === 0})
        .style("fill","steelblue")
        .attr('r', 4);

    // Append a text to the ENTER selection
    // dotsEnter.append('text')
    //     .attr('y', -10)
    //     .text(function(d) {
    //         // console.log('price impute',d.price_impute);
    //         return d.Name;
    //         // return d.Brand
    //         // return d[chartScales.x];
    //     });

     // Append a text to the ENTER selection
    dotsEnter.append('text')
        .attr('y', -10)
        .text(function(d) {
            if(d[select_x] === 0){
                var x_val = "valid";
            }else if(d[select_x] === 1){
                var x_val = "missing";
            }
            if(d[select_y] === 0){
                var y_val = "valid";
            }else if(d[select_x] === 1){
                var y_val = "missing";
            }
            return temp_x +":"+x_val +" , " + temp_y + ":" +y_val;
        });


    d3.selectAll(("input[value='color']")).on("change", function() {
        console.log('onchange color');
        redraw_color();
    });

    d3.selectAll(("input[value='gradient']")).on("change", function() {
        console.log('onchange gradient');
        redraw_gradient();
    });

    d3.selectAll(("input[value='error']")).on("change", function() {
        console.log('onchange error');
        redraw_error();
    });

    d3.selectAll(("input[value='pattern']")).on("change", function() {
        console.log('onchange pattern count');
        redraw_pattern();
    });

    d3.selectAll(("input[value='local']")).on("change", function() {
        console.log('onchange local');
        redraw_local();
    });

    d3.selectAll(("input[value='sketch']")).on("change", function() {
        console.log('onchange sketch');
        redraw_sketch();
    });

    d3.selectAll(("input[value='shape']")).on("change", function() {
        console.log('onchange shape');
        redraw_shape();
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

    // dots_chart = chartG.append("g").attr('class', "Scatter")
    //     .selectAll("circle");
        // .data(whiskey).enter();

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

    function redraw_color() {
        if(typeof dots_chart === 'undefined'){ // bars
            }else{
                dots_chart.remove().exit(); //remove some of the encodings
            }
            if(typeof dots_chart_line === 'undefined'){ // bars
            }else{
                dots_chart_line.remove().exit();
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

         dots_chart = chartG.append("g").attr('class', "Scatter")
            .selectAll("circle")
            .data(filtered_data).enter()
            // .data(whiskey).enter()
            .append('circle')
            // .filter(function (d, i) {
            //     return d[chartScales.x]==="0.0";
            // })
            .style("fill", '#87CEFA')
            .attr("cx", function (d) {
                return xScale(d[chartScales.x]);
            })
            .attr("cy", function (d) {
                return yScale(d[chartScales.y]);
            })
            .attr('r', 4);


        shape_check = false;



    }// end of color

        function redraw_local() {

            if(typeof dots_chart === 'undefined'){ // bars
                }else{
                    dots_chart.remove().exit(); //remove some of the encodings
                }
                if(typeof dots_chart_line === 'undefined'){ // bars
                }else{
                    dots_chart_line.remove().exit();
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

            dots_chart = chartG.append("g").attr('class', "Scatter")
                .selectAll("circle")
                // .data(whiskey)
                .data(filtered_data)
                .enter()
                .append('circle')
                // .filter(function (d, i) {
                //     return removed_idx.includes(i);
                // })
                .style("stroke", '#87CEFA')
                .style("stroke-width", 1)
                .style("fill", '#fff')
                .attr("cx", function (d) {
                    return xScale(d[chartScales.x]);
                })
                .attr("cy", function (d) {
                    return yScale(d[chartScales.y]);
                })
                // .attr('r', 4);
                .attr('r', 4);

            // where it is missing, so if the value is imputed than it will show little lines next to it
            dots_chart_line = chartG.append("g").selectAll("line")
                .data(filtered_data)
                .enter()
                .filter(function(d){
                        return d[select_y] === 1 })
                .append("line")
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
                    return yScale(0 - 0.6);
                });

             dots_chart_line_y = chartG.append("g").selectAll("line")
                .data(filtered_data)
                .enter()
                 .filter(function(d){
                        return d[select_x] === 1 })
                .append("line")
                .attr("class", "normal-line")
                .attr("x1", function (d) {
                    return xScale(0);
                })
                .attr("y1", function (d) {
                    // return yScale(d[chartScales.y]+1);
                    return yScale(d[chartScales.y]);
                })
                .attr("x2", function (d) {
                    return xScale(-0.6);
                })
                .attr("y2", function (d) {
                    // return yScale(d[chartScales.y]-1);
                    return yScale(d[chartScales.y]);
                });

         shape_check = false;


        }// end of local

    // function redraw_local() {
    //
    //         if(typeof dots_chart === 'undefined'){ // bars
    //             }else{
    //                 dots_chart.remove().exit(); //remove some of the encodings
    //             }
    //             if(typeof dots_chart_line === 'undefined'){ // bars
    //             }else{
    //                 dots_chart_line.remove().exit();
    //             }if(typeof dots_chart_line_y === 'undefined'){ // bars
    //                     console.log('dotschart undefined');
    //             }else {
    //             dots_chart_line_y.remove().exit();
    //             // dots_remove.remove().exit();
    //             }if(typeof dots_chart_x === 'undefined'){ // bars
    //                 console.log('dotschart undefined');
    //             }else{
    //                 dots_chart_x.remove().exit(); //remove some of the encodings
    //             }if(typeof dots_chart_y === 'undefined'){ // bars
    //                 console.log('dotschart undefined');
    //             }else{
    //                 dots_chart_y.remove().exit(); //remove some of the encodings
    //             }
    //
    //         // where it is missing, so if the value is imputed than it will show little lines next to it
    //         dots_chart_line = chartG.append("g").selectAll("line")
    //             .data(filtered_data)
    //             .enter()
    //             .filter(function(d){
    //                     return d[select_y] === 1 })
    //             .append("line")
    //             .attr("class", "normal-line")
    //             .attr("x1", function (d) {
    //                 return xScale(d[chartScales.x]);
    //             })
    //             .attr("y1", function (d) {
    //                 // return yScale(d[chartScales.y]+1);
    //                 return yScale(0);
    //             })
    //             .attr("x2", function (d) {
    //                 return xScale(d[chartScales.x]);
    //             })
    //             .attr("y2", function (d) {
    //                 // return yScale(d[chartScales.y]-1);
    //                 return yScale(0 - 0.6);
    //             });
    //
    //          dots_chart_line_y = chartG.append("g").selectAll("line")
    //             .data(filtered_data)
    //             .enter()
    //              .filter(function(d){
    //                     return d[select_x] === 1 })
    //             .append("line")
    //             .attr("class", "normal-line")
    //             .attr("x1", function (d) {
    //                 return xScale(0);
    //             })
    //             .attr("y1", function (d) {
    //                 // return yScale(d[chartScales.y]+1);
    //                 return yScale(d[chartScales.y]);
    //             })
    //             .attr("x2", function (d) {
    //                 return xScale(-0.6);
    //             })
    //             .attr("y2", function (d) {
    //                 // return yScale(d[chartScales.y]-1);
    //                 return yScale(d[chartScales.y]);
    //             });
    //
    //         // dots_chart = chartG.append("g").attr('class', "Scatter")
    //         //     .selectAll("circle")
    //         //     // .data(whiskey)
    //         //     .data(filtered_data)
    //         //     .enter()
    //         //     .append('circle')
    //         //     // .filter(function (d, i) {
    //         //     //     return removed_idx.includes(i);
    //         //     // })
    //         //     .style("stroke", '#87CEFA')
    //         //     .style("stroke-width", 1)
    //         //     .style("fill", '#fff')
    //         //     .attr("cx", function (d) {
    //         //         return xScale(d[chartScales.x]);
    //         //     })
    //         //     .attr("cy", function (d) {
    //         //         return yScale(d[chartScales.y]);
    //         //     })
    //         //     // .attr('r', 4);
    //         //     .attr('r', 4);
    //
    //         dots_chart_x = chartG.append("g").attr('class', "Scatter")
    //             .selectAll("circle")
    //             .data(whiskey)
    //             .enter()
    //             .append('circle')
    //             .filter(function(d){
    //                     return d[select_x] ===1 })
    //             .style("stroke", '#87CEFA')
    //             .style("stroke-width", 1)
    //             .style("fill", '#fff')
    //             .attr("cx", function (d) {
    //                 return xScale(d[chartScales.x]);
    //             })
    //             .attr("cy", function (d) {
    //                 return yScale(d[chartScales.y]);
    //             })
    //             .attr('r', 4);
    //
    //         dots_chart_y = chartG.append("g").attr('class', "Scatter")
    //             .selectAll("circle")
    //             .data(whiskey)
    //             .enter()
    //             .append('circle')
    //             .filter(function(d){
    //                     return d[select_y] ===1 })
    //             .style("stroke", '#87CEFA')
    //             .style("stroke-width", 1)
    //             .style("fill", '#fff')
    //             .attr("cx", function (d) {
    //                 return xScale(d[chartScales.x]);
    //             })
    //             .attr("cy", function (d) {
    //                 return yScale(d[chartScales.y]);
    //             })
    //             .attr('r', 4);
    //
    //         move_x = dots_chart_x.transition()
    //             .duration(2000)
    //             .attr('cx',0)
    //             .transition()
    //             .duration(2000)
    //             .attr('cx',420)
    //             .transition()
    //             .duration(2000)
    //             .attr("cx", function (d) {
    //                 return xScale(d[chartScales.x]);
    //             });
    //
    //         move_y = dots_chart_y.transition()
    //             .filter(function(d){
    //                     return d[select_y] ===1 })
    //             .duration(2000)
    //             // .attr('cy',420)
    //             .attr('cy',0)
    //             .transition()
    //             .duration(2000)
    //             .attr('cy',420)
    //             .transition()
    //             .duration(2000)
    //             .attr("cy", function (d) {
    //                 return yScale(d[chartScales.y]);
    //             });
    //
    //         // add more ticks
    //         // dotsEnter.append('circle')
    //         //     .style("fill", function (d, i) {
    //         //         if (removed_idx.includes(i)) {
    //         //             return '#fff'; //white
    //         //         } else {
    //         //             return "steelblue";
    //         //         }
    //         //     })
    //         //     .style("stroke", function (d, i) {
    //         //         if (removed_idx.includes(i)) {
    //         //             return '#87CEFA'; //lightskyblue
    //         //         }})
    //         //     .style("stroke-width", function (d, i) {
    //         //         if (removed_idx.includes(i)) {
    //         //             return 1; //lightskyblue
    //         //         }})
    //         //     .attr('r', 4);
    //
    //         // dotsEnter.append("g").selectAll("line")
    //         //     .data(whiskey).enter()
    //         //     .append("line")
    //         //     .attr("class", "error-line")
    //         //     .filter(function (d, i) {
    //         //         return removed_idx.includes(i)
    //         //     })
    //         //     // // .filter()
    //         //     .attr("x1", function (d) {
    //         //         return xScale(d[chartScales.x]);
    //         //     })
    //         //     .attr("y1", function (d) {
    //         //         // return yScale(d[chartScales.y]+1);
    //         //         return yScale(0);
    //         //     })
    //         //     .attr("x2", function (d) {
    //         //         return xScale(d[chartScales.x]);
    //         //     })
    //         //     .attr("y2", function (d) {
    //         //         // return yScale(d[chartScales.y]-1);
    //         //         return yScale(0 - 0.6);
    //         //     });
    //
    //
    //     }// end of local


    function redraw_gradient() {

            if(typeof dots_chart === 'undefined'){ // bars
            }else{
                dots_chart.remove().exit(); //remove some of the encodings
            }
            if(typeof dots_chart_line === 'undefined'){ // bars
            }else{
                dots_chart_line.remove().exit();
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


        var radialGradient = svg.append("defs")
            .append("radialGradient")
            .attr("id", "radial-gradient");

        radialGradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "#fff");

        radialGradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "steelblue");

        dots_chart = chartG.append("g").attr('class', "Scatter")
            .selectAll("circle")
            // .data(whiskey)
            .data(filtered_data)
            .enter()
            .append('circle')
            // .filter(function (d, i) {
            //     return removed_idx.includes(i)
            // })
            .style("fill", 'url(#radial-gradient)')
            .attr("cx", function (d) {
                return xScale(d[chartScales.x]);
            })
            .attr("cy", function (d) {
                return yScale(d[chartScales.y]);
            })
            .attr('r', 4);


        shape_check = false;



    }// end of gradient

    function redraw_pattern() {

            if(typeof dots_chart === 'undefined'){ // bars
            }else{
                dots_chart.remove().exit(); //remove some of the encodings
            }
            if(typeof dots_chart_line === 'undefined'){ // bars
            }else{
                dots_chart_line.remove().exit();
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


        dots_chart = chartG.append("g").attr('class', "Scatter")
            .selectAll("circle")
            // .data(whiskey)
            .data(filtered_data)
            .enter()
            .append('circle')
            .style("fill", 'url(#diagonal-stripes)')
            // .attr('stroke', '#000')
            // .attr('stroke-width', 1)
            .attr("cx", function (d) {
                return xScale(d[chartScales.x]);
            })
            .attr("cy", function (d) {
                return yScale(d[chartScales.y]);
            })
            .attr('r', 4);

        shape_check = false;


    }// end of pattern

    function redraw_shape() {

        if(typeof dots_chart === 'undefined'){ // bars
        }else{
            dots_chart.remove().exit(); //remove some of the encodings
        }
        if(typeof dots_chart_line === 'undefined'){ // bars
        }else{
            dots_chart_line.remove().exit();
        }if(typeof dots_chart_line_y === 'undefined'){ // bars
                console.log('dotschart undefined');
        }else {
        dots_chart_line_y.remove().exit();
        }if(typeof dots_chart_x === 'undefined'){ // bars
            console.log('dotschart undefined');
        }else{
            dots_chart_x.remove().exit(); //remove some of the encodings
        }if(typeof dots_chart_y === 'undefined'){ // bars
            console.log('dotschart undefined');
        }else{
            dots_chart_y.remove().exit(); //remove some of the encodings
        }

        dots_chart = chartG.append("g").attr('class', "Scatter")
            .selectAll("circle")
            // .data(whiskey)
            .data(filtered_data)
            .enter()
            .append('rect')
            .style("fill", "steelblue")
            .attr('stroke', '#000')
            .attr('width', 6.5)
            .attr('height', 6.5)
            .attr('stoke-width', 1)
            .attr("x", function (d) {
                return xScale(d[chartScales.x])-3;
            })
            .attr("y", function (d) {
                return yScale(d[chartScales.y])-3;
            });

        shape_check = true;


    }// end of shape

    function redraw_error() {
            // Add Error Line
            // if(typeof dots_chart === 'undefined'){ // bars
            // }else{
            //     dots_chart.remove().exit(); //remove some of the encodings
            // }
            if(typeof dots_chart_line === 'undefined'){ // bars
            }else{
                dots_chart_line.remove().exit();
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

            var std_x = d3.deviation(whiskey, function(d) { return d[chartScales.x]; });
            var std_y = d3.deviation(whiskey, function(d) { return d[chartScales.y]; });

            console.log('std_x',std_x);
            console.log('std_y',std_y);

            if(typeof dots_chart === 'undefined'){ // bars
                 dots_chart = chartG.append("g").attr('class', "Scatter")
                .selectAll("circle")
                // .data(whiskey)
                .data(filtered_data)
                .enter()
                .append('circle')
                .style("fill", 'steelblue')
                .attr("cx", function (d) {
                    return xScale(d[chartScales.x]);
                })
                .attr("cy", function (d) {
                    return yScale(d[chartScales.y]);
                })
                // .attr('r', 4);
                .attr('r', 4);

                 dots_chart_line = chartG.append("g").selectAll("line")
                .data(filtered_data)
                .enter()
                .filter(function(d){
                    return d[select_x] ===1})
                .append("line")
                .attr("class", "error-line")
                .attr("x1", function (d) {
                    return xScale(d[chartScales.x]-std_x );
                })
                .attr("y1", function (d) {
                    return yScale(d[chartScales.y]);
                })
                .attr("x2", function (d) {
                    return xScale(d[chartScales.x] +std_x);
                })
                .attr("y2", function (d) {
                    return yScale(d[chartScales.y]);
                });

            dots_chart_line_y = chartG.append("g").selectAll("line")
                .data(filtered_data)
                .enter()
                .filter(function(d){
                    return d[select_y] ===1})
                .append("line")
                .attr("class", "error-line")
                .attr("x1", function (d) {
                    return xScale(d[chartScales.x] );
                })
                .attr("y1", function (d) {
                    return yScale(d[chartScales.y]+std_y);
                })
                .attr("x2", function (d) {
                    return xScale(d[chartScales.x] );
                })
                .attr("y2", function (d) {
                    return yScale(d[chartScales.y]-std_y);
                });
            }else{
                // dots_chart.remove().exit(); //remove some of the encodings
                dots_chart_line = chartG.append("g").selectAll("line")
                .data(filtered_data)
                .enter()
                .filter(function(d){
                    return d[select_x] ===1})
                .append("line")
                .attr("class", "error-line")
                .attr("x1", function (d) {
                    return xScale(d[chartScales.x]-std_x );
                })
                .attr("y1", function (d) {
                    return yScale(d[chartScales.y]);
                })
                .attr("x2", function (d) {
                    return xScale(d[chartScales.x] +std_x);
                })
                .attr("y2", function (d) {
                    return yScale(d[chartScales.y]);
                });

            dots_chart_line_y = chartG.append("g").selectAll("line")
                .data(filtered_data)
                .enter()
                .filter(function(d){
                    return d[select_y] ===1})
                .append("line")
                .attr("class", "error-line")
                .attr("x1", function (d) {
                    return xScale(d[chartScales.x] );
                })
                .attr("y1", function (d) {
                    return yScale(d[chartScales.y]+std_y);
                })
                .attr("x2", function (d) {
                    return xScale(d[chartScales.x] );
                })
                .attr("y2", function (d) {
                    return yScale(d[chartScales.y]-std_y);
                });
            }









        }// end of scatter error

    function redraw_animation() {

            if(typeof dots_chart_line === 'undefined'){ // bars
            }else{
                dots_chart_line.remove().exit();
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


            dots_chart_x = dots_chart.filter(function(d){
                return d[select_x] ===1 });
            dots_chart_y = dots_chart.filter(function(d){
                return d[select_y] ===1 });

            if(shape_check === false){
                 move_x = dots_chart_x.transition()
                .duration(2000)
                .attr('cx',0)
                .transition()
                .duration(2000)
                .attr('cx',420)
                .transition()
                .duration(2000)
                .attr("cx", function (d) {
                    return xScale(d[chartScales.x]);
                });

            move_y = dots_chart_y.transition()
                .filter(function(d){
                        return d[select_y] ===1 })
                .duration(2000)
                // .attr('cy',420)
                .attr('cy',0)
                .transition()
                .duration(2000)
                .attr('cy',420)
                .transition()
                .duration(2000)
                .attr("cy", function (d) {
                    return yScale(d[chartScales.y]);
                });
            }else if(shape_check === true){
                 move_x = dots_chart_x.transition()
                .duration(2000)
                .attr('x',0)
                .transition()
                .duration(2000)
                .attr('x',420)
                .transition()
                .duration(2000)
                .attr("x", function (d) {
                    return xScale(d[chartScales.x]);
                });

            move_y = dots_chart_y.transition()
                .filter(function(d){
                        return d[select_y] ===1 })
                .duration(2000)
                // .attr('cy',420)
                .attr('y',0)
                .transition()
                .duration(2000)
                .attr('y',420)
                .transition()
                .duration(2000)
                .attr("y", function (d) {
                    return yScale(d[chartScales.y]);
                });
            }

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
        }// end of local

}// end of updatechart for Scatterplots


// Remember code outside of the data callback function will run before the data loads
var rowToHtml = function( row ) {
    var result = "";
    for (key in row) {
        result += key + ": " + row[key] + "<br/>"
    }
    return result;
};

var previewCsvUrl = function( csvUrl ) {
    //part that draws the scatter chart
    // Compute chart dimensions
    //         var	margin = {top: 30, right: 20, bottom: 30, left: 50},
    var	margin = {top: 10, right: 10, bottom: 10, left: 10},
        width = 800 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    //width =400, height 2230
    // d3.csv(csvUrl, function(error, dataset){
    d3.csv(csvUrl,function(row) {
        return {
            'Name': row['Name'],
            'Rating': +row['Rating'],
            'Country': row['Country'],
            'Category': row['Category'],
            'Price': +row['Price'],
            'ABV': +row['ABV'],
            'Age': +row['Age'],
            'Brand': row['Brand'],
            'price_impute': +row['price_impute'],
            'rate_impute': +row['rate_impute'],
            'age_impute': +row['age_impute'],
            'abv_impute': +row['abv_impute']

        };
    },
    function(error, dataset) {
        // Log and return from an error
        if(error) {
            console.error(error);
            return;
        }

        // Create global variables here
        whiskey = dataset;

        console.log('here they should be converted to numbers');
        console.log('whiskey',whiskey);

        // Create scales and other functions here
        xScale = d3.scaleLinear()
            .range([0, chartWidth]);
        yScale = d3.scaleLinear()
            .range([chartHeight, 0]);

        // Get min, max here for all dataset columns
        // Fun tip, dataset.columns includes an array of the columns
        domainMap = {};

        dataset.columns.forEach(function(column) {
            domainMap[column] = d3.extent(dataset, function(data_element){
                return data_element[column];
            });
        });

        //get the percentage of the two
        per = Math.floor(missing_count/total_count)*100;

        // Create global object called chartScales to keep state
        // chartScales = {x: 'Price', y: 'Age'};
        chartScales = {x: 'Price', y: 'Age'};

        updateChart();

    });

    //*********BAR CHART*******
    //this part is for bar chart
    // d3.csv("./whiskey-test.csv", function(error, data){
    d3.csv(csvUrl, function(error, data){

        make_bar(data);

    });

    //make the bar function
    function make_bar(data){

        var margin = {top: 80, right: 180, bottom: 80, left: 180},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        canvas = d3.select("#bar_canvas")
        // .attr("id","canvas")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        console.log('data here',data);

        // filter value
        // Get every column value
        var elements = Object.keys(data[0])
            .filter(function(d){
                return ((d != "Name") & (d != "Country") & (d != "Category") & (d != "Brand")&(d != "rate_impute") & (d != "price_impute") & (d != "abv_impute") & (d != "age_impute"));
            });
        console.log('elements',elements);
        var selection = elements[0];
        var temp = selection;
        if(temp === "Age"){
            temp ="age";
        }else if(temp === "Rating"){
            temp="rate"
        }else if(temp === "Price"){
            temp="price"
         }else if(temp === "ABV"){
            temp="abv"
        }
        var concat_selection = temp.concat("_impute");

        var avg = d3.nest()
            .key(function(d){ return d.Category;})
            .rollup(function(v){return d3.mean(v,function(d){
                return +d[selection];});})
            .entries(data);

        console.log("avg bar",avg);

        var std = d3.nest()
            .key(function(d){ return d.Category;})
            .rollup(function(v){return d3.deviation(v,function(d){
                return +d[selection];});})
            .entries(data);

        //count number of missing values, not missing count
        var count = d3.nest()
            .key(function(d){ return d.Category;})
            .rollup(function(d) { return d.length; })
            .entries(data);


        var filtered_data = data.filter(function(d){return d[concat_selection] ==="1.0"});


        var impute_count = d3.nest()
            .key(function(d){ return d.Category;})
            // .key(function(d){ return d[concat_selection];})
            .rollup(function(d) { return d.length; })
            .entries(filtered_data);


        var y = d3.scaleLinear()
            // .domain([0, d3.max(data, function(d){
            //     return +d[selection];
            .domain([0,d3.max(avg,function(d){
                return d.value;
            })])
            .range([height, 0]);

        // ***y-axis on the right
        var y1 = d3.scaleLinear()
        // .domain([0, d3.max(data, function(d){
        //     return +d[selection];
            .domain([0,data.length])
            .range([height, 0]);
        var y1Axis = d3.axisRight(y1);

        // text label for the y axis
        canvas.append("g")
            .attr("transform", "translate( " + width + ", 0 )")
            .attr("class", "y1 axis")
            .call(y1Axis);

        // end of y1-axis
        canvas.append("text")
        // .attr("class","unknown label")
            .attr("class","unknown")
            .text("Count")
            // .attr("transform", "rotate(-90)")
            .attr("x",width+50+15)
            .attr("y",height/2)
            .attr("font-size","11px")
            .attr("fill","black")
            .attr("text-anchor","middle");

        //***end of the calling
        var x = d3.scaleBand()
        // .domain(data.map(function(d){ return d.Name;}))
            .domain(avg.map(function(d){ return d.key;}))
            // .rangeBands([0, width]);
            .rangeRound([0, width])
            .padding(0.1);

        var xAxis = d3.axisBottom(x);
        var yAxis = d3.axisLeft(y);

        canvas.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")
            .style("font-size", "8px")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", "-.55em")
            .attr("transform", "rotate(-90)" );

        canvas.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        canvas.selectAll("rectangle")
            // .data(data)
            .data(avg)
            .enter()
            .append("rect")
            .attr("class","rectangle")
            // .attr("width", width/data.length-5)
            .attr("width", x.bandwidth())
            .attr("height", function(d){
                // return height - y(+d[selection]);
                return height -y(d.value);
            })
            .attr("x", function(d, i){
                // return x(d.Category);
                return x(d.key);
            })
            .attr("y", function(d){
                // return y(+d[selection]);
                return y(d.value);
            })
            .attr("fill","steelblue")
            // .attr("fill","url(#svgGradient)")
            .append("title")
            // .style("margin-left", "10px")   //space between bars
            .text(function(d){

            });

        canvas.append("rect")
            .attr("x", width +50)
            .attr("y", 0)
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", "silver");

        canvas.append("text")
        // .attr("class","unknown label")
            .attr("class","legend")
            .text("Not Missing")
            // .attr("transform", "rotate(-90)")
            .attr("x",width+50+15)
            .attr("y",8)
            .attr("font-size","11px")
            .attr("fill","black");
            // .attr("text-anchor","middle");

        select_check = false;


        // total_missing = removed_idx.length;

        // var missingCount = d3.nest()
        //     .key(function(d){return d.Category})
        //     .rollup(function(v){return v.length;})
        //     // .filter(function(d,i){return removed_idx.includes(i);})
        //     .entries(f_data);
        var missingCount = impute_count;
        total_missing = impute_count.length;

        var not_missing_data = data.filter(function(d){return d[concat_selection];});

        var notMissingCount = d3.nest()
            .key(function(d){return d.Category})
            .rollup(function(v){return v.length;})
            .entries(not_missing_data);


        var missingCategory = [];
            for (var i = 0; i < missingCount.length; i++) {
                missingCategory.push(Object.values(missingCount[i])[0])
            }


        d3.selectAll(("input[value='bar_color']")).on("change", function() {
            console.log('onchange bar color');
            redraw_bar_color(missingCount,notMissingCount,avg,missingCategory);

        });

        d3.selectAll(("input[value='bar_gradient']")).on("change", function() {
            console.log('onchange bar gradient');
            //work
            redraw_bar_gradient(missingCount,notMissingCount,avg,missingCategory);

        });

        d3.selectAll(("input[value='bar_error']")).on("change", function() {
            console.log('onchange bar error');
            redraw_bar_error(missingCount,notMissingCount,avg,missingCategory);
        });

        d3.selectAll(("input[value='bar_pattern']")).on("change", function() {
            console.log('onchange bar pattern count');
            //work

            redraw_bar_pattern(missingCount,notMissingCount,avg,missingCategory);
        });

        d3.selectAll(("input[value='bar_missing']")).on("change", function() {
            console.log('onchange bar missing');

            redraw_bar_missing(total_missing,missingCount,notMissingCount,filtered_data,avg,missingCategory);
        });

        d3.selectAll(("input[value='bar_sketch']")).on("change", function() {
            console.log('onchange bar sketch');

            redraw_bar_sketch(missingCount,notMissingCount,avg,missingCategory);
        });
        d3.selectAll(("input[value='bar_dash']")).on("change", function() {
            console.log('onchange bar dash');

            redraw_bar_dash(missingCount,notMissingCount,avg,missingCategory);
        });


        // var selector = d3.select("#drop")
        selector = d3.selectAll("#bar_view")
            .append("select")
            .attr("id","dropdown")
            .on("change", function(d){

                select_check = true;
                selection = document.getElementById("dropdown");

                var selectAvg = d3.nest()
                    .key(function(d){ return d.Category;})
                    .rollup(function(v){return d3.mean(v,function(d){
                        return +d[selection.value];});})
                    .entries(data);

                console.log('selection',selectAvg);

                error_avg = selectAvg;

                //update missing bars
                var temp = selection.value;
                console.log('selection value here',selection.value);
                // var temp = selection;
                if(temp === "Age"){
                    temp ="age";
                }else if(temp === "Rating"){
                    temp="rate"
                }else if(temp === "Price"){
                    temp="price"
                 }else if(temp === "ABV"){
                    temp="abv"
                }
                var concat_selection = temp.concat("_impute");
                console.log('concat selection',concat_selection);
                var filtered_data = data.filter(function(d){return d[concat_selection] ==="1.0"});
                console.log('filtered_data',filtered_data);

                var impute_count = d3.nest()
                    .key(function(d){ return d.Category;})
                    // .key(function(d){ return d[concat_selection];})
                    .rollup(function(d) { return d.length; })
                    .entries(filtered_data);

                var missingCount = impute_count;

                var missingCategory = [];
                for (var i = 0; i < missingCount.length; i++) {
                    missingCategory.push(Object.values(missingCount[i])[0])
                }

                var notMissingCount = d3.nest()
                    .key(function(d){return d.Category})
                    .rollup(function(v){return v.length;})
                    // .filter(function(d,i){return removed_idx.includes(i);})
                    .entries(data);
                console.log("missingCount",missingCount);

                d3.selectAll(("input[value='bar_color']")).on("change", function() {
                    redraw_bar_color(missingCount,notMissingCount,selectAvg,missingCategory);

                });

                d3.selectAll(("input[value='bar_gradient']")).on("change", function() {
                    redraw_bar_gradient(missingCount,notMissingCount,selectAvg,missingCategory);

                });

                d3.selectAll(("input[value='bar_error']")).on("change", function() {
                    redraw_bar_error(missingCount,avg,notMissingCount,selectAvg,missingCategory);
                });

                d3.selectAll(("input[value='bar_pattern']")).on("change", function() {
                    redraw_bar_pattern(missingCount,notMissingCount,selectAvg,missingCategory);
                });

                d3.selectAll(("input[value='bar_missing']")).on("change", function() {
                    redraw_bar_missing(total_missing,missingCount,notMissingCount,selectAvg,missingCategory);
                });

                d3.selectAll(("input[value='bar_dash']")).on("change", function() {
                    redraw_bar_dash(missingCount,notMissingCount,selectAvg,missingCategory);
                });

                y.domain([0, d3.max(selectAvg, function(d){
                // y.domain([0,d3.max(data,function(d){
                //     return +d[selection.value];
                    return +d.value;
                })]);

                yAxis.scale(y);

               // this part added for transition
                var bar = d3.selectAll(".rectangle").data(selectAvg);

                bar.enter().append('rect')
                    .attr('class','bar')
                    .attr("x",function(d){return x(d.key);})
                    .attr('y',function(d){return y(d.value);})
                    .attr('height',function(d){return height - y(d.value);})
                    .attr("width",x.bandwidth());

                //remove data
                bar.exit().remove();

                bar.attr("y", function(d){return y(d.value);})
                    .attr('height',function(d){return height -y(d.value);});

                d3.selectAll("g.y.axis")
                    .transition()
                    .call(yAxis);

                // canvas.selectAll(".error").remove().exit();
                if(typeof bar_unknown_text === 'undefined'){ // bars
                    console.log('text bar undefined');
                }else{
                    bar_unknown_text.remove().exit();
                    // canvas.remove().exit();
                }
                if(typeof missing_count_bar === 'undefined'){ // bars
                    console.log('text bar undefined');
                }else{
                    missing_count_bar.remove().exit();
                    // canvas.remove().exit();
                }

                bar_error_line.remove().exit();
                bar_error_top.remove().exit();
                bar_error_down.remove().exit();

            });

        selector.selectAll("option")
            .data(elements)
            .enter().append("option")
            .attr("value", function(d){
                return d;
            })
            .text(function(d){
                return d;
            });

        function redraw_bar_color(missingCount,notMissingCount,avg,missingCategory){
            if(typeof missing_bar === 'undefined'){ // bars
                console.log('missing bar undefined');
            }else{

                missing_bar.remove().exit();
                // canvas.remove().exit();
            }if(typeof not_missing_bar === 'undefined'){ // bars
                console.log('missing bar undefined');
            }else{

                not_missing_bar.remove().exit();
                // canvas.remove().exit();
            }
            if(typeof bar_unknown_text === 'undefined'){ // bars
                console.log('text bar undefined');
            }else{
                bar_unknown_text.remove().exit();
                // canvas.remove().exit();
            }
            if(typeof missing_count_bar === 'undefined'){ // bars
                console.log('text bar undefined');
            }else{
                missing_count_bar.remove().exit();
                // canvas.remove().exit();
            }


            vis_bar = canvas.selectAll("rectangle")
            // .data(data)
                .data(avg)
                .enter()
                  .filter(function (d, i) {
                    return missingCategory.includes(d.key);
                })
                .append("rect")
                .attr("class","rectangle")
                // .attr("width", width/data.length-5)
                .attr("width", x.bandwidth())
                .attr("height", function(d){
                    return height -y(d.value);
                })
                .attr("x", function(d, i){
                    return x(d.key);
                })
                .attr("y", function(d){
                    return y(d.value);
                })
                .attr("stroke","#87CEFA")
                .attr("fill","#87CEFA")
                // .attr("fill","url(#gradient)")
                .append("title")
                .text(function(d){

                });

            vis_bar.remove().exit();

            not_missing_bar = canvas.selectAll("rectangle")
            // .data(data)
                .data(notMissingCount)
                .enter()
                .append("rect")
                .attr("class","rectangle")
                // .attr("width", width/data.length-5)
                .attr("width", x.bandwidth()/2)
                .attr("height", function(d){
                    return height -y1(d.value);
                })
                .attr("x", function(d, i){
                    return x(d.key);
                })
                .attr("y", function(d){
                    return y1(d.value);
                })
                .attr("stroke","silver")
                .attr("fill","silver")
                // .attr("fill","url(#gradient)")
                .append("title")
                .text(function(d){

                });


            missing_bar = canvas.selectAll("rectangle")
            // .data(data)
                .data(missingCount)
                .enter()
                .append("rect")
                .attr("class","rectangle")
                // .attr("width", width/data.length-5)
                .attr("width", x.bandwidth()/2)
                .attr("height", function(d){
                    return height -y1(d.value);
                })
                .attr("x", function(d, i){
                    return x(d.key);
                })
                .attr("y", function(d){
                    return y1(d.value);
                })
                .attr("stroke","orange")
                .attr("fill","orange")
                // .attr("fill","url(#gradient)")
                .append("title")
                .text(function(d){

                });

            bar_error_line.remove().exit();
            bar_error_top.remove().exit();
            bar_error_down.remove().exit();

        }// end of bar color

        function redraw_bar_error(missingCount,notMissingCount,avg,missingCategory){
            // console.log('selectAvg',avg.map(function(d){return d.value}));
            if(select_check  === true){
                avg = error_avg;
            }

            if(typeof missing_bar === 'undefined'){ // bars
                console.log('missing bar undefined');
            }else{
                missing_bar.remove().exit();
            }if(typeof not_missing_bar === 'undefined'){ // bars
                console.log('missing bar undefined');
            }else{
                not_missing_bar.remove().exit();
            }
            if(typeof bar_unknown_text === 'undefined'){ // bars
                console.log('text bar undefined');
            }else{
                bar_unknown_text.remove().exit();
            }
            if(typeof missing_count_bar === 'undefined'){ // bars
                console.log('text bar undefined');
            }else{
                missing_count_bar.remove().exit();
            }


            var missingCategory = [];
            for (var i = 0; i < missingCount.length; i++) {
                missingCategory.push(Object.values(missingCount[i])[0])
            }

            not_missing_bar = canvas.selectAll("rectangle")
            // .data(data)
                .data(notMissingCount)
                .enter()
                .append("rect")
                .attr("class","rectangle")
                // .attr("width", width/data.length-5)
                .attr("width", x.bandwidth()/2)
                .attr("height", function(d){
                    return height -y1(d.value);
                })
                .attr("x", function(d, i){
                    return x(d.key);
                })
                .attr("y", function(d){
                    return y1(d.value);
                })
                .attr("stroke","silver")
                .attr("fill","silver")
                // .attr("fill","url(#gradient)")
                .append("title")
                .text(function(d){

                });

            missing_bar =canvas.selectAll("rectangle")
            // .data(data)
                .data(missingCount)
                .enter()
                .append("rect")
                .attr("class","rectangle")
                // .attr("width", width/data.length-5)
                .attr("width", x.bandwidth()/2)
                .attr("height", function(d){
                    return height -y1(d.value);
                })
                .attr("x", function(d, i){
                    return x(d.key);
                })
                .attr("y", function(d){
                    return y1(d.value);
                })
                .attr("stroke","#87CEFA")
                .attr("fill","#87CEFA")
                // .attr("fill","url(#gradient)")
                .append("title")
                .text(function(d){

                });


            // Add Error Line
            // canvas.append("g").selectAll("line")
            bar_error_line = canvas.append("g").selectAll(".rectangle")
                .data(avg).enter()
                .append("line")
                .filter(function (d, i) {
                    return missingCategory.includes(d.key);
                })
                .attr("class", "error-line")
                .attr("x1", function(d) {
                    // return x(d.key);
                    return x(d.key) + x.bandwidth()/2;
                })
                .attr("y1", function(d,i) {
                    return y(d.value + std[i].value);
                })
                .attr("x2", function(d) {
                    // return x(d.key);
                    return x(d.key) + x.bandwidth()/2;
                })
                .attr("y2", function(d,i) {
                    return y(d.value - std[i].value);
                });

            // add error top cap
            bar_error_top = canvas.append("g").selectAll(".rectangle")
                .data(avg).enter()
                .append("line")
                .attr("class", "error-cap")
                .filter(function (d, i) {
                    return missingCategory.includes(d.key);
                })
                .attr("x1", function(d) {
                    return x(d.key)-3 + x.bandwidth()/2;
                })
                .attr("y1", function(d,i) {
                    return y(d.value + std[i].value);
                })
                .attr("x2", function(d) {
                    return x(d.key)+3 + x.bandwidth()/2;
                })
                .attr("y2", function(d,i) {
                    return y(d.value + std[i].value);
                });

            // add error bottom cap
            bar_error_down = canvas.append("g").selectAll(".rectangle")
                .data(avg).enter()
                .append("line")
                .attr("class", "error-cap")
                .filter(function (d, i) {
                    return missingCategory.includes(d.key);
                })
                .attr("x1", function(d) {
                    return x(d.key)-3 + x.bandwidth()/2;
                })
                .attr("y1", function(d,i) {
                    return y(d.value - std[i].value);
                })
                .attr("x2", function(d) {
                    return x(d.key) + 3 + x.bandwidth()/2;
                })
                .attr("y2", function(d,i) {
                    return y(d.value - std[i].value);
                });
        }// end of bars with error bars but add it on the computed data

        function redraw_bar_dash(missingCount,notMissingCount,avg,missingCategory){

            if(typeof missing_bar === 'undefined'){ // bars
                console.log('missing bar undefined');
            }else{

                missing_bar.remove().exit();
                // canvas.remove().exit();
            }if(typeof not_missing_bar === 'undefined'){ // bars
                console.log('missing bar undefined');
            }else{

                not_missing_bar.remove().exit();
                // canvas.remove().exit();
            }
            if(typeof bar_unknown_text === 'undefined'){ // bars
                console.log('text bar undefined');
            }else{
                bar_unknown_text.remove().exit();
                // canvas.remove().exit();
            }
            if(typeof missing_count_bar === 'undefined'){ // bars
                console.log('text bar undefined');
            }else{
                missing_count_bar.remove().exit();
                // canvas.remove().exit();
            }

            vis_bar = canvas.selectAll("rectangle")
            // .data(data)
                .data(avg)
                .enter()
                  .filter(function (d, i) {
                    return missingCategory.includes(d.key);
                })
                .append("rect")
                .attr("class","rectangle")
                // .attr("width", width/data.length-5)
                .attr("width", x.bandwidth())
                .attr("height", function(d){
                    return height -y(d.value);
                })
                .attr("x", function(d, i){
                    return x(d.key);
                })
                .attr("y", function(d){
                    return y(d.value);
                })
               .attr("fill","white")
                .attr('stroke','steelblue')
                .style("stroke-dasharray", ("3, 3"))
                // .attr("fill","url(#gradient)")
                .append("title")
                .text(function(d){

                });

            vis_bar.remove().exit();

            not_missing_bar = canvas.selectAll("rectangle")
            // .data(data)
                .data(notMissingCount)
                .enter()
                .append("rect")
                .attr("class","rectangle")
                // .attr("width", width/data.length-5)
                .attr("width", x.bandwidth()/2)
                .attr("height", function(d){
                    return height -y1(d.value);
                })
                .attr("x", function(d, i){
                    return x(d.key);
                })
                .attr("y", function(d){
                    return y1(d.value);
                })
                .attr("stroke","silver")
                .attr("fill","silver")
                // .attr("fill","url(#gradient)")
                .append("title")
                .text(function(d){

                });

            missing_bar = canvas.selectAll("rectangle")
            // .data(data)
                .data(missingCount)
                .enter()
                .append("rect")
                .attr("class","rectangle")
                // .attr("width", width/data.length-5)
                .attr("width", x.bandwidth()/2)
                .attr("height", function(d){
                    return height -y1(d.value);
                })
                .attr("x", function(d, i){
                    return x(d.key);
                })
                .attr("y", function(d){
                    return y1(d.value);
                })
                .attr("fill","orange")
                .attr('stroke','orange')
                // .style("stroke-dasharray", ("3, 3"))
                // .attr("fill","url(#gradient)")
                .append("title")
                .text(function(d){

                });

            bar_error_line.remove().exit();
            bar_error_top.remove().exit();
            bar_error_down.remove().exit();

        }// end of bar dash

        function redraw_bar_gradient(missingCount,notMissingCount,avg,missingCategory){

            if(typeof missing_bar === 'undefined'){ // bars
                console.log('missing bar undefined');
            }else{
                missing_bar.remove().exit();
                // canvas.remove().exit();
            }if(typeof not_missing_bar === 'undefined'){ // bars
                console.log('missing bar undefined');
            }else{

                not_missing_bar.remove().exit();
                // canvas.remove().exit();
            }
            if(typeof bar_unknown_text === 'undefined'){ // bars
                console.log('text bar undefined');
            }else{
                bar_unknown_text.remove().exit();
                // canvas.remove().exit();
            }
            if(typeof missing_count_bar === 'undefined'){ // bars
                console.log('text bar undefined');
            }else{
                missing_count_bar.remove().exit();
                // canvas.remove().exit();
            }

            var gradient_bar = canvas.append("defs")
                .append('linearGradient')
                .attr("id", "svgGradient")
                .attr("x1", "0%")
                .attr("y1", "0%")
                .attr("x2", "100%")
                .attr("y2", "100%")
                .attr("spreadMethod", "pad");

            gradient_bar.append('stop')
                .attr('class','start')
                .attr("offset", "0%")
                .attr("stop-color", "white")
                .attr("stop-opacity", 1);

            gradient_bar.append('stop')
                .attr('class','end')
                .attr("offset", "100%")
                .attr("stop-color", "steelblue")
                .attr("stop-opacity", 1);


             vis_bar = canvas.selectAll("rectangle")
            // .data(data)
                .data(avg)
                .enter()
                  .filter(function (d, i) {
                    return missingCategory.includes(d.key);
                })
                .append("rect")
                .attr("class","rectangle")
                // .attr("width", width/data.length-5)
                .attr("width", x.bandwidth())
                .attr("height", function(d){
                    return height -y(d.value);
                })
                .attr("x", function(d, i){
                    return x(d.key);
                })
                .attr("y", function(d){
                    return y(d.value);
                })
                .attr("fill","url(#svgGradient)")
                .attr('stroke','url(#svgGradient)')
                // .attr("fill","url(#gradient)")
                .append("title")
                .text(function(d){

                });

            vis_bar.remove().exit();

            not_missing_bar = canvas.selectAll("rectangle")
            // .data(data)
                .data(notMissingCount)
                .enter()
                .append("rect")
                .attr("class","rectangle")
                // .attr("width", width/data.length-5)
                .attr("width", x.bandwidth()/2)
                .attr("height", function(d){
                    return height -y1(d.value);
                })
                .attr("x", function(d, i){
                    return x(d.key);
                })
                .attr("y", function(d){
                    return y1(d.value);
                })
                .attr("stroke","silver")
                .attr("fill","silver")
                .append("title")
                .text(function(d){

                });

            missing_bar = canvas.selectAll("rectangle")
            // .data(data)
                .data(missingCount)
                .enter()
                .append("rect")
                .attr("class","rectangle")
                // .attr("width", width/data.length-5)
                .attr("width", x.bandwidth()/2)
                .attr("height", function(d){
                    return height -y1(d.value);
                })
                .attr("x", function(d, i){
                    return x(d.key);
                })
                .attr("y", function(d){
                    return y1(d.value);
                })
                .attr("stroke","orange")
                .attr("fill","orange")
                .append("title")
                .text(function(d){

                });



        }// end of bar gradient

        function redraw_bar_pattern(missingCount,notMissingCount,avg,missingCategory){
            if(typeof missing_bar === 'undefined'){ // bars
                console.log('missing bar undefined');
            }else{
                missing_bar.remove().exit();
            }if(typeof not_missing_bar === 'undefined'){ // bars
                console.log('missing bar undefined');
            }else{
                not_missing_bar.remove().exit();
            }
            if(typeof bar_unknown_text === 'undefined'){ // bars
                console.log('text bar undefined');
            }else{
                bar_unknown_text.remove().exit();
            }
            if(typeof missing_count_bar === 'undefined'){ // bars
                console.log('text bar undefined');
            }else{
                missing_count_bar.remove().exit();
            }

            vis_bar = canvas.selectAll("rectangle")
            // .data(data)
                .data(avg)
                .enter()
                  .filter(function (d, i) {
                    return missingCategory.includes(d.key);
                })
                .append("rect")
                .attr("class","rectangle")
                // .attr("width", width/data.length-5)
                .attr("width", x.bandwidth())
                .attr("height", function(d){
                    return height -y(d.value);
                })
                .attr("x", function(d, i){
                    return x(d.key);
                })
                .attr("y", function(d){
                    return y(d.value);
                })
                 .attr("stroke","url(#diagonal-stripes)")
                .attr("fill","url(#diagonal-stripes)")
                // .attr("fill","url(#gradient)")
                .append("title")
                .text(function(d){

                });

            vis_bar.remove().exit();

            not_missing_bar = canvas.selectAll("rectangle")
            // .data(data)
                .data(notMissingCount)
                .enter()
                .append("rect")
                .attr("class","rectangle")
                .attr("width", x.bandwidth()/2)
                .attr("height", function(d){
                    return height -y1(d.value);
                })
                .attr("x", function(d, i){
                    return x(d.key);
                })
                .attr("y", function(d){
                    return y1(d.value);
                })
                .attr("stroke","silver")
                .attr("fill","silver")
                .append("title")
                .text(function(d){

                });

            missing_bar = canvas.selectAll("rectangle")
            // .data(data)
                .data(missingCount)
                .enter()
                .append("rect")
                .attr("class","rectangle")
                // .attr("width", width/data.length-5)
                .attr("width", x.bandwidth()/2)
                .attr("height", function(d){
                    return height -y1(d.value);
                })
                .attr("x", function(d, i){
                    return x(d.key);
                })
                .attr("y", function(d){
                    return y1(d.value);
                })
                .attr("stroke","orange")
                .attr("fill","orange")
                .append("title")
                .text(function(d){
                });

            bar_error_line.remove().exit();
            bar_error_top.remove().exit();
            bar_error_down.remove().exit();


        }// end of bar pattern

        function redraw_bar_missing(total_missing,missingCount,notMissingCount,avg,missingCategory){

            if(typeof missing_bar === 'undefined'){ // bars
                console.log('missing bar undefined');
            }else{
                missing_bar.remove().exit();
            }if(typeof not_missing_bar === 'undefined'){ // bars
                console.log('missing bar undefined');
            }else{
                not_missing_bar.remove().exit();
            }
            if(typeof bar_unknown_text === 'undefined'){ // bars
                console.log('text bar undefined');
            }else{
                bar_unknown_text.remove().exit();
            }
            if(typeof missing_count_bar === 'undefined'){ // bars
                console.log('text bar undefined');
            }else{
                missing_count_bar.remove().exit();
            }


            var dataset = [total_missing];

            not_missing_bar = canvas.selectAll("rectangle")
            // .data(data)
                .data(notMissingCount)
                .enter()
                .append("rect")
                .attr("class","rectangle")
                // .attr("width", width/data.length-5)
                .attr("width", x.bandwidth()/2)
                .attr("height", function(d){
                    return height -y1(d.value);
                })
                .attr("x", function(d, i){
                    return x(d.key);
                })
                .attr("y", function(d){
                    return y1(d.value);
                })
                .attr("stroke","silver")
                .attr("fill","silver")
                // .attr("fill","url(#gradient)")
                .append("title")
                .text(function(d){

                });

            //fill rect in steelblue to hide
            missing_bar = canvas.selectAll("rectangle")
            // .data(data)
                .data(missingCount)
                .enter()
                .append("rect")
                .attr("class","rectangle")
                // .attr("width", width/data.length-5)
                .attr("width", x.bandwidth()/2)
                .attr("height", function(d){
                    return height -y1(d.value);
                })
                .attr("x", function(d, i){
                    return x(d.key);
                })
                .attr("y", function(d){
                    return y1(d.value);
                })
                // .attr("fill","url(#diagonal-stripe-2) #4682B4")
                .attr("stroke","orange")
                .attr("fill","orange")
                // .attr("fill","url(#gradient)")
                .append("title")
                .text(function(d){

                });// fill it like this to hide

            missing_count_bar = canvas.selectAll("rectangle")
            // .data(data)
            //     .data(missingCount)
                .data(dataset)
                .enter()
                .append("rect")
                .attr("class","rectangle")
                // .attr("width", width/data.length-5)
                .attr("width", x.bandwidth())
                .attr("height", function(d){
                    return total_missing;
                    // total_missing;
                })
                .attr("x", width+30)
                // .attr("y", function(d){return d.value;})
                .attr("y", height-total_missing)
                .attr("fill","orange")
                // .attr("fill","url(#gradient)")
                .append("title")
                .text(function(d){
                    return "unknown";

                });

            // add text
            bar_unknown_text = canvas.append("text")
                // .attr("class","unknown label")
                .attr("class","unknown")
                .text("unknown")
                .attr("x",width+x.bandwidth()+15)
                .attr("y",height+10)
                .attr("font-size","11px")
                .attr("fill","black")
                .attr("text-anchor","middle");

            bar_error_line.remove().exit();
            bar_error_top.remove().exit();
            bar_error_down.remove().exit();

        }// end of bar missing

    }// end of the make_bar function

    // this is the preview part, that shows the preview of the data
    // d3.csv( csvUrl, function( rows ) {
    //     d3.select("div#preview").html(
    //         "<b>First row:</b><br/>" + rowToHtml( rows[0] ));
    // })
};


d3.select("html")
    .style("height","100%");

// data = d3.select("#cLeft")
// // data = d3.select("body")
//     .style("height","100%")
//     .style("font", "12px sans-serif")
//     .append("input")
//     .attr("id", "uploadData")
//     .attr("type", "file")
//     .attr("accept", ".csv")
//     .style("margin", "5px")
//     .on("change", function() {
//         var file = d3.event.target.files[0];
//         if (file) {
//             var reader = new FileReader();
//             reader.onloadend = function(evt) {
//                 var dataUrl = evt.target.result;
//                 // The following call results in an "Access denied" error in IE.
//                 previewCsvUrl(dataUrl);
//
//             };
//             reader.readAsDataURL(file);
//             //reader.readAsText(file);
//         }
//     });

// d3.select("#cLeft")
d3.select("#cRight")
// d3.select("body")
    .append("div")
    .attr("id", "preview")
    .style("margin", "5px");



// Initialize with csv file from server, this is the deafult
// previewCsvUrl("./whiskey.csv");

d3.selectAll(("input[value='bar_mean']")).on("change", function() {
    if(typeof canvas === 'undefined'){
        console.log('canvas undefined');
    }else{
        console.log('canvas defined');
        selector.remove().exit();
        canvas.remove().exit();
    }
    if(typeof dots === 'undefined'){  //scatter
        console.log('canvas undefined');
    }else{
        console.log('canvas defined');
        dots.remove().exit();
        dotsEnter.remove().exit();
        // dots_chart.remove().exit();


    }if(typeof dots_chart === 'undefined'){ // bars
    }else{
        dots_chart.remove().exit(); //remove some of the encodings
    }
    if(typeof dots_chart_line === 'undefined'){ // bars
    }else{
        dots_chart_line.remove().exit();
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
    // result = runPyScript(datatosend);

    previewCsvUrl("./static/new_data/whiskey_global.csv");
});

d3.selectAll(("input[value='bar_knn']")).on("change", function() {
    if(typeof canvas === 'undefined'){
        console.log('canvas undefined');
    }else{
        console.log('canvas defined');
        selector.remove().exit();
        canvas.remove().exit();
    }
    if(typeof dots === 'undefined'){  //scatter
        console.log('canvas undefined');
    }else{
        console.log('canvas defined');
        dots.remove().exit();
        dotsEnter.remove().exit();
        // dots_chart.remove().exit();
    }if(typeof dots_chart === 'undefined'){ // bars
    }else{
        dots_chart.remove().exit(); //remove some of the encodings
    }
    if(typeof dots_chart_line === 'undefined'){ // bars
    }else{
        dots_chart_line.remove().exit();
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
    previewCsvUrl("./static/new_data/whiskey_knn.csv");
});

d3.selectAll(("input[value='bar_random']")).on("change", function() {
    if(typeof canvas === 'undefined'){
        console.log('canvas undefined');
    }else{
        selector.remove().exit();
        canvas.remove().exit();
    }
    if(typeof dots === 'undefined'){  //scatter
        console.log('canvas undefined');
    }else{
        dots.remove().exit();
        dotsEnter.remove().exit();
        // dots_chart.remove().exit();
    }if(typeof dots_chart === 'undefined'){ // bars
    }else{
        dots_chart.remove().exit(); //remove some of the encodings
    }
    if(typeof dots_chart_line === 'undefined'){ // bars
    }else{
        dots_chart_line.remove().exit();
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
    previewCsvUrl("./static/new_data/whiskey_random.csv");
});

d3.selectAll(("input[value='scatter_mean']")).on("change", function() {
    if(typeof canvas === 'undefined'){
        console.log('canvas undefined');
    }else{
        console.log('canvas defined');
        selector.remove().exit();
        canvas.remove().exit();
    }
    if(typeof dots === 'undefined'){  //scatter
        console.log('canvas undefined');
    }else{
        console.log('canvas defined');
        dots.remove().exit();
        dotsEnter.remove().exit();
        // dots_chart.remove().exit();
    }if(typeof dots_chart === 'undefined'){ // bars
    }else{
        dots_chart.remove().exit(); //remove some of the encodings
    }
    if(typeof dots_chart_line === 'undefined'){ // bars
    }else{
        dots_chart_line.remove().exit();
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
    previewCsvUrl("./static/new_data/whiskey_global.csv");
});

d3.selectAll(("input[value='scatter_knn']")).on("change", function() {
    if(typeof canvas === 'undefined'){ // bars
        console.log('canvas undefined');
    }else{
        console.log('canvas defined');
        selector.remove().exit();
        canvas.remove().exit();
    }

    if(typeof dots === 'undefined'){  //scatter
        console.log('canvas undefined');
    }else{
        console.log('canvas defined');
        dots.remove().exit();
        dotsEnter.remove().exit();
        // dots_chart.remove().exit();
    }if(typeof dots_chart === 'undefined'){ // bars
    }else{
        dots_chart.remove().exit(); //remove some of the encodings
    }
    if(typeof dots_chart_line === 'undefined'){ // bars
    }else{
        dots_chart_line.remove().exit();
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

    console.log('call knn for scatter');
    previewCsvUrl("./static/new_data/whiskey_knn.csv");
});

d3.selectAll(("input[value='scatter_random']")).on("change", function() {
    if(typeof canvas === 'undefined'){ // bars
        console.log('canvas undefined');
    }else{
        console.log('canvas defined');
        selector.remove().exit();
        canvas.remove().exit();
    }

    if(typeof dots === 'undefined'){  //scatter
        console.log('canvas undefined');
    }else{
        console.log('canvas defined');
        dots.remove().exit();
        dotsEnter.remove().exit();
        // dots_chart.remove().exit();
    }if(typeof dots_chart === 'undefined'){ // bars
    }else{
        dots_chart.remove().exit(); //remove some of the encodings
    }
    if(typeof dots_chart_line === 'undefined'){ // bars
    }else{
        dots_chart_line.remove().exit();
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

    previewCsvUrl("./static/new_data/whiskey_random.csv");
});

previewCsvUrl("./static/new_data/whiskey_random.csv");

//previewCsvUrl("./whiskey_global.csv");
// previewCsvUrl("./whiskey_knn.csv");
// previewCsvUrl(url);