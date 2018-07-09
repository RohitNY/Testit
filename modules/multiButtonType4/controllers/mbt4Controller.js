"use strict";

import { commonControllerBase } from "../../common/controllers/commonControllerBase";
const mbt4Controller = function mbt4Controller($scope, clientService, utilityService) {
    const selectedValues = [];

    commonControllerBase.apply(this, arguments);

    this.init = function init() {
        $scope.currentSelectedValue = null;
        if ($scope.ques && $scope.ques.childAnswerGroup) {
            $scope.subQuestionGroup = clientService.getQuestionGroupByName($scope.ques.childAnswerGroup);
            $scope.subQuestionGroup.questions = this.extractGroupQuestions($scope.subQuestionGroup, true);
            //$scope.answerGroups = clientService.getAnswerGroupsFor($scope.subQuestionGroup);
        }
        $scope.ques.Answer = {};
        const options = this.GetArray($scope.ques.comboOptions);
        options.forEach(option => {
            const answerGroups = clientService.answerGroupsWithAnswers.filter(a => a.data.includes(`${option}`));
            if (!answerGroups || !answerGroups.length) return;
            $scope.ques.Answer[option] =
                answerGroups.reduce((result, answerGroup) => {
                    const answers = answerGroup.answers.reduce((ag, ans) => {
                        const qId = this.extractQuestionId(ans);
                        const question = $scope.subQuestionGroup.questions.find(q => q.data.includes(`"uniqueID":${questionId}`));
                        if (!question) return;
                        const val = clientService.extractAnswer(question, ans);
                        ag[qId] = val;
                        return ag;
                    }, {});
                    result.push(answers);
                    return result;
                }, []);
        });
    };

    this.setSelectedValue = function setSelectedValue(value) {
        if ($scope.currentSelectedValue === value) {
            $scope.currentSelectedValue = null;
            return;
        }
        if (selectedValues[value]) {
            $scope.groups = selectedValues[value];
            return;
        }
        const groups = [];
        $scope.selectedValue = value;

        const answerGroups = clientService.answerGroupsWithAnswers.filter(a => a.data.includes(`${value}`));
        if (!answerGroups || !answerGroups.length) {
            const group = this.addNewRow(value);
            groups.push(group);
            $scope.groups = groups;
            return;
        }
        answerGroups.forEach(answerGroup => {
            const questionGroup = this.addNewRow(value);
            clientService.mapAnswerGroupToQuestionGroup(answerGroup, questionGroup);
            groups.push(questionGroup);
            selectedValues[value] = groups;
            $scope.groups = groups;
        });
    }

    this.updateAnswer = function updateAnswer() {
        const selectedValue = $scope.selectedValue;
        $scope.ques.Answer[selectedValue] = $scope.ques.Answer[selectedValue] || {};

        $scope.groups.reduce((result, group) => {
            const questions = group.questions.reduce((subResult, ques) => {
                if (ques.Answer) subResult[ques.uniqueId] = ques.Answer;
                return subResult;
            }, {});
            result.push(questions);
            return result;
        }, []);
    }

    this.addNewRow = function addNewRow(value, pushToAllGroups) {
        const group = angular.copy($scope.subQuestionGroup);
        group.questions.forEach(question => {
            question.label = value;
            question.Id = `${value}_${question.Id}`;
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

    this.onBlur = function onBlur() {
        console.log("blur");
        this.updateAnswer();
        $scope.selectedValue = null;
    };

    this.init();
};

export { mbt4Controller };