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

previewCsvUrl("./new_data/whiskey_knn_customized.csv");


//previewCsvUrl("./whiskey_global.csv");
// previewCsvUrl("./whiskey_knn.csv");
// previewCsvUrl(url);