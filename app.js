var app = angular.module('app', ['ngTouch', 'ui.grid', 'ui.grid.edit','chart.js']);

app.controller('OneDimensionCtrl', ['$scope','$http','$filter', 'uiGridConstants', function ($scope,$http,$filter, uiGridConstants) {

    $scope.series1 = ['Series A'];

    $scope.filterOptions = {
            filterText: ''
        };

    //Intializing the Grid.
    $scope.gridOptions = {
        enableSorting: true,
         enableFiltering: true,
           
        columnDefs: [
          { name:'alteration',enableFiltering: false},
          {name: 'Hugo Symbol',enableFiltering: false,cellTemplate:"<div>{{row.entity.gene.hugoSymbol}}</div>"},
          {name: 'Entrez Gene Id',field:"gene.entrezGeneId"},
          {name: 'OncoGene and or TSG',field:"gene.oncogene",enableFiltering: false}
        ]  
    };
    
    //Register UI-Grid API
    $scope.gridOptions.onRegisterApi = function(gridApi){
            $scope.gridApi = gridApi;
    }; 
    
    // Apply filter & populate bar chart.
    $scope.refreshData = function() { 
          $scope.gridApi.grid.columns[2].filters[0].term=$scope.searchText;
          debugger;
          if ($scope.searchText!=undefined) {
             $scope.filteredData = $scope.OriginalData.filter(function(d) {
             return d.gene.entrezGeneId.toString().substr(0, $scope.searchText.length).toUpperCase() ==  $scope.searchText.toUpperCase()
            });
          }
          else{
             $scope.filteredData=$scope.OriginalData;
          }
          
          var Keys=[]; 
          var Values=[]; 
          var a= _.countBy($scope.filteredData, function(data) { return data.consequence.term; });
            
          for (var property in a) {
              if (a.hasOwnProperty(property)) {
                  Keys.push(property);
                  Values.push(a[property]);
              }
          }
          $scope.labels1 = Keys;
          $scope.data1 =Values;
    };
    
    // Getting data from API
    $scope.LoadData=function() {
         $http.get('http://oncokb.org/api/v1/genes/673/variants')
         .success(function (data) { 
           
            $scope.OriginalData = data.data.filter(function(d) {
             return d.gene.tsg==true || d.gene.oncogene==true
            });
           
            $scope.gridOptions.data = $scope.OriginalData;
            $scope.refreshData();
        });
    }
   
    
    $scope.LoadData();
      
}]);
