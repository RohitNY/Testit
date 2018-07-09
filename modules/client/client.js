"use strict";

import 'angular-resource';

import "../common/common";
import { clientService } from "./services/clientService";

const clientModule = angular.module("ehr.client", ["ngResource", "ehr.common"]);
clientModule.service("clientService", ["$resource", "userAuthenticationService","utilityService", clientService]);

export { clientModule };

