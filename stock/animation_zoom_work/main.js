var previewCsvUrl = function( csvUrl ) {
    //part that draws the scatter chart

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
                'marketcap': +row['marketcap'],
                'eps': +row['eps'],
                'currprice_impute': +row['currprice_impute'],
                'pctchg52wks_impute': +row['pctchg52wks_impute'],
                'avgvol_impute': +row['avgvol_impute'],
                'peratio_impute': +row['peratio_impute'],
                'roe_impute': +row['roe_impute'],
                'marketcap_impute': +row['marketcap_impute'],
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

            // ***autocomplete goes here***
            global_wiskey_data =  whiskey;

            // generate a list of genes for **auto complete**
            //// get all data whiskey
            all_whiskey = [];

            //loop through row_nodes
            for (i=0; i<dataset.length; i++){
                all_whiskey.push( dataset[i]['name'] );
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

            // Create global object called chartScales to keep state
            // chartScales = {x: 'Price', y: 'Age'};
            chartScales = {x: 'currprice', y: 'beta'};



            updateChart();

        });

};

// previewCsvUrl("./static/new_data/whiskey_random.csv");
previewCsvUrl("./new_data/stock_knn.csv");
