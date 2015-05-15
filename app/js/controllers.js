    'use strict';

    /* Controllers */

    angular.module('cttvControllers', []).

    /**
     * High level controller for the app
     */
    controller('CttvAppCtrl', ['$scope',  function ($scope) {

    }])



    /**
     * DiseaseCtrl
     * Controller for the disease page
     * It loads general information about a given disease
     */
     .controller ('DiseaseCtrl', ["$scope", "$location", "$log", "cttvAPIservice", function ($scope, $location, $log, cttvAPIservice) {
         $log.log("DiseaseCtrl()");
         // var cttvRestApi = cttvApi();
         var efo_code = $location.url().split("/")[2];
         cttvAPIservice.getDisease({
             'efo': efo_code
         })
         .then (function (resp) {
             console.log(resp.body);
             var data = resp.body;

             var paths = [];
             for (var i=0; i<data.path.length; i++) {
                 data.path[i].shift();
                 var path=[];
                 for(var j=0; j<data.path[i].length; j++){
                     path.push({
                         "label" : data.path[i][j].label,
                         "efo" : data.path[i][j].uri.split("/").pop()
                     });
                 }
                 paths.push(path);
             }

             if (data.efo_synonyms.length === 0) {
                 data.efo_synonyms.push(resp.label);
             }
             $scope.disease = {
                 "label" : data.label,
                 "efo" : efo_code,
                 "description" : data.definition || resp.label,
                 "synonyms" : _.uniq(data.efo_synonyms),
                 "paths" : paths,
                 "children" : data.children
             };

             // Update bindings
             //$scope.$apply();
         })
     }])

    /**
     * SearchAppCtrl
     * Controller for the search/results page
     */
    .controller('SearchAppCtrl', ['$scope', '$location', '$log', 'cttvAppToAPIService', 'cttvAPIservice', function ($scope, $location, $log, cttvAppToAPIService, cttvAPIservice) {

        $log.log('SearchCtrl()');


        $scope.search = cttvAppToAPIService.createSearchInitObject();
        $scope.filters = {
            gene : {
                total : 0,
                selected: false,
                loading: false
            },
            efo : {
                total : 0,
                selected : false,
                loading: false
            }
        }

        /**
        Something like:
            {
                query:{
                    q: APP_QUERY_Q, // ""
                    page: APP_QUERY_PAGE,   // 1
                    size: APP_QUERY_SIZE    // 10
                },

                results:{}
            }
        */

        var getFiltersData = function(){

            $scope.filters.gene.loading = true;
            cttvAPIservice.getSearch({
                    q: $scope.search.query.q,
                    size : 1,
                    filter : 'gene'
                }).
                then(
                    function(resp) {
                        $scope.filters.gene.total = resp.body.total;
                    },
                    cttvAPIservice.defaultErrorHandler
                ).
                finally(function(){
                    $scope.filters.gene.loading = false;
                });

            $scope.filters.efo.loading = true;
            cttvAPIservice.getSearch({
                    q: $scope.search.query.q,
                    size : 1,
                    filter : 'efo'
                }).
                then(
                    function(resp) {
                        $scope.filters.efo.total = resp.body.total;
                    },
                    cttvAPIservice.defaultErrorHandler
                ).
                finally(function(){
                    $scope.filters.efo.loading = false;
                });

        }



        $scope.getResults = function(){

            /*
            if( !$scope.filters.gene.selected && !$scope.filters.efo.selected ){
                // show no result if no filter is selected
                $log.warn("no filter selcted");
                $scope.search.results = null;
                return;
            }
            */

            // before getting new results,
            // we make sure we clear any current results (like in the case
            // of applying a filter), which also causes the spinner to show...
            $scope.search.loading = true;


            var queryobject = cttvAppToAPIService.getApiQueryObject(cttvAppToAPIService.SEARCH, $scope.search.query);
            // if one and only one of the filters is selected, apply the corresponding filter
            // cool way of mimicking a XOR operator ;)
            if( $scope.filters.gene.selected != $scope.filters.efo.selected ){
                queryobject.filter = $scope.filters.gene.selected ? 'gene' : 'efo';
            }

            cttvAPIservice.getSearch( queryobject )
                .then(
                    function(resp) {
                        $scope.search.results = resp.body;
                    },
                    cttvAPIservice.defaultErrorHandler
                )
                .finally(function(){
                    $scope.search.loading = false;
                });

        }


        if($location.search().q){
            // parse parameters
            $scope.search.query.q = $location.search().q || "";

            // need a way of parsing filters too...

            // and fire the search
            $scope.getResults();
            getFiltersData();
        }


    }]).



    controller('SearchResultsCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {

    }]).


    controller('MastheadCtrl', ['$scope', '$location', '$log', function ($scope, $location, $log) {

        $log.log('MastheadCtrl()');
        $scope.location = $location;

    }]).

    controller('D3TestCtrl', ['$scope', '$log', function ($scope, $log) {
        $log.log("D3TestCtrl");
    }])
