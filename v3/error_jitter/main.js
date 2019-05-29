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


    //make the bar function

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

//collision or jitter
var controls = d3.select("body").append("label")
    .attr("id", "controls");
var checkbox = controls.append("input")
    .attr("id", "collisiondetection")
    .attr("type", "checkbox");
controls.append("span")
    .text("Collision detection");



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

previewCsvUrl("./new_data/whiskey_knn_customized.csv");


//previewCsvUrl("./whiskey_global.csv");
// previewCsvUrl("./whiskey_knn.csv");
// previewCsvUrl(url);