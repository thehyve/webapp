angular.module('otPlugins')
    .directive('otSafety', ['otUtils', '$timeout', 'otClearUnderscoresFilter', 'otUpperCaseFirstFilter', function (otUtils, $timeout, otClearUnderscoresFilter, otUpperCaseFirstFilter) {
        'use strict';

        return {
            restrict: 'E',
            templateUrl: '/plugins/safety/safety.html',
            scope: {
                target: '='
            },
            link: function (scope, elem, attrs) {
                /*
                 * Parse an array of 'effects' (e.g. agonism_activation_effects) into an html list.
                 * Specify the base url for links and whether the link is external.
                 */
                function parseArrayToList (arr, url, ext) {
                    var ul = '<ul>';
                    ul += arr.map(function (item) {
                        var content = otUpperCaseFirstFilter(item.term_in_paper);
                        // if (item.code && url) {
                        //     content = '<a href="' + url + item.code + '" ' + (ext ? 'target="_blank" ' : '') + '>' + content + '</a>';
                        // }
                        return '<li>'
                                + content + '<span style="display:none">, </span>'
                                + '</li>';
                    }).join('');
                    ul += '</ul>';
                    return ul;
                }


                /*
                 * Takes an object like antagonism_inhibition_effects or agonism_activation_effects
                 * and returns the html to insert in the table cell.
                 */
                function parseEffectsDataToHtml (data) {
                    var effects = '';
                    if (Object.keys(data).length === 0) {
                        effects = 'No data available for this publication';
                    } else {
                        for (var i in data) {
                            effects += '<h6>' + otUpperCaseFirstFilter(otClearUnderscoresFilter(i)) + '<span style="display:none">: </span></h6>';
                            effects += parseArrayToList(data[i], '/disease/');
                        }
                    }
                    return effects;
                }


                function formatDataToArray (data) {
                    var rows = data.map(function (mark) {
                        var row = [];

                        // organs_systems_affected
                        row.push(parseArrayToList(mark.organs_systems_affected, 'http://purl.obolibrary.org/obo/', true));

                        // agonism_activation_effects
                        row.push(parseEffectsDataToHtml(mark.activation_effects));

                        // antagonism_inhibition_effects
                        row.push(parseEffectsDataToHtml(mark.inhibition_effects));

                        // reference
                        row.push(
                            mark.references.map(function (ref) {
                                if (ref.pmid) {
                                    // return ref.pmid;
                                    return '<a href="https://europepmc.org/abstract/MED/' + ref.pmid + '" target="_blank">' + ref.ref_label + '</a>';
                                } else {
                                    // return ref.ref_link;
                                    return '<a href="' + ref.ref_link + '" target="_blank">' + ref.ref_label + '</a>';
                                }
                            })
                        );

                        return row;
                    });
                    return rows;
                }


                function initTable () {
                    var table = elem[0].getElementsByTagName('table');
                    $(table).DataTable(otUtils.setTableToolsParams({
                        'data': formatDataToArray(scope.target.safety.adverse_effects),
                        'ordering': true,
                        'autoWidth': false,
                        'paging': true,
                        'columnDefs': [
                            {
                                'targets': [0, 1, 2],
                                'width': '28%'
                            },
                            {
                                'targets': [3],
                                'width': '16%'
                            }
                        ]
                    }, scope.target.approved_symbol + '-safety'));
                }

                if (scope.target.safety) {
                    // initialize table in timeout
                    if (scope.target.safety.adverse_effects) {
                        $timeout(function () {
                            initTable();
                        }, 0);
                    }
                }
            }
        };
    }]);
