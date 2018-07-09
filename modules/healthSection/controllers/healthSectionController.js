"use strict";

import { commonControllerBase } from "../../common/controllers/commonControllerBase";

const healthSectionController = function healthSectionController($scope, clientService, utilityService) {

    commonControllerBase.apply(this, arguments);

    this.init = function init() {
        $scope.groups = this.extractGroupsForTheSection("healthSection");
        // $scope.groups = [{
        //     Id: "FamilyHistory",
        //     Title: "Your Family History",
        //     Name: "Family History",
        //     Section: "healthSection",
        //     IsOpen: true
        // },
        // {
        //     Id: "health",
        //     Title: "Your Health",
        //     Name: "Your History",
        //     Section: "healthSection",
        //     IsOpen: true
        // },
        // {
        //     Id: "Medications",
        //     Title: "Medications",
        //     Name:"MedicationStatus",
        //     Section: "healthSection",
        //     IsOpen: true
        // },
        // /**subsection */
        // // {
        // //     Id: "LifeStyle",
        // //     Title: "Life Style",
        // //     IsOpen: true
        // // },
        // {
        //     Id: "GynecologicHistory",
        //     Title: "Gynecologic History",
        //     Name: "gynHistory",
        //     Section: "healthSection",
        //     IsOpen: true
        // }
        // /**subsection */
        // // {
        // //     Id: "SexualHistory",
        // //     Title: "Sexual History",
        // //     IsOpen: true
        // // },
        // ];

        this.getQuestionGroupswithQuestions();
    };

    this.init();
};

export { healthSectionController };