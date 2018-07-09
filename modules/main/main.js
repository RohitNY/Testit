"use strict";

import "angular-ui-router";
import "../common/common";
import "../header/header";
import "../content/content";
import "../footer/footer";

import {mainController} from "./controllers/mainController";
import { ehrMainDirective } from "./directives/ehrMainDirective";

const mainModule = angular.module("ehr.main", ["ui.router","ehr.common", "ehr.header", "ehr.content", "ehr.footer"]);

mainModule.controller("mainController", ["$state", "userAuthenticationService",mainController]);
mainModule.directive("ehrMain", [ehrMainDirective]);

export {mainModule};