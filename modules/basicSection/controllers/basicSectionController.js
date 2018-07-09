"use strict";

import { commonControllerBase } from "../../common/controllers/commonControllerBase";

const basicSectionController = function basicSectionController($scope, clientService, utilityService) {
    commonControllerBase.apply(this, arguments);

    this.init = function init() {
        $scope.groups = this.extractGroupsForTheSection("basicSection");
        // $scope.groups = [{
        //     Id: "BasicInfo",
        //     Title: "Basic Information",
        //     Name: "Basic Information",
        //     Section: "basicSection",
        //     IsOpen: true
        // },
        // {
        //     Id: "FinancialInfo",
        //     Title: "Financial Information",
        //     Name: "Financial Information",
        //     Section: "basicSection",
        //     IsOpen: true
        // },
        // ];

        this.getQuestionGroupswithQuestions();
    };

    this.init();
};

export { basicSectionController };