"use strict";

function ehrPanelDirective(){
    return{
        templateUrl : "modules/panel/templates/panel.html",
        scope : {
            'questionGroups' : "<"
        }
    };
}

export {ehrPanelDirective};