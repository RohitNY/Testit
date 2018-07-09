"use strict";

import { commonControllerBase } from "../../common/controllers/commonControllerBase";

const mbt2Controller = function mbt2Controller($scope, clientService, utilityService) {
   
    commonControllerBase.apply(this, arguments);
    
    this.init = function init() {
        if(!$scope.ques || !$scope.ques.childAnswerGroup) return;
        $scope.subQuestionGroup = clientService.getQuestionGroupByName($scope.ques.childAnswerGroup);
        $scope.subQuestionGroup.questions = this.extractGroupQuestions($scope.subQuestionGroup, true);
        $scope.shouldDisplay = false;
        $scope.buttonText = $scope.ques.comboOptions;
     };

     this.toggleDisplayGroups =function toggleDisplayGroups(){
         $scope.shouldDisplay = !$scope.shouldDisplay;
         if(!$scope.groups) this.addNewRow(true);
     }
    
     this.addNewRow = function addNewRow(pushToAllGroups) {
        $scope.groups = $scope.groups || [];
        const group = angular.copy($scope.subQuestionGroup);
        group.questions.forEach(question => {
            question.Id = `${question.Id}`;
            question.width = question.isLabel ? 2 : 3;
            question.hideIcon ="calendar";
            question.type = utilityService.getQuestionType(question);
        });
        if (!pushToAllGroups) return group;
        $scope.groups.push(group);
    };

    this.removeRow = function removeRow(index) {
        $scope.groups.splice(index, 1);
    };

    this.init();
};

export { mbt2Controller };