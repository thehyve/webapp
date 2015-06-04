'use strict';


/* Services */

angular.module('cttvServices').



    /**
     * The API services, with methods to call the ElasticSearch API
     */
    factory('cttvConsts', ['$log', function($log) {

        var consts = {
            datatypes : {
                GENETIC_ASSOCIATION : "genetic_association",
                SOMATIC_MUTATION :    "somatic_mutation",
                KNOWN_DRUG :          "known_drug",
                RNA_EXPRESSION :      "rna_expression",
                AFFECTED_PATHWAY :    "affected_pathway",
                ANIMAL_MODEL :        "animal_model",
            },
            DATATYPES: 'datatypes'
        };


        return consts;
    }]);