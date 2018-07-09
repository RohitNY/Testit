"use strict";

import "../controls/controls";
import "../multiButtonType4/multiButtonType4";
import "../multiButtonType2/multiButtonType2";

import { sectionController } from "./controllers/sectionController";
import { ehrSectionDirective } from "./directives/ehrSectionDirective";
import { ehrControlsDirective } from "../controls/directives/ehrControlsDirective";

const sectionModule = angular.module("ehr.section", ["ehr.controls", "ehr.mbt4", "ehr.mbt2"]);

sectionModule.controller("sectionController", ["$scope", sectionController]);
sectionModule.directive("ehrSection", [ehrSectionDirective]);

export { sectionModule };