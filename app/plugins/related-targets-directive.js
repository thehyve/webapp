angular.module('plugins')
    .directive('relatedTargets', ['otAPIservice', function (otAPIservice) {
        'use strict';

        return {
            restrict: 'E',
            templateUrl: 'plugins/related-targets.html',
            scope: {
                target: '='
            },
            link: function (scope, element, attrs) {
                otAPIservice.getTargetRelation({
                    id: scope.target.id
                })
                    .then(
                    // success
                        function (resp) {
                            scope.relations = resp.body.data.slice(1, 20);
                        },

                        // error handler
                        otAPIservice.defaultErrorHandler
                    );
            }
        };
    }]);
