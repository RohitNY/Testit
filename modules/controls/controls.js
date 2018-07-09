"use strict";
import "../common/common";
import "../client/client";
import "font-awesome";

import { controlsController } from "./controllers/controlsController";
import { ehrControlsDirective } from "./directives/ehrControlsDirective";

const controlsModule = angular.module("ehr.controls", ["ehr.common", "ehr.client"]);

controlsModule.controller('controlsController', ["$scope", "clientService", "utilityService", controlsController]);
controlsModule.directive('ehrControls', [ehrControlsDirective]);

export { controlsModule };