"use strict";

function ehrSectionDirective() {
    return {
        templateUrl: "modules/section/templates/section.html",
        scope: {
            'group': "<",
            'prefix': "<"
        },
        controller: "sectionController",
        controllerAs: "ctrl",
        link: function (scope, element, attrs, ngModel) {

        }
    };
}

export { ehrSectionDirective };