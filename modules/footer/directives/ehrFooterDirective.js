"use strict";

function ehrFooterDirective(){
    return{
        templateUrl:"modules/footer/templates/footer.html",
        scope:{},
        controller:"footerController",
        controllerAs:"ctrl"
    };
}

export {ehrFooterDirective};