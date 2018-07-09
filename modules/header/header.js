"use strict";

import "angular-ui-router";
import "../common/common";
import { ehrHeaderDirective } from "./directives/ehrHeaderDirective";
import { headerController } from "./controllers/headerController";

const headerModule = angular.module("ehr.header", ["ui.router", "ehr.common"]);

headerModule.controller("headerController", ["$scope", "$state", "modalService", "userAuthenticationService", "clientService", headerController]);
headerModule.directive("ehrHeader", [ehrHeaderDirective]);

export { headerModule };