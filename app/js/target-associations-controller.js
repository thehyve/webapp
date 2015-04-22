'use strict';

/* Add to the cttv controllers module */
angular.module('cttvControllers')

/**
 * AssociationsCtrl
 * Controller for the target associations page
 * It loads a list of associations for the given search
 */
    .controller('targetAssociationsCtrl', ['$scope', '$location', '$log', 'cttvUtils', function ($scope, $location, $log, cttvUtils) {
	$log.log('targetAssociationsCtrl()');
	var q = $location.path().split('/')[2];
	$scope.search = {
	    query : q
	};

	// given a target id, get the name
	var api = cttvApi();
	var url = api.url.gene({'gene_id': q});
	$log.log(url);
	api.call(url)
	    .then(function (resp) {
		$scope.search.label = resp.body.approved_symbol;
	    });
	
	$scope.nresults = 0;

	// datatypes filter
	$scope.dataTypes = [
	    {
		name: "genetic_association",
		label: "Genetics",
		labelFull: "Genetic associations",
		selected: true
	    },
	    {
		name: "somatic_mutation",
		label: "Somatic",
		labelFull: "Somatic mutations",
		selected: true
	    },
	    {
		name: "known_drug",
		label: "Drugs",
		labelFull: "Known drugs",
		selected: true
	    },
	    {
		name: "rna_expression",
		label: "RNA",
		labelFull: "RNA expression",
		selected: true
	    },
	    {      
		name: "affected_pathway",
		label: "Pathways",
		labelFull: "Affected pathways",
		selected: true
	    },
	    {
		name: "animal_model",
		label: "Models",
		labelFull: "Mouse models",
		bob: "true",
		selected: true
	    }
	]

	var currentDataTypes = {};
	for (var i=0; i<$scope.dataTypes.length; i++) {
	    if ($scope.dataTypes[i].selected) {
		var name = $scope.dataTypes[i].name;
		var label = $scope.dataTypes[i].label;
		currentDataTypes[name] = label;
	    }
	}
	$scope.currentDataTypes = currentDataTypes;

	$scope.toggleDataTypes = function () {
	    $scope.toggleNavigation();
	}
	
	$scope.filterDataType = function (dataType) {
	    var currentDataTypes = {};
	    for (var i=0; i<$scope.dataTypes.length; i++) {
		if ($scope.dataTypes[i].name === dataType.name) {
		    $scope.dataTypes[i].selected = $scope.dataTypes[i].selected === false ? true : false;
		}
		if ($scope.dataTypes[i].selected) {
		    var name = $scope.dataTypes[i].name
		    var label = $scope.dataTypes[i].label;
		    currentDataTypes[name] = label;
		}
	    }
	    $scope.currentDataTypes=currentDataTypes;
	}

	$scope.setTherapeuticAreas = function (tas) {
	    $scope.therapeuticAreas = tas;

	    // This method is executed with every data change, but we only need it once, so we return if the data has already loaded
	    if ($scope.dataTypes[0].diseases) {
		return;
	    }
	    var diseasesInDatatypes = {};
	    var nonRedundantDiseases = {};
	    for (var i=0; i<tas.length; i++) {
		var ta = tas[i];
		for (var j=0; j<ta.children.length; j++) {
		    nonRedundantDiseases[ta.children[j].efo_code] = 1;
		    var dts = ta.children[j].datatypes;
		    for (var k=0; k<dts.length; k++) {
			if (diseasesInDatatypes[dts[k].datatype] === undefined) {
			    diseasesInDatatypes[dts[k].datatype] = 0;
			}
			diseasesInDatatypes[dts[k].datatype]++;
		    }
		}
	    }

	    $scope.ndiseases = _.keys(nonRedundantDiseases).length;

	    for (var n=0; n<$scope.dataTypes.length; n++) {
		$scope.dataTypes[n].diseases = diseasesInDatatypes[$scope.dataTypes[n].name] || 0;
	    }
	};
	
	// Therapeutic Areas Nav
	$scope.focusEFO = "cttv_source";

	$scope.tagroup = {};
	$scope.tagroup.tas = {};
	$scope.tagroup.filled = false;
	$scope.tagroup.open = true;
	
	var currentFocus = "cttv_disease";

	$scope.selectTherapeuticArea = function (efo) {
	    // Keep track of the state
	    if (!$scope.tagroup.filled) {
	    $scope.tagroup.filled = true;
		for (var i=0; i<$scope.therapeuticAreas.length; i++) {
		    var therapeuticArea = $scope.therapeuticAreas[i];
		    $scope.tagroup.tas[therapeuticArea.name] = false;
		}
	    }
	    if (efo === currentFocus) {
	    	currentFocus = "cttv_disease";
	    } else {
	    	currentFocus = efo;
	    }
	    $scope.focusEFO = currentFocus;
	};

	$scope.toggleNavigation = function () {
	    for (var ta in $scope.tagroup.tas) {
		$scope.tagroup.tas[ta] = false;
	    }
	    $scope.focusEFO = "cttv_disease";
	    currentFocus = "cttv_disease";
	    console.log("TOGGLE NAV");
	    $scope.diseasegroupOpen = false;
	};
	
	$scope.selectedDisease = 0;
	$scope.selectDisease = function (d) {
	    $scope.highlightEFO = {efo: d.efo_code,
				   parent_efo: d._parent.efo_code,
				   datatypes: d.datatypes
				  };
	    $scope.selectedDisease++;
	    // if ($scope.selectedDisease === true) {
	    // 	$scope.selectedDisease = false;
	    // } else {
	    // 	$scope.selectedDisease = true;
	    // }
	};
	
	// Display toggle (vis / table)
	// TODO: We shouldn't change html events in the controller. This should go in the directive!
	//$scope.displaytype = "bubbles";

	$scope.visibility = {};
	$scope.setDisplay = function (displ) {
	    console.log("DISPLAY CHANGED TO " + displ);
	    //$scope.displaytype = displ;
	    switch (displ) {
	    case "bubbles" :
		// $scope.visibility.bubbles = "block";
		// $scope.visibility.table = "none";
		// $scope.visibility.tree = "none";

		$("cttv-target-associations-bubbles").css("display", "block");
		$("cttv-target-associations-table").css("display", "none");
		$("cttv-target-associations-tree").css("display", "none");
		$(".cttv-nav").css("display", "block");
		break;
	    case "table" :
		// $scope.visibility.bubbles = "none";
		// $scope.visibility.table = "block";
		// $scope.visibility.bubbles = "none";

		$("cttv-target-associations-bubbles").css("display", "none");
		$("cttv-target-associations-table").css("display","block");
		$("cttv-target-associations-tree").css("display", "none");
		$(".cttv-nav").css("display", "none");
		break;
	    case "tree" :
		// $scope.visibility.bubbles = "none";
		// $scope.visibility.table = "none";
		// $scope.visibility.tree = "block";

		$("cttv-target-associations-bubbles").css("display", "none");
		$("cttv-target-associations-table").css("display","none");
		$("cttv-target-associations-tree").css("display", "block");
		$(".cttv-nav").css("display", "none");
	    	break;
	    }
	    
	}

    }])