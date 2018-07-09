"use strict";

import "tether";
import "tooltip.js";
import "angular";
import "bootstrap";
import "angular-ui-bootstrap";
import "angular-ui-router";
import "./modules/login/login";
import "./modules/main/main";

const ehrApp = angular.module("ehrApp", ["ui.bootstrap", "ui.router", 
"ehr.login","ehr.main"]);

ehrApp.config(function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
      // Allow same origin resource loads.
      "self",
      // Allow loading from our assets domain.  Notice the difference between * and **.
      "https://www.mobilemidwifeehr.com/MidwifeService.svc/**",
      "https://www.mobilemidwifeehr.com/MidwifeService.svc/jsons/ReceiveTransactions4"
    ]);
});


ehrApp.config(($stateProvider, $urlRouterProvider) => {
  const loginState = {
    name: "login",
    url: "/login?guid&uniqueid",
    template:"<ehr-login></ehr-login>"
   // templateUrl: "./modules/login/templates/login.html"
  };

  const mainState = {
    name: "main",
    url: "/main",
    template: "<ehr-main></ehr-main>"
  };

  $stateProvider.state("login", loginState);
  $stateProvider.state("main", mainState);
  $urlRouterProvider.otherwise("login");
});

// ehrApp.config(['$qProvider', function ($qProvider) {
//   $qProvider.errorOnUnhandledRejections(false);
// }]);

angular.element(document)
  .ready(() => angular.bootstrap(document, [ehrApp.name])
  );