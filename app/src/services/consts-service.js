/* Services */

angular.module('otServices')


    /**
     * The API services, with methods to call the ElasticSearch API
     */
    .factory('otConsts', [function () {
        'use strict';
        var consts = {
            datatypes: {
                GENETIC_ASSOCIATION: 'genetic_association',
                SOMATIC_MUTATION: 'somatic_mutation',
                KNOWN_DRUG: 'known_drug',
                RNA_EXPRESSION: 'rna_expression',
                AFFECTED_PATHWAY: 'affected_pathway',
                ANIMAL_MODEL: 'animal_model',
                LITERATURE: 'literature'
            },
            dbs: {
                EXPRESSION_ATLAS: 'expression_atlas',
                UNIPROT: 'uniprot',
                UNIPROT_LITERATURE: 'uniprot_literature',
                REACTOME: 'reactome',
                EVA: 'eva',
                PHENODIGM: 'phenodigm',
                GWAS: 'gwas_catalog',
                PHEWAS: 'phewascatalog',
                PHEWAS_23andme: '23andme',
                GENOMICS_ENGLAND: 'genomics_england',
                CANCER_GENE_CENSUS: 'cancer_gene_census',
                CHEMBL: 'chembl',
                DISGENET: 'disgenet',
                EPMC: 'europepmc',
                EVA_SOMATIC: 'eva_somatic',
                INTOGEN: 'intogen',
                GENE_2_PHENOTYPE: 'gene2phenotype'
            },
            dbs_info_url: {
                EXPRESSION_ATLAS: '/data-sources#atlas',
                UNIPROT: '/data-sources#uniprot',
                UNIPROT_LITERATURE: '/data-sources#uniprot_lit',
                REACTOME: '/data-sources#reactome',
                EVA: '/data-sources#eva',
                PHENODIGM: '/data-sources#mouse',
                GWAS: '/data-sources#gwas',
                PHEWAS: '/data-sources#phewas',
                PHEWAS_23andme: '/data-sources#phewas_23andme',
                GENOMICS_ENGLAND: '/data-sources#genomics_england',
                CANCER_GENE_CENSUS: '/data-sources#census',
                CHEMBL: '/data-sources#chembl',
                DISGENET: '/data-sources',  // no longer used
                EPMC: '/data-sources#text_mining',
                EVA_SOMATIC: '/data-sources#eva',
                INTOGEN: '/data-sources#intogen',
                GENE_2_PHENOTYPE: '/data-sources#gene2phenotype'
            },
            datatypesOrder: [
                'GENETIC_ASSOCIATION', 'SOMATIC_MUTATION', 'KNOWN_DRUG', 'AFFECTED_PATHWAY', 'RNA_EXPRESSION', 'LITERATURE', 'ANIMAL_MODEL'
            ],
            datatypesLabels: {
                GENETIC_ASSOCIATION: 'Genetics',
                SOMATIC_MUTATION: 'Somatic',
                KNOWN_DRUG: 'Drugs',
                RNA_EXPRESSION: 'RNA',
                AFFECTED_PATHWAY: 'Pathways',
                ANIMAL_MODEL: 'Mouse',
                LITERATURE: 'Text Mining'
            },
            DATATYPES: 'datatype',
            PATHWAY: 'pathway',
            DATASOURCES: 'datasources',
            THERAPEUTIC_AREAS: 'therapeutic_area',
            TARGET: 'target',
            TARGET_CLASS: 'target_class',
            UNIQUE_TARGET_COUNT: 'unique_target_count',
            UNIQUE_DISEASE_COUNT: 'unique_disease_count',
            DATA_DISTRIBUTION: 'data_distribution',
            SCORE_MIN: 'score_min',
            SCORE_MAX: 'score_max',
            SCORE_STR: 'score_str',
            defaults: {
                STRINGENCY: 1,
                SCORE_MIN: 0.0,
                SCORE_MAX: 1.0
            },
            OK: 'ok',
            ACCESS_LEVEL_PUBLIC: 'public',
            ACCESS_LEVEL_PRIVATE: 'private',
            CTTV_ROOT_URI: 'http://www.targetvalidation.org/cttv_root',
            CTTV_ROOT_NAME: 'CTTV Root',
            CTTV_ROOT_CODE: 'cttv_root' // TODO: CTTV_ROOT_URI and CTTV_ROOT_CODE appear unused?
        };


        consts.invert = function (val) {
            var a = invLookup(consts, val);
            return a;
        };

        function invLookup (o, v) {
            var k;
            for (var i in o) {
                if (o.hasOwnProperty(i)) {
                    if (o[i] === v) {
                        k = i;
                        return k;
                    }
                    if (typeof o[i] === 'object') {
                        k = invLookup(o[i], v);
                        if (k) { return k; }
                    }
                }
            }
            return k;
        }


        return consts;
    }]);