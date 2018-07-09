"use strict";

function ehrOutcomeDirective() {
    return {
        templateUrl: "modules/pastPregnancySection/templates/outcome.html",
        scope: {
            'mainGroup': "<",
            'mainQues': "<",
            'selectedAnswerGroup': "<",
            'subGroupIndex': "<",
            'subQuestion': "<",
            'onCancel': "&",
            'onSave': "&"
        },
        controller: "outcomeController",
        controllerAs: "ctrl"
    };
};

export { ehrOutcomeDirective };