"use strict";

import "../client/client";
import "../controls/controls";
import "../common/common";

import { mbt4Controller } from "./controllers/mbt4Controller";
import { ehrMBT4Directive } from "./directives/ehrMBT4Directive";

const mutlButtonType4Module = angular.module("ehr.mbt4", ["ehr.common", "ehr.controls", "ehr.client"]);

mutlButtonType4Module.controller("mbt4Controller", ["$scope", "clientService", "utilityService", mbt4Controller]);
mutlButtonType4Module.directive("ehrMbt4", [ehrMBT4Directive]);

export { mutlButtonType4Module };