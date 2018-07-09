"use strict";

import "angular-ui-bootstrap";

import "../panel/panel";
import "../client/client";
import "../common/common";

import { basicSectionController } from "./controllers/basicSectionController";
import { ehrBasicSectionDirective } from "./directives/ehrBasicSectionDirective";

const basicSectionModule = angular.module("ehr.basicSection", ["ui.bootstrap", "ehr.common", "ehr.panel", "ehr.client"]);

basicSectionModule.controller("basicSectionController", ["$scope", "clientService", "utilityService", basicSectionController]);
basicSectionModule.directive("ehrBasicSection", [ehrBasicSectionDirective]);

export { basicSectionModule };
