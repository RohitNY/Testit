"use strict";

function ehrControlsDirective() {
    return {
        templateUrl: "modules/controls/templates/controls.html",
        scope: {
            'group': "<",
            'ques': "<",
            'prefix': "<"
            
        },
        controller: "controlsController",
        controllerAs: "ctrl",
        link: function (scope, element, attrs, ngModel) {
            attrs.$observe("id", () => {
                $('[data-toggle="popover"]').popover();
            });
        }
    };
}

export { ehrControlsDirective };