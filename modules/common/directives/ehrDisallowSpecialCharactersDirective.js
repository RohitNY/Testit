"use strict";

/**
 * Restrict space in textbox
 */
function ehrDisallowSpecialCharactersDirective() {

    return {
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl) {

            modelCtrl.$parsers.push(function(inputValue) {
                const regex = new RegExp(`[${attrs.nvDisallowSpecialCharacters}]`,"g");
                const transformedInput = inputValue.replace(regex, "");
                if (transformedInput !== inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }

                return transformedInput;
            });
        }
    };
}

export {ehrDisallowSpecialCharactersDirective};