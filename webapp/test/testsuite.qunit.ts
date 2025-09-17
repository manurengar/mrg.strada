export default {
	name: "Unit test suite for the UI5 Application: mrg.strada",
	defaults: {
		page: "ui5://test-resources/mrg/strada/Test.qunit.html?testsuite={suite}&test={name}",
		qunit: {
			version: 2
		},
		ui5: {
			theme: "sap_horizon"
		},
		loader: {
			paths: {
				"mrg/strada": "../"
			}
		}
	},
	tests: {
		"unit/unitTests": {
			title: "Unit tests for the UI5 Application: mrg.strada"
		},
		"integration/opaTests": {
			title: "Integration tests for the UI5 Application: mrg.strada"
		}
	}
};
