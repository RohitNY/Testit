"use strict";

function ehrLoginDirective() {
    return {
        templateUrl: "modules/login/templates/login.html",
        scope: {},
        controller: "loginController",
        controllerAs: "ctrl"
    };
}

export { ehrLoginDirective };