"use strict";

import "../panel/panel";
import "../client/client";
import "../common/common";

import { pregnancyController } from "./controllers/pregnancyController";
import { ehrPregnancyDirective } from "./directives/ehrPregnancyDirective";

const pregnancyModule = angular.module("ehr.pregnancySection", ["ehr.common", "ehr.panel", "ehr.client"]);

pregnancyModule.controller("pregnancyController", ["$scope", "clientService", "utilityService", pregnancyController]);
pregnancyModule.directive("ehrPregnancy", [ehrPregnancyDirective]);

export { pregnancyModule };