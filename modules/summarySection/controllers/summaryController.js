"use strict";

import { commonControllerBase } from "../../common/controllers/commonControllerBase";
import { pastPregnancyController } from "../../pastPregnancySection/controllers/pastPregnancyController";
const summaryController = function summaryController($scope, clientService, utilityService, userAuthenticationService) {
    commonControllerBase.apply(this, arguments);

    this.init = function init() {
        $scope.questions = $scope.allQuestionGroups.reduce((questions, group) => {
            let quesWithAnswers = group.questions.filter(ques => !!ques.Answer);
            questions = [...questions, ...quesWithAnswers];
            return questions;
        }
            , []);
        $scope.allAnswerGroups = this.getAllAnwserGroups();
        $scope.allAnswerGroups.$promise.then(() => {
            $scope.allGroups = this.mapAnswersToQuestions(clientService.answerGroupsWithAnswers);
        });
    };

    // this.buildSummary = function buildSummary() {
    //     const allQuestionGroups = commonService.getAllQuestionGroups();
    //     $scope.groups = allQuestionGroups.map((allGroups, group) => {
    //         group.quesWithAnswers = group.questions.filter(ques => !!ques.Answer);
    //         if (group.quesWithAnswer) allGroups.push(group);
    //         return allGroups;
    //     }, []);
    // };

    this.getAllAnwserGroups = function getAllAnwserGroups() {
        const guid = userAuthenticationService.sessionToken;
        const loginParams = userAuthenticationService.getLoginParams()
        const allAnswersResource = clientService.getClientAnswers(guid, loginParams.uniqueid);
        return allAnswersResource;
    }

    this.mapAnswersToQuestions = function mapAnswersToQuestions(allAnswerGroups) {
        let answerGroups = angular.copy(allAnswerGroups);
        answerGroups = answerGroups.filter(ag => !ag.isSubGroup);

        const groupsToDisplay = [];
        const pastPregnanacies = [];
        answerGroups.forEach(answerGroup => {
            //    if (answerGroup.isSubGroup) return;
            let questionGroupId = this.extractQuestionGroupId(answerGroup);
            let questionGroup = clientService.allQuestionGroups.find(group => group.data.includes(`"uniqueID":${questionGroupId}`));
            const requiredGroup = clientService.reqQuestionGroups
                .find(g => questionGroup.data.includes(`"groupName":"${g.Name}"`))
            if (!requiredGroup) return;
            //questionGroup = [...questionGroup, ...requiredGroup];
            //const questionGroup = clientService.questionGroups.find(group => group.data.includes(`"uniqueID":${questionGroupId}`));
            if (!questionGroup || !questionGroup.questions) return;

            let displayGroup = {
                id: questionGroupId,
                title: requiredGroup.Title,//utilityService.extractTitleText(questionGroup),
                answers: []
            };

            //extracting out past pregnancies and treating them seperately
            if (displayGroup.title === "Past Pregnancy") {
                displayGroup.answerGroup = answerGroup;
                pastPregnanacies.push(displayGroup);
                return
            }
            answerGroup.answers.forEach(answer => {
                this.fillDetailsInGroup(answer, displayGroup);
            });
            if (answerGroup.subGroups) {
                answerGroup.subGroups.forEach(subGroup => {
                    displayGroup.subGroups = displayGroup.subGroups || [];
                    const subGroupData = JSON.parse(subGroup.data);
                    displayGroup.subGroups.push({ name: subGroup.name, answers: [] });
                    subGroup.answers.forEach(answer => { this.fillDetailsInGroup(answer, displayGroup.subGroups[displayGroup.subGroups.length - 1]); });
                });
            }

            if (!(displayGroup.answers.length || (displayGroup.subGroups && displayGroup.subGroups.some(sg => sg.answers)))) return;

            displayGroup.answers.sort((a, b) => this.compare(a, b));
            if (displayGroup.subGroups)
                displayGroup.subGroups.forEach(subgroup =>
                    subgroup.answers.sort((a, b) => this.compare(a, b)));

            groupsToDisplay.push(displayGroup);
        });

        //Working on past Pregnancies
        const pastPregnancyGroups = this.getExistingPregnancyDetails(pastPregnanacies[0].id);
        console.log("pastPregnancyGroups..", pastPregnancyGroups);
        return [...groupsToDisplay, ...pastPregnancyGroups];

    };


    this.fillDetailsInGroup = function fillDetailsInGroup(answer, displayGroup) {
        // displayGroup = displayGroup || { answers: [] };
        // if(displayGroup.title ==="Current Pregnancy"){
        //     displayGroup = this.getExistingPregnancyDetails(displayGroup.id);
        //     return;
        // }
        let questionId = this.extractQuestionId(answer);
        let question = clientService.allQuestions.find(q => q.data.includes(`"uniqueID":${questionId}`));
        if (!question) return;
        const questionData = JSON.parse(question.data);
        if (questionData.hideInViewMode) return;
        const ans = this.extractAnswer(questionData, answer);
        displayGroup.answers.push({
            id: questionId,
            title: this.getTitle(questionData),
            answer: `${this.summaryAnswer(questionData, ans)} ${this.getUnits(questionData.text)}`,
            sortOrder: questionData.sortOrder
        });

        return displayGroup;
    };

    this.summaryAnswer = function summaryAnswer(questionData, answer) {
        const ans = this.getTypeCastedValue(questionData, answer);
        if (questionData.hasYesNo) return ans ? "Yes" : "No";
        return ans;
    };

    this.getExistingPregnancyDetails = function getExistingPregnancyDetails(groupId) {
        const anwserGroups = clientService.getAnswerGroupsFor(groupId);

        return anwserGroups.map((ansGroup, index) => {
            let displayGroup = {
                title: `${utilityService.ordinalSuffixOf(index + 1)} Pregnancy`,
                id: this.extractUniqueId(ansGroup),
                subGroups: [],
                pregnancyCount: 0
            };
            ansGroup.subGroups.forEach((subGroup) => {
                const displaySubGroup = { 'answers': [] };
                subGroup.answers.forEach(answer => {

                    let questionId = this.extractQuestionId(answer);
                    let question = clientService.allQuestions.find(q => q.data.includes(`"uniqueID":${questionId}`));
                    if (!question) return;
                    const questionData = JSON.parse(question.data);

                    if (!displayGroup.summary) {
                        const questionGroupId = this.extractQuestionGroupId(question);
                        const questionGroup = clientService.allQuestionGroups.find(q => q.data.includes(`"uniqueID":${questionGroupId}`));
                        displaySubGroup.summary = this.extractGroupName(questionGroup);
                        displaySubGroup.questionGroup = questionGroup;

                    }
                    const displaySubGroupAnswer = {
                        id: questionId,
                        data: answer.data,
                        parentId: this.extractParentQuestionId(question),
                        sortOrder: questionData.sortOrder,
                        title: this.getTitle(questionData),
                        answer: `${this.extractAnswer(questionData, answer)} ${this.getUnits(questionData.text)}`
                    };
                    if (displaySubGroupAnswer.parentId) {
                        displaySubGroupAnswer.multiAnswer = {};
                        displaySubGroupAnswer.multiAnswer[displaySubGroupAnswer.sortOrder] = displaySubGroupAnswer.answer;
                    }
                    const existingAnswer = displaySubGroupAnswer.parentId ?
                        displaySubGroup.answers.find(a => a.parentId === displaySubGroupAnswer.parentId)
                        : null;
                    if (existingAnswer) {
                        existingAnswer.multiAnswer = existingAnswer.multiAnswer || {};
                        existingAnswer.multiAnswer[displaySubGroupAnswer.sortOrder] = displaySubGroupAnswer.answer;
                        existingAnswer.answer = this.setAnswer(existingAnswer);
                        existingAnswer.title = existingAnswer.title || displaySubGroupAnswer.title;
                    }
                    else
                        displaySubGroup.answers.push(displaySubGroupAnswer);

                });
                if (!displaySubGroup.summary) return;
                if (displaySubGroup.summary != "PregnancyDetails") displayGroup.pregnancyCount++;
                else {
                    displaySubGroup.summary = "Complications"
                    displaySubGroup.answers = [{
                        id: displaySubGroup.answers[0].id,
                        data: displaySubGroup.answers[0].data,
                        title: "Complications experienced during pregnancy",
                        answer: displaySubGroup.answers.reduce((str, a) => { if (str) str += ", "; str += a.answer; return str; }, "")
                    }];

                }
                displayGroup.subGroups.push(displaySubGroup);
            });

            displayGroup.numberOfFetues = this.setFetuesCountText(displayGroup.pregnancyCount);
            return displayGroup;
        });
        //.filter(group => group.answers.length);
    };

    this.setFetuesCountText = function setFetuesCountText(count) {
        if ($scope.mainQuesValues) return $scope.mainQuesValues[count - 1];
        let group = clientService.allQuestionGroups.find(g => g.data.includes(`"groupName":"Pregnancy"`))
        if (!group || !group.questions) return;
        let mainQues = group.questions.find(q => q.data.includes("number of fetuses"));
        if (!mainQues) return;
        Object.assign(mainQues, JSON.parse(mainQues.data));
        $scope.mainQuesValues = this.GetArray(mainQues.comboOptions);
        return $scope.mainQuesValues[count - 1];
    };

    this.getTitle = function getTitle(questionData) {
        const text = questionData.textInViewMode || questionData.text || questionData.waterMark;
        return this.CapitalizeString(text);
    }

    this.setAnswer = function setAnswer(existingAnswer) {
        if (!existingAnswer || !existingAnswer.multiAnswer) return existingAnswer.answer;

        let ans = "";
        const keys = Object.keys(existingAnswer.multiAnswer);
        keys.sort();
        keys.forEach(key => {
            if (ans) ans += " ";
            ans += existingAnswer.multiAnswer[key];
        });

        return ans;
    };

    this.CalculateControlWidth = function CalculateControlWidth(answer) {
        if (answer.length <= 25) return 3;
        if (answer.length <= 50) return 6;
        return 12;
    }
    this.init();
}



export { summaryController };