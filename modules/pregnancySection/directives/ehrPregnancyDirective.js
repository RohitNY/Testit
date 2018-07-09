"use strict";

function ehrPregnancyDirective(){
    return{
        templateUrl : "modules/pregnancySection/templates/pregnancySection.html",
        scope : {
            'allQuestionGroups': "<"
        },
        controller : "pregnancyController",
        controllerAs : "ctrl"
    };
}

export {ehrPregnancyDirective};