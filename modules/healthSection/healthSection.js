"use strict";

import 'angular-ui-bootstrap';

import "../panel/panel";
import "../client/client";
import "../common/common";

import { healthSectionController } from "./controllers/healthSectionController";
import { ehrHealthSectionDirective } from "./directives/ehrHealthSectionDirective";

const healthSectionModule = angular.module("ehr.healthSection", ["ui.bootstrap", "ehr.common", "ehr.panel", "ehr.client"]);

healthSectionModule.controller("healthSectionController", ["$scope", "clientService", "utilityService", healthSectionController]);
healthSectionModule.directive("ehrHealth", [ehrHealthSectionDirective]);

export { healthSectionModule };
