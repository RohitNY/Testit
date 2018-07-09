"use strict";

import "angular-resource";

import "../common/common";
import "../client/client";
import "../basicSection/basicSection";
import "../pregnancySection/pregnancySection";
import "../pastPregnancySection/pastPregnancySection";
import "../healthSection/healthSection";
import "../summarySection/summarySection";

import { contentService } from "./services/contentService";
import { contentController } from "./controllers/contentController";
import { ehrContentDirective } from "./directives/ehrContentDirective";

const contentModule = angular.module("ehr.content", ["ngResource", "ehr.common", "ehr.client", "ehr.basicSection",
    "ehr.pregnancySection", "ehr.pastPregnancySection", "ehr.healthSection", "ehr.summarySection"]);

contentModule.service("contentService", ["$resource", "clientService", contentService]);

contentModule.controller("contentController", ["$scope", "modalService", "contentService", contentController])

contentModule.directive("ehrContent", [ehrContentDirective]);

export { contentModule };