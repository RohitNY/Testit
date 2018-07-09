"use strict";

function ehrPastPregnancyDirective(){
    return {
        templateUrl : "modules/pastPregnancySection/templates/pastPregnancySection.html",
        scope : {
            'allQuestionGroups': "<",
            'allGroups': "<"
        },
        controller : "pastPregnancyController",
        controllerAs : "ctrl"
    };    
};

export {ehrPastPregnancyDirective};