//****This code was last updated 09/20/2019
// it was updated with the new collected data from Yahoo Finance*****

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
    // d3.csv(csvUrl, function(error, dataset){
    d3.csv(csvUrl,function(row) {
            return {
                'name': row['name'],
                'ticker': row['ticker'],
                'beta': +row['beta'],
                'currprice': +row['currprice'],
                'pctchg52wks': +row['pctchg52wks'],
                'avgvol': +row['avgvol'],
                'peratio': +row['peratio'],
                'roe': +row['roe'],
                // 'marketcap': +row['marketcap'],
                'eps': +row['eps'],
                'beta_impute': +row['beta_impute'],
                'currprice_impute': +row['currprice_impute'],
                'pctchg52wks_impute': +row['pctchg52wks_impute'],
                'avgvol_impute': +row['avgvol_impute'],
                'peratio_impute': +row['peratio_impute'],
                'roe_impute': +row['roe_impute'],
                // 'marketcap_impute': +row['marketcap_impute'],
                'eps_impute': +row['eps_impute'],

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
            console.log('dataset',dataset);

            // ***autocomplete goes here***
            global_wiskey_data =  whiskey;

            // generate a list of genes for auto complete
            //// get all data whiskey
            all_whiskey = [];

            //loop through row_nodes
            for (i=0; i<dataset.length; i++){
                all_whiskey.push( dataset[i]['ticker'] );
            };

            all_whiskey.sort();

            // use Jquery autocomplete
            ////////////////////////////////
            $( "#gene_search_box" ).autocomplete({
                source: all_whiskey
            }).data("ui-autocomplete")._renderMenu = function (ul, items) {
                var that = this;
                var res = items.sort(function (a, b) {
                    return new RegExp("^" + that.element.val(), "i").test(a.value) < new RegExp("^" + that.element.val(), "i").test(b.value) && 1
                });
                $.each(res, function (index, item) {
                    that._renderItemData(ul, item);
                });
            };

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

            console.log('domain map',domainMap);

            console.log('domain beta',domainMap['beta'],domainMap['beta'][0],domainMap['beta'][1]);
            //fix some tweaking
            domainMap['beta'][1]+=0.2;
            domainMap['currprice'][1]+=10;
            // domainMap['pctchg52wks'][1]+=5;
            domainMap['roe'][1] +=5;

            console.log('change domainmap',domainMap);

            //get the percentage of the two

            // Create global object called chartScales to keep state
            chartScales = {x: 'beta', y: 'peratio'};

            updateChart();

        });

};





// previewCsvUrl("./new_data/stock_knn_2.csv");
// previewCsvUrl("./new_data/stock_demo_demo.csv");
previewCsvUrl("./new_data/stock_removed_knn_final.csv");


