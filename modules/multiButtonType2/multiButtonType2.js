"use strict";

import "../client/client";
import "../controls/controls";
import "../common/common";

import { mbt2Controller } from "./controllers/mbt2Controller";
import { ehrMBT2Directive } from "./directives/ehrMBT2Directive";

const mbt2Module = angular.module("ehr.mbt2", ["ehr.common", "ehr.controls", "ehr.client"]);
mbt2Module.controller("mbt2Controller", ["$scope", "clientService", "utilityService", mbt2Controller])
mbt2Module.directive("ehrMbt2", [ehrMBT2Directive]);

export { mbt2Module };
