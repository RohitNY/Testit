"use strict";

function ehrHealthSectionDirective(){
    return {
        templateUrl : "modules/healthSection/templates/healthSection.html",
        scope : {
            'allQuestionGroups': "<"
         },
        controller : "healthSectionController",
        controllerAs : "ctrl"
    };
}

export {ehrHealthSectionDirective};