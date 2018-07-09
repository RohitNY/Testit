"use strict";

function ehrMBT4Directive() {
    return {
        templateUrl: "modules/multiButtonType4/templates/multiButtonType4.html",
        scope: {
            'ques': "<",
            'group': "<"
        }, 
        controller: "mbt4Controller", 
        controllerAs: "ctrl"
    };
};

export { ehrMBT4Directive };