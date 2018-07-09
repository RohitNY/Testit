"use strict";

function ehrMBT2Directive() {
    return {
        templateUrl: "modules/multiButtonType2/templates/multiButtonType2.html",
        scope: {
            'ques': "<",
            'subQues':"<",
            'group': "<"
        },
        controller: "mbt2Controller",
        controllerAs: "ctrl"
    };
};

export { ehrMBT2Directive };