"use strict";

function ehrHeaderDirective() {
    return {
        templateUrl: "modules/header/templates/header.html",
        scope: {

        },
        controller: "headerController",
        controllerAs: "ctrl"
    };
}

export { ehrHeaderDirective };