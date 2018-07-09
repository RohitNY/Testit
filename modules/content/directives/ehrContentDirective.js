"use strict";

function ehrContentDirective(){
    return {
        templateUrl:"modules/content/templates/content.html",
        scope:{},
        controller:"contentController",
        controllerAs:"ctrl"
    };
}

export {ehrContentDirective};