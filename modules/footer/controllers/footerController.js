"use strict";

const footerController = function footerController($scope){
    this.navigateTo = function navigateTo(page){
        let baseLink ="http://www.mobilemidwifeehr.com/"
        
        switch(page){
            case "Contacts": baseLink += "Tablet-Software-Electronic-Charting.aspx"; break;
            case "FAQ": baseLink += "Midwives-Tablet.aspx"; break;
            default: baseLink += "";
        }
        
        window.open(baseLink);
    };
}

export {footerController};