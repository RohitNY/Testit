"use strict";


function ehrSummaryDirectve() {
    return {
        templateUrl: "modules/summarySection/templates/summary.html",
        scope: {
            'allQuestionGroups': "<"
        },
        controller: "summaryController",
        controllerAs: "ctrl"
    };
};

export { ehrSummaryDirectve };

