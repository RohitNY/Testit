"use strict";

import 'angular-ui-bootstrap';
import "../controls/controls";
import "../section/section";
import "../common/common";

import { ehrPanelDirective } from "./directives/ehrPanelDirective";

const panelModule = angular.module('ehr.panel', ['ui.bootstrap', 'ehr.common', 'ehr.controls', 'ehr.section']);

panelModule.directive('ehrPanel', [ehrPanelDirective]);

export { panelModule };