"use strict";

function ehrBasicSectionDirective(){
    return {
        templateUrl : "modules/basicSection/templates/basicSection.html",
        scope : {
            'allQuestionGroups': "<"
        },
        controller : "basicSectionController",
        controllerAs : "ctrl"
    };
}

export {ehrBasicSectionDirective};