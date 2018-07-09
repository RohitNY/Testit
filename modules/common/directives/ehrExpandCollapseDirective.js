"use strict";

function ehrExpandCollapseDirective(){
    return {
        templateUrl : "modules/common/templates/expandCollapseButtons.html",
        scope : {
            'expandCollapseObj' : "<"
        },
        controller : "expandCollapseController",
        controllerAs : "ctrl"
    };
}

export {ehrExpandCollapseDirective};