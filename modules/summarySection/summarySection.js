"use strict";

import "../common/common";
import "../client/client";
import "../pastPregnancySection/pastPregnancySection";
import { summaryController } from "./controllers/summaryController";
import { ehrSummaryDirectve } from "./directives/ehrSummaryDirective";

const summaryModule = angular.module("ehr.summarySection", ["ehr.common", "ehr.client", "ehr.pastPregnancySection"]);

summaryModule.controller("summaryController", ["$scope", "clientService", "utilityService", "userAuthenticationService", summaryController]);
summaryModule.directive("ehrSummary", [ehrSummaryDirectve]);

export { summaryModule };