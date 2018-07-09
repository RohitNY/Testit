"use strict";
import {footerController} from "./controllers/footerController";
import {ehrFooterDirective} from "./directives/ehrFooterDirective";

const footerModule = angular.module("ehr.footer",[]);

footerModule.controller("footerController",["$scope",footerController]);
footerModule.directive("ehrFooter",[ehrFooterDirective]);

export {footerModule};