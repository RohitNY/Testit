"use strict";

import { commonControllerBase } from "../../common/controllers/commonControllerBase";

const pregnancyController = function pregnancyController($scope, clientService) {

    commonControllerBase.apply(this, arguments);

    this.init = function init() {
        $scope.groups = this.extractGroupsForTheSection("pregnancySection");
        // $scope.groups = [{
        //     Id: "CurrentPregnancy",
        //     Title: "Current Pregnancy",
        //     Name: "currentPregnancy",
        //     Section:"pregnancySection",
        //     IsOpen: true
        // },
        // {
        //     Id: "MotherHistory",
        //     Title: "Your Mother's History",
        //     Name: "Your Mother's History",
        //     Section:"pregnancySection",
        //     IsOpen: true
        // },
        // {
        //     Id: "FatherOfBaby",
        //     Title: "Father of Baby",
        //     Name: "Father of Baby",
        //     Section:"pregnancySection",
        //     IsOpen: true
        // },
        // {
        //     Id: "FatherHistory",
        //     Title: "Father's History",
        //     Name: "Father's History",
        //     Section:"pregnancySection",
        //     IsOpen: true
        // },
        // {
        //     Id: "GeneticHistory",
        //     Title: "Genetic History",
        //     Name: "Genetic History",
        //     Section:"pregnancySection",
        //     IsOpen: true,
        //     defaultWidth: 6
        // }
        // ];

        this.getQuestionGroupswithQuestions();

    };

    this.init();
};

export { pregnancyController };

