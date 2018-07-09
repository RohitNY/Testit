"use strict";

function ehrMainDirective() {
    return {
        templateUrl: "./modules/main/templates/main.html",
        scope: {},
        controller: "mainController",
        controllerAs: "ctrl"
    };
};

export { ehrMainDirective };