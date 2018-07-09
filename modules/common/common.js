"use strict";

import "jquery";
import "tether";
import "tooltip.js";
import "bootstrap";

import "angular";
import "tether";
import "angular-ui-validate";
import "angular-bootstrap";
import "angular-resource";
import "moment";
import "font-awesome";
import "mdbootstrap";
import "angular-material";
import "generate-password";

import { commonService } from "./services/commonService";
import { modalService } from "./services/modalService";
import { userAuthenticationService } from "./services/userAuthenticationService";
import { utilityService } from "./services/utilityService";
import { expandCollapseController } from "./controllers/expandCollapseController";
import { ehrLoaderDirective } from "./directives/ehrLoaderDirective";
import { ehrDatePickerDirective } from "./directives/ehrDatePickerDirective";
import { ehrDisallowSpecialCharactersDirective } from "./directives/ehrDisallowSpecialCharactersDirective";
import { ehrExpandCollapseDirective } from "./directives/ehrExpandCollapseDirective";


const commonModule = angular.module("ehr.common", ["ng", "ngMaterial", "ui.bootstrap", "ui.validate"]);

commonModule.service("commonService", [commonService]);
commonModule.service("modalService", ["$rootScope", "$uibModal", modalService]);
commonModule.service("userAuthenticationService", [userAuthenticationService]);
commonModule.service("utilityService", [utilityService]);
commonModule.controller("expandCollapseController", ["$scope", expandCollapseController]);
commonModule.directive("ehrLoader", [ehrLoaderDirective]);
commonModule.directive("ehrDatePicker", [ehrDatePickerDirective]);
commonModule.directive("ehrDisallowSpecialCharacters", [ehrDisallowSpecialCharactersDirective]);
commonModule.directive("ehrExpandCollapse", [ehrExpandCollapseDirective]);

export { commonModule };