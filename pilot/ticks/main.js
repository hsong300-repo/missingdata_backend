


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


            // ***autocomplete goes here***
            global_wiskey_data =  whiskey;

            // generate a list of genes for auto complete
            //// get all data whiskey
            all_whiskey = [];

            //loop through row_nodes
            for (i=0; i<dataset.length; i++){
                all_whiskey.push( dataset[i]['Brand'] );
            };

            // use Jquery autocomplete
            ////////////////////////////////
            $( "#gene_search_box" ).autocomplete({
                source: all_whiskey
            });

            //*** auto complete ends here

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
    // d3.csv(csvUrl, function(error, data){
    //
    //     make_bar(data);
    //
    // });

    d3.csv("./new_data/whiskey_random.csv", function(error, random_data){
        d3.csv("./new_data/whiskey_global.csv", function(error, global_data){
            d3.csv("./new_data/whiskey_knn.csv", function(error, knn_data){

                // make_bar(data);
                make_bar(random_data,global_data, knn_data);





            });
        });
    });

    //make the bar function
    function make_bar(random_data,global_data, knn_data){
        // function make_bar(data){

        var margin = {top: 80, right: 180, bottom: 80, left: 180},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        canvas = d3.select("#bar_canvas")
        // .attr("id","canvas")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        data = random_data; // preselected value

        knn_flag = false;
        random_flag = false;
        mean_flag = false;
        select_flag = false;

        if(knn_flag === true){
            data = knn_data;
        }else if(random_flag === true){
            data = random_data;
        }else if(mean_flag === true){
            data = global_data;
        }



        // filter value
        // Get every column value
        var elements = Object.keys(data[0])
            .filter(function(d){
                return ((d != "Name") & (d != "Country") & (d != "Category") & (d != "Brand")&(d != "rate_impute") & (d != "price_impute") & (d != "abv_impute") & (d != "age_impute"));
            });
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
        // var avg = d3.nest()
            .key(function(d){ return d.Category;})
            .rollup(function(v){return d3.mean(v,function(d){
                return +d[selection];});})
            .entries(data);

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
            .attr("class", "y1-axis")
            .attr("opacity",0)
            .call(y1Axis);

        // end of y1-axis
        canvas.append("text")
        // .attr("class","unknown label")
            .attr("class","unknown")
            .attr("opacity",0)
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
            // .attr("fill","steelblue")
            .attr("fill","#87CEFA")
            // .attr("fill","url(#svgGradient)")
            .append("title")
            // .style("margin-left", "10px")   //space between bars
            .text(function(d){

            });

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

        d3.selectAll(".rectangle").filter(function (d, i) {
            return missingCategory.includes(d.key);})
            .attr("stroke","#87CEFA")
            .style("stroke-dasharray", ("0, 0"))
            .attr("fill","#87CEFA");

        d3.selectAll(".rectangle").filter(function (d, i) {
            return !missingCategory.includes(d.key);})
            .attr("stroke","steelblue")
            .style("stroke-dasharray", ("0, 0"))
            .attr("fill","steelblue");

        //legneds for count
        canvas.append("rect")
            .attr("class","count-legend")
            .attr("x", width +50)
            .attr("y", 0)
            .attr("width", 10)
            .attr("height", 10)
            .attr("opacity",0)
            .style("fill", "silver");

        canvas.append("rect")
            .attr("class","count-legend")
            .attr("x", width +50)
            .attr("y", 20)
            .attr("width", 10)
            .attr("height", 10)
            .attr("opacity",0)
            .style("fill", "orange");

        canvas.append("text")
        // .attr("class","unknown label")
            .attr("class","count-legend")
            .text("Not Missing")
            .attr("x",width+50+15)
            .attr("y",8)
            .attr("font-size","11px")
            .attr("opacity",0)
            .attr("fill","black");
        // .attr("text-anchor","middle");

        canvas.append("text")
            .attr("class","count-legend")
            .text("Missing")
            .attr("x",width+50+15)
            .attr("y",28)
            .attr("font-size","11px")
            .attr("opacity",0)
            .attr("fill","black");

        select_check = false;


        // var missingCount = d3.nest()
        //     .key(function(d){return d.Category})
        //     .rollup(function(v){return v.length;})
        //     // .filter(function(d,i){return removed_idx.includes(i);})
        //     .entries(f_data);


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

        d3.selectAll(("input[value='bar_dash']")).on("change", function() {
            console.log('onchange bar dash');

            redraw_bar_dash(missingCount,notMissingCount,avg,missingCategory);
        });
        d3.selectAll(("input[value='bar_animation']")).on("change", function() {
            console.log('onchange bar dash');

            redraw_bar_animation(missingCount,notMissingCount,avg,missingCategory);
        });

        d3.selectAll(("input[value='bar_none']")).on("change", function() {
            console.log('bar none');
            redraw_bar_none();
        });

        d3.selectAll(("input[value='counts_on']")).on("change", function() {
            console.log('counts on');
            redraw_bar_counts_on(missingCount,notMissingCount,avg,missingCategory);
        });
        d3.selectAll(("input[value='counts_off']")).on("change", function() {
            console.log('counts off');
            redraw_bar_counts_off(missingCount,notMissingCount,avg,missingCategory);
        });

        d3.select("#bar_knn")
            .on("click",function(d){
                console.log('bar knn');
                data = knn_data;

                if(select_flag === false){
                    var selectAvg = d3.nest()
                        .key(function(d){ return d.Category;})
                        .rollup(function(v){return d3.mean(v,function(d){
                            return +d[selection];});})
                        .entries(data);
                }else if(select_flag === true){
                    var selectAvg = d3.nest()
                        .key(function(d){ return d.Category;})
                        .rollup(function(v){return d3.mean(v,function(d){
                            return +d[selection.value];});})
                        .entries(data);
                }

                y.domain([0, d3.max(selectAvg, function(d){
                    // y.domain([0,d3.max(data,function(d){
                    //     return +d[selection.value];
                    return +d.value;
                })]);

                yAxis.scale(y);

                console.log('here');

                // this part added for transition
                var bar = d3.selectAll(".rectangle").data(selectAvg);

                console.log('here after');

                bar.enter().append('rect')
                // .attr('class','bar_knn')
                // .transition()
                // .duration(1000)
                // .ease("linear")
                    .attr("fill","teal")
                    // .attr('class','rectangle')
                    .attr("x",function(d){return x(d.key);})
                    .attr('y',function(d){return y(d.value);})
                    .attr('height',function(d){return height - y(d.value);})
                    .attr("width",x.bandwidth());

                console.log('again');


                //remove data
                bar.exit().remove();

                console.log('again 1');


                bar.attr("y", function(d){return y(d.value);})
                    .attr('height',function(d){return height -y(d.value);});

                console.log('again 2');


                d3.selectAll("g.y.axis")
                    .transition()
                    .call(yAxis);

                console.log('again 2');


                knn_flag = true;
                mean_flag = false;
                random_flag = false;


            });
        //
        d3.select("#bar_mean")
            .on("click",function(d){
                console.log('bar global');
                data = global_data;

                console.log('bar mean');

                if(select_flag === false){
                    var selectAvg = d3.nest()
                        .key(function(d){ return d.Category;})
                        .rollup(function(v){return d3.mean(v,function(d){
                            return +d[selection];});})
                        .entries(data);
                }else if(select_flag === true){
                    var selectAvg = d3.nest()
                        .key(function(d){ return d.Category;})
                        .rollup(function(v){return d3.mean(v,function(d){
                            return +d[selection.value];});})
                        .entries(data);
                }

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
                    // .transition()
                    // .duration(1000)
                    // .ease("linear")
                    .attr("fill","teal")
                    // .attr('class','rectangle')
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

                mean_flag = true;
                knn_flag = false;
                random_flag = false;


            });

        d3.select("#bar_random")
            .on("click",function(d){
                console.log('bar random');
                data = random_data;

                console.log('bar random');

                if(select_flag === false){
                    var selectAvg = d3.nest()
                        .key(function(d){ return d.Category;})
                        .rollup(function(v){return d3.mean(v,function(d){
                            return +d[selection];});})
                        .entries(data);
                }else if(select_flag === true){
                    var selectAvg = d3.nest()
                        .key(function(d){ return d.Category;})
                        .rollup(function(v){return d3.mean(v,function(d){
                            return +d[selection.value];});})
                        .entries(data);
                }

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
                    // .transition()
                    // .duration(1000)
                    // .ease("linear")
                    .attr("fill","teal")
                    // .attr('class','rectangle')
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

                random_flag = true;
                mean_flag = false;
                knn_flag = false;

            });



        // var selector = d3.select("#drop")
        selector = d3.selectAll("#bar_view")
            .append("select")
            .attr("id","dropdown")
            .on("change", function(d){

                select_check = true;
                selection = document.getElementById("dropdown");

                if(knn_flag === true){
                    data = knn_data;
                }



                var selectAvg = d3.nest()
                    .key(function(d){ return d.Category;})
                    .rollup(function(v){return d3.mean(v,function(d){
                        return +d[selection.value];});})
                    .entries(data);

                console.log("selection here dropdown");


                error_avg = selectAvg;

                //update missing bars
                var temp = selection.value;
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
                var filtered_data = data.filter(function(d){return d[concat_selection] ==="1.0"});

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

                d3.selectAll(("input[value='bar_color']")).on("change", function() {
                    console.log('color dropdown');
                    redraw_bar_color(missingCount,notMissingCount,selectAvg,missingCategory);
                });

                d3.selectAll(("input[value='bar_gradient']")).on("change", function() {
                    console.log("gradient dropdown");
                    redraw_bar_gradient(missingCount,notMissingCount,selectAvg,missingCategory);

                });

                d3.selectAll(("input[value='bar_error']")).on("change", function() {
                    redraw_bar_error(missingCount,notMissingCount,avg,missingCategory);

                    // redraw_bar_error(missingCount,avg,notMissingCount,selectAvg,missingCategory);
                });

                d3.selectAll(("input[value='bar_pattern']")).on("change", function() {
                    redraw_bar_pattern(missingCount,notMissingCount,selectAvg,missingCategory);
                });


                d3.selectAll(("input[value='bar_dash']")).on("change", function() {
                    redraw_bar_dash(missingCount,notMissingCount,selectAvg,missingCategory);
                });

                d3.selectAll(("input[value='bar_animation']")).on("change", function() {
                    console.log('onchange bar dash');
                    redraw_bar_animation(missingCount,notMissingCount,selectAvg,missingCategory);
                });

                d3.selectAll(("input[value='counts_on']")).on("change", function() {
                    console.log('counts on');
                    redraw_bar_counts_on(missingCount,notMissingCount,selectAvg,missingCategory);
                });
                d3.selectAll(("input[value='counts_off']")).on("change", function() {
                    console.log('counts off');
                    redraw_bar_counts_off(missingCount,notMissingCount,selectAvg,missingCategory);
                });

                d3.selectAll(("input[value='bar_none']")).on("change", function() {
                    console.log('bar none');
                    redraw_bar_none();
                });

                console.log("here 2");



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
                    // .attr('class','rectangle')
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

                console.log("here 3");

                select_flag = true;

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

        function redraw_bar_none(){


            d3.selectAll(".error-line").attr("opacity",0);
            d3.selectAll(".error-cap").attr("opacity",0);


        }// end of bar color

        function redraw_bar_color(missingCount,notMissingCount,avg,missingCategory){

            // vis_bar = canvas.selectAll("rectangle")

            d3.selectAll(".rectangle").filter(function (d, i) {
                return missingCategory.includes(d.key);})
                .attr("stroke","#87CEFA")
                .style("stroke-dasharray", ("0, 0"))
                .attr("fill","#87CEFA");

            d3.selectAll(".rectangle").filter(function (d, i) {
                return !missingCategory.includes(d.key);})
                .attr("stroke","steelblue")
                .style("stroke-dasharray", ("0, 0"))
                .attr("fill","steelblue");




        }// end of bar none

        function redraw_bar_animation(missingCount,notMissingCount,avg,missingCategory){
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

            // var bar = d3.selectAll(".rectangle").data(avg).filter(function (d, i) {
            //         return missingCategory.includes(d.key);
            //     });
            //
            //     bar.enter().append('rect')
            //         .attr('class','bar')
            //         .attr("x",function(d){return x(d.key);})
            //         .attr('y',function(d){return y(d.value);})
            //         .attr("fill","#87CEFA")
            //         .attr('height',function(d){return height - y(d.value);})
            //         .attr("width",x.bandwidth());
            //
            //     //remove data
            //     bar.exit().remove();
            //
            //     bar.attr("y", function(d){return y(d.value);})
            //         .attr('height',function(d){return height -y(d.value);});


            // vis_bar = canvas.selectAll("rectangle")
            // // .data(data)
            //     .data(avg)
            //     .enter()
            //       .filter(function (d, i) {
            //         return missingCategory.includes(d.key);
            //     })
            //     .append("rect")
            //     .attr("class","rectangle")
            //     // .attr("width", width/data.length-5)
            //     .attr("width", x.bandwidth())
            //     .attr("height", function(d){
            //         return height -y(d.value);
            //     })
            //     .attr("x", function(d, i){
            //         return x(d.key);
            //     })
            //     .attr("y", function(d){
            //         return y(d.value);
            //     })
            //     .attr("stroke","#87CEFA")
            //     .attr("fill","#87CEFA")
            //     // .attr("fill","url(#gradient)")
            //     .append("title")
            //     .text(function(d){
            //
            //     });
            // vis_bar.remove().exit();

            d3.selectAll(".error-line").attr("opacity",0);
            d3.selectAll(".error-cap").attr("opacity",0);


            var transition = d3.selectAll(".rectangle")
                .filter(function (d, i) {
                    return missingCategory.includes(d.key);
                })
                .transition().duration(2000);

            // transition.attr("y", function(d){
            //         return height-y(d.value);
            //     }).attr("height",0)
            //     .transition().duration(2000)
            //     .attr("y", 0)
            //     .attr("height",function(d){
            //         return height -y(d.value);
            //     });

            transition
                .attr("y" ,function(d){
                    return height -y(d.value);
                })
                .attr("height",function(d){
                    return y(d.value);
                }).transition().duration(2000)
                .attr("y",function(d){
                    return y(d.value);
                }).attr("height", function(d){
                return height-y(d.value);
            });

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

            d3.selectAll(".rectangle").filter(function (d, i) {
                return missingCategory.includes(d.key);
            }).attr("fill","white")
                .attr('stroke','steelblue')
                .style("stroke-dasharray", ("3, 3"));

            d3.selectAll(".rectangle").filter(function (d, i) {
                return !missingCategory.includes(d.key);})
                .attr("stroke","steelblue")
                .style("stroke-dasharray", ("0, 0"))
                .attr("fill","steelblue");


        }// end of bar dash

        function redraw_bar_gradient(missingCount,notMissingCount,avg,missingCategory){

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


            //  vis_bar = canvas.selectAll("rectangle")
            // // .data(data)
            //     .data(avg)
            //     .enter()
            //       .filter(function (d, i) {
            //         return missingCategory.includes(d.key);
            //     })
            //     .append("rect")
            //     .attr("class","rectangle")
            //     // .attr("width", width/data.length-5)
            //     .attr("width", x.bandwidth())
            //     .attr("height", function(d){
            //         return height -y(d.value);
            //     })
            //     .attr("x", function(d, i){
            //         return x(d.key);
            //     })
            //     .attr("y", function(d){
            //         return y(d.value);
            //     })
            //     .attr("fill","url(#svgGradient)")
            //     .attr('stroke','url(#svgGradient)')
            //     // .attr("fill","url(#gradient)")
            //     .append("title")
            //     .text(function(d){
            //
            //     });
            //
            // vis_bar.remove().exit();

            d3.selectAll(".rectangle").filter(function (d, i) {
                return !missingCategory.includes(d.key);})
                .attr("stroke","steelblue")
                .style("stroke-dasharray", ("0, 0"))
                .attr("fill","steelblue");

            d3.selectAll(".rectangle").filter(function (d, i) {
                return missingCategory.includes(d.key);})
                .attr("stroke","url(#svgGradient)")
                .style("stroke-dasharray", ("0, 0"))
                .attr("fill","url(#svgGradient)");


        }// end of bar gradient

        function redraw_bar_pattern(missingCount,notMissingCount,avg,missingCategory){


            // vis_bar = canvas.selectAll("rectangle")
            // // .data(data)
            //     .data(avg)
            //     .enter()
            //       .filter(function (d, i) {
            //         return missingCategory.includes(d.key);
            //     })
            //     .append("rect")
            //     .attr("class","rectangle")
            //     // .attr("width", width/data.length-5)
            //     .attr("width", x.bandwidth())
            //     .attr("height", function(d){
            //         return height -y(d.value);
            //     })
            //     .attr("x", function(d, i){
            //         return x(d.key);
            //     })
            //     .attr("y", function(d){
            //         return y(d.value);
            //     })
            //      .attr("stroke","url(#diagonal-stripes)")
            //     .attr("fill","url(#diagonal-stripes)")
            //     // .attr("fill","url(#gradient)")
            //     .append("title")
            //     .text(function(d){
            //
            //     });
            //
            // vis_bar.remove().exit();

            d3.selectAll(".rectangle").filter(function (d, i) {
                return missingCategory.includes(d.key);})
                .attr("stroke","url(#diagonal-stripes)")
                .attr("fill","url(#diagonal-stripes)")
                .style("stroke-dasharray", ("0, 0"));

            d3.selectAll(".rectangle").filter(function (d, i) {
                return !missingCategory.includes(d.key);})
                .attr("stroke","steelblue")
                .style("stroke-dasharray", ("0, 0"))
                .attr("fill","steelblue");


        }// end of bar pattern


        function redraw_bar_counts_on(missingCount,notMissingCount,avg,missingCategory){
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

            not_missing_bar = canvas.selectAll("rectangle")
            // .data(data)
                .data(notMissingCount)
                .enter()
                .append("rect")
                // .attr("class","rectangle")
                .attr("class","no_impute_bar")
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
                // .attr("class","rectangle")
                .attr("class","impute_bar")
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

            d3.selectAll(".y1-axis").attr("opacity",1);
            d3.selectAll(".count-legend").attr("opacity",1);
            d3.selectAll(".unknown").attr("opacity",1);




        }// end of bar counts on

        function redraw_bar_counts_off(missingCount,notMissingCount,avg,missingCategory){

            d3.selectAll(".impute_bar").attr("opacity",0);
            d3.selectAll(".no_impute_bar").attr("opacity",0);
            d3.selectAll(".y1-axis").attr("opacity",0);
            d3.selectAll(".count-legend").attr("opacity",0);
            d3.selectAll(".unknown").attr("opacity",0);



        }// end of bar counts off






    }// end of the make_bar function

    // this is the preview part, that shows the preview of the data
    // d3.csv( csvUrl, function( rows ) {
    //     d3.select("div#preview").html(
    //         "<b>First row:</b><br/>" + rowToHtml( rows[0] ));
    // })
};


d3.select("html")
    .style("height","100%");

data = d3.select("#cLeft")
// data = d3.select("body")
    .style("height","100%")
    .style("font", "12px sans-serif")
    .append("input")
    .attr("id", "uploadData")
    .attr("type", "file")
    .attr("accept", ".csv")
    .style("margin", "5px")
    .on("change", function() {
        var file = d3.event.target.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onloadend = function(evt) {
                var dataUrl = evt.target.result;
                // The following call results in an "Access denied" error in IE.
                previewCsvUrl(dataUrl);

            };
            reader.readAsDataURL(file);
            //reader.readAsText(file);
        }
    });

// d3.select("#cLeft")
d3.select("#cRight")
// d3.select("body")
    .append("div")
    .attr("id", "preview")
    .style("margin", "5px");



// Initialize with csv file from server, this is the deafult
// previewCsvUrl("./whiskey.csv");

// d3.selectAll(("input[value='bar_mean']")).on("change", function() {
//     if(typeof canvas === 'undefined'){
//         console.log('canvas undefined');
//     }else{
//         console.log('canvas defined');
//         // selector.remove().exit();
//         canvas.remove().exit();
//     }if(typeof selector === 'undefined'){
//         console.log('canvas undefined');
//     }else{
//         selector.remove().exit();
//     }
//     if(typeof dots === 'undefined'){  //scatter
//         console.log('canvas undefined');
//     }else{
//         console.log('canvas defined');
//         dots.remove().exit();
//         dotsEnter.remove().exit();
//         // dots_chart.remove().exit();
//
//
//     }if(typeof dots_chart === 'undefined'){ // bars
//     }else{
//         dots_chart.remove().exit(); //remove some of the encodings
//     }
//     if(typeof dots_chart_line === 'undefined'){ // bars
//     }else{
//         dots_chart_line.remove().exit();
//     }if(typeof dots_chart_line_y === 'undefined'){ // bars
//         console.log('dotschart undefined');
//     }else {
//         dots_chart_line_y.remove().exit();
//         // dots_remove.remove().exit();
//     }if(typeof dots_chart_x === 'undefined'){ // bars
//         console.log('dotschart undefined');
//     }else{
//         dots_chart_x.remove().exit(); //remove some of the encodings
//     }if(typeof dots_chart_y === 'undefined'){ // bars
//         console.log('dotschart undefined');
//     }else{
//         dots_chart_y.remove().exit(); //remove some of the encodings
//     }
//     // result = runPyScript(datatosend);
//
//     previewCsvUrl("./new_data/whiskey_global.csv");
// });
//
// d3.selectAll(("input[value='bar_knn']")).on("change", function() {
//     if(typeof canvas === 'undefined'){
//         console.log('canvas undefined');
//     }else{
//         console.log('canvas defined');
//         selector.remove().exit();
//         canvas.remove().exit();
//     } if(typeof selector === 'undefined'){
//         console.log('canvas undefined');
//     }else{
//         selector.remove().exit();
//     }
//     if(typeof dots === 'undefined'){  //scatter
//         console.log('canvas undefined');
//     }else{
//         console.log('canvas defined');
//         dots.remove().exit();
//         dotsEnter.remove().exit();
//         // dots_chart.remove().exit();
//     }if(typeof dots_chart === 'undefined'){ // bars
//     }else{
//         dots_chart.remove().exit(); //remove some of the encodings
//     }
//     if(typeof dots_chart_line === 'undefined'){ // bars
//     }else{
//         dots_chart_line.remove().exit();
//     }if(typeof dots_chart_line_y === 'undefined'){ // bars
//         console.log('dotschart undefined');
//     }else {
//         dots_chart_line_y.remove().exit();
//         // dots_remove.remove().exit();
//     }if(typeof dots_chart_x === 'undefined'){ // bars
//         console.log('dotschart undefined');
//     }else{
//         dots_chart_x.remove().exit(); //remove some of the encodings
//     }if(typeof dots_chart_y === 'undefined'){ // bars
//         console.log('dotschart undefined');
//     }else{
//         dots_chart_y.remove().exit(); //remove some of the encodings
//     }
//     previewCsvUrl("./new_data/whiskey_knn.csv");
// });
//
// d3.selectAll(("input[value='bar_random']")).on("change", function() {
//     if(typeof canvas === 'undefined'){
//         console.log('canvas undefined');
//     }else{
//         // selector.remove().exit();
//         canvas.remove().exit();
//     }if(typeof selector === 'undefined'){
//         console.log('canvas undefined');
//     }else{
//         selector.remove().exit();
//     }
//
//     if(typeof dots === 'undefined'){  //scatter
//         console.log('canvas undefined');
//     }else{
//         dots.remove().exit();
//         dotsEnter.remove().exit();
//         // dots_chart.remove().exit();
//     }if(typeof dots_chart === 'undefined'){ // bars
//     }else{
//         dots_chart.remove().exit(); //remove some of the encodings
//     }
//     if(typeof dots_chart_line === 'undefined'){ // bars
//     }else{
//         dots_chart_line.remove().exit();
//     }if(typeof dots_chart_line_y === 'undefined'){ // bars
//         console.log('dotschart undefined');
//     }else {
//         dots_chart_line_y.remove().exit();
//         // dots_remove.remove().exit();
//     }if(typeof dots_chart_x === 'undefined'){ // bars
//         console.log('dotschart undefined');
//     }else{
//         dots_chart_x.remove().exit(); //remove some of the encodings
//     }if(typeof dots_chart_y === 'undefined'){ // bars
//         console.log('dotschart undefined');
//     }else{
//         dots_chart_y.remove().exit(); //remove some of the encodings
//     }
//     previewCsvUrl("./new_data/whiskey_random.csv");
// });

d3.selectAll(("input[value='scatter_mean']")).on("change", function() {
    if(typeof canvas === 'undefined'){
        console.log('canvas undefined');
    }else{
        console.log('canvas defined');
        // selector.remove().exit();
        canvas.remove().exit();
    }if(typeof selector === 'undefined'){
        console.log('canvas undefined');
    }else{
        selector.remove().exit();
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
    previewCsvUrl("./new_data/whiskey_global.csv");
});

d3.selectAll(("input[value='scatter_knn']")).on("change", function() {
    if(typeof canvas === 'undefined'){ // bars
        console.log('canvas undefined');
    }else{
        console.log('canvas defined');
        // selector.remove().exit();
        canvas.remove().exit();
    }if(typeof selector === 'undefined'){
        console.log('canvas undefined');
    }else{
        selector.remove().exit();
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
    previewCsvUrl("./new_data/whiskey_knn.csv");
});

d3.selectAll(("input[value='scatter_random']")).on("change", function() {
    if(typeof canvas === 'undefined'){ // bars
        console.log('canvas undefined');
    }else{
        console.log('canvas defined');
        // selector.remove().exit();
        canvas.remove().exit();
    }if(typeof selector === 'undefined'){
        console.log('canvas undefined');
    }else{
        selector.remove().exit();
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

    previewCsvUrl("./new_data/whiskey_random.csv");
});

// previewCsvUrl("./static/new_data/whiskey_random.csv");
previewCsvUrl("./new_data/whiskey_knn_customized.csv");


//previewCsvUrl("./whiskey_global.csv");
// previewCsvUrl("./whiskey_knn.csv");
// previewCsvUrl(url);