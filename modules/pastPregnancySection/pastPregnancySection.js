"use strict";

import "../panel/panel";
import "../client/client";
import "../common/common";
import { pastPregnancyService } from "./services/pastPregnancyService";
import { pastPregnancyController } from "./controllers/pastPregnancyController";
import { ehrPastPregnancyDirective } from "./directives/ehrPastPregnancyDirective";
import { outcomeController } from "./controllers/outcomeController";
import { ehrOutcomeDirective } from "./directives/ehrOutcomeDirective";

const pastPregnancyModule = angular.module("ehr.pastPregnancySection", ["ehr.panel", "ehr.client", "ehr.common"]);

pastPregnancyModule.service("pastPregnancyService", pastPregnancyService);
pastPregnancyModule.controller("outcomeController", ["$scope", "clientService", "utilityService", outcomeController]);
pastPregnancyModule.controller("pastPregnancyController", ["$scope", "clientService", "utilityService", "modalService","pastPregnancyService", pastPregnancyController]);
pastPregnancyModule.directive("ehrOutcome", [ehrOutcomeDirective]);
pastPregnancyModule.directive("ehrPastPregnancy", [ehrPastPregnancyDirective]);

export { pastPregnancyModule };