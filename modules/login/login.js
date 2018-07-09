"use strict";

import "angular-ui-router";
import "../common/common";
import "../client/client";

import { loginService } from "./services/loginService";
import { loginController } from "./controllers/loginController";
import { ehrLoginDirective } from "./directives/ehrLoginDirective";

const loginModule = angular.module("ehr.login", ["ui.router", "ehr.common", "ehr.client"]);

loginModule.service("loginService", ["$resource", loginService]);
loginModule.controller("loginController", ["$scope", "$state", "modalService", "clientService", "loginService", "userAuthenticationService", loginController]);
loginModule.directive("ehrLogin", [ehrLoginDirective]);
export { loginModule };