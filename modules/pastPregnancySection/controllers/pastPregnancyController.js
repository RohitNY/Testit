"use strict";

import { commonControllerBase } from "../../common/controllers/commonControllerBase";

const pastPregnancyController = function pastPregnancyController($scope, clientService, utilityService, modalService, pastPregnancyService) {
    commonControllerBase.apply(this, arguments);

    this.init = function init() {
        $scope.isEdit = false;
        $scope.groups = this.extractGroupsForTheSection("pastPregnanciesSection");
        // $scope.groups = [{
        //     Id: "Past Pregnancy",
        //     Title: "Past Pregnancy",
        //     Name: "Pregnancy",
        //     Section: "pastPregnanciesSection",
        //     IsOpen: true
        // }];
        $scope.sectionHeader = {
            Id: "PregnanciesHeader"
        }
        $scope.childGroup = {
            Name: "Newborn Details",
            Question: "outcome"
        };

        $scope.currentAnswerGroup = null;

        $scope.numberOfFetues = new Array(1);

        let titleGroup = $scope.allGroups.find(g => g.data.includes(`"groupName":"${$scope.sectionHeader.Id}"`));
        if (titleGroup) {
            Object.assign(titleGroup, JSON.parse(titleGroup.data));
            $scope.title = titleGroup.titleText;
        }
        this.getQuestionGroupswithQuestions();
        if (!$scope.groups[0].questions) return;

        $scope.mainQues = $scope.groups[0].questions[0];
        $scope.mainQuesValues = this.GetArray($scope.mainQues.comboOptions);
        this.createSubQuestion();
        $scope.groupsToDisplay = this.getExistingPregnancyDetails($scope.groups[0].uniqueId);
        //    let temp = [...$scope.groupsToDisplay, ...$scope.groupsToDisplay];
        //    temp =[...temp, ...$scope.groupsToDisplay];
        //     $scope.groupsToDisplay = temp;
    };

    this.createSubQuestion = function createSubQuestion() {
        $scope.subQuestion = {
            title: "Outcome",
            id: "Outcome",
            values: ["Please Select"],
            isRequired: true,
            defaultValue: "Please Select",
            answer: "Please Select"
        };
        $scope.groups[0].childGroups.forEach(group => {
            const reg = new RegExp(/(groupName\\*"):\"(\w*\s*\w*)\"/, "i");
            const capturingGroup = reg.exec(group.data);
            if (!capturingGroup) return;
            const shouldhideRegex = new RegExp(/hideInViewMode\\*":\s*1/, "i");
            if (shouldhideRegex.test(group.data)) return;
            $scope.subQuestion.values.push(capturingGroup[2]);
        });
    };

    this.getExistingPregnancyDetails = function getExistingPregnancyDetails(groupId) {
        const anwserGroups = clientService.getAnswerGroupsFor(groupId);

        return anwserGroups.map((ansGroup, index) => {
            let displayGroup = {
                title: ` Pregnancy`,
                id: this.extractUniqueId(ansGroup),
                subGroups: [],
                pregnancyCount: 0
            };
            ansGroup.subGroups.forEach((subGroup) => {
                const displaySubGroup = { 'answers': [] };
                const answerGroupId = this.extractUniqueId(subGroup);
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
                        answerId: this.extractUniqueId(answer),
                        answerGroup: answerGroupId,
                        parentId: this.extractParentQuestionId(question),
                        sortOrder: questionData.sortOrder,
                        title: this.CapitalizeString(questionData.text),
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


    this.onEdit = function onEdit(answerGroupId) {
        console.log(answerGroupId);
        const answerGroup = $scope.groupsToDisplay.find(group => group.id === answerGroupId);
        $scope.mainQues.Answer = answerGroup.numberOfFetues;
        this.setNumber($scope.mainQues.Answer);
        $scope.currentAnswerGroup = angular.copy(answerGroup);
        $scope.isEdit = true;
    }

    this.onDelete = function onDelete(answerGroupId) {
        console.log(answerGroupId);
        modalService.showConfirmationModal('Are you sure you want to Delete?', 'Delete Existing Pregnancy', () => {
            const index = $scope.groupsToDisplay.findIndex(group => group.id === answerGroupId);
            $scope.groupsToDisplay.splice(index, 1);

        });
    }

    this.onCancel = function onCancel() {
        $scope.isEdit = false;
        $scope.currentAnswerGroup = null;
    };

    this.onSave = function onSave(form) {
        const mainFormElt = angular.element(document.querySelector('[name="pastPregnanciesSectionForm"]'))
        if (mainFormElt) {
            const sc = mainFormElt.scope();
            if (!sc) return;
            const formElt = sc["pastPregnanciesSectionForm"];
            formElt.$setSubmitted(); console.log(formElt.$error);
            //if there is a currentAnswerGroup rather than dirty, get all controls with value
            const controls = (!$scope.currentAnswerGroup) ?
                formElt.$$controls.filter(c => c.$dirty)
                : formElt.$$controls.filter(c => c.$modelValue);
            let transactionData = [];
            const sets = controls.reduce((sets, control) => {
                let controlIdParts = control.$$attr.id.split("_");
                sets[controlIdParts[0]] = sets[controlIdParts[0]] || [];
                sets[controlIdParts[0]].push(control);
                return sets;
            }, {});
            const keys = Object.keys(sets);
            keys.forEach(key => {
                const elements = sets[key];
                //they belong to same subgroup
                let answerGroupId = "";
                elements.forEach(elt => {
                    const attributes = elt.$$attr;
                    if (!answerGroupId) {
                        answerGroupId = attributes.answerGroup ?
                            attributes.answerGroup : clientService.getUniqueIdentifier();
                    }
                    const answerId = attributes.answerId ?
                        attributes.answerId : clientService.getUniqueIdentifier();
                    //get subgroupid
                    //get transactions 
                    let question = clientService.allQuestions.find(q => q.data.includes(`"uniqueID":${attributes.questionId}`));
                    if(!question){
                        console.log("misssing question, ", elt );
                        return;
                    }
                    const groupId = utilityService.extractQuestionGroupId(question);
                    const group = clientService.questionGroups.find(q => q.Id === "Past Pregnancy").childGroups.find(q => q.data.includes(`"uniqueID":${groupId}`));
                    const transactionObject = clientService.createTransactionObject(group, question, answerGroupId, answerId);
                    transactionData.push(transactionObject);
                });
            });


            // controls.forEach(elt => {
            //     const attributes = elt.$$attr;
            //     if (attributes.answerId) {
            //         //get answer by id
            //         const preAns = clientService.getAnswerById(attributes.answerId);

            //     }
            //     const eltQuestionId = attributes.questionId;
            //     if (!eltQuestionId) return;
            //     let question = this.allQuestions.find(q => q.data.includes(`"uniqueID":${eltQuestionId}`));
            //     const groupId = utilityService.extractQuestionGroupId(question);
            //     const group = clientService.questionGroups.find(q => q.Id === "Past Pregnancy").childGroups.find(q => q.data.includes(`"uniqueID":${groupId}`));
            //     const answersFromTheGroup = clientService.getTransactionForElement(control);
            //     if (answersFromTheGroup)
            //         transactionData = [...transactionData, ...answersFromTheGroup];
            // });
            console.log(transactionData);
            //use the answerGroup in case we are editing
            //if ($scope.currentAnswerGroup) { }

        }
        //get pastPregnanciesSectionForm

        //get $$controls
        //get one which are $dirty

        const index = $scope.groupsToDisplay.findIndex(group => group.id === $scope.currentAnswerGroup.id);
        $scope.groupsToDisplay.splice(index, 1, $scope.currentAnswerGroup);
        $scope.isEdit = false;
    }

    this.addPregnancy = function addPregnancy() {
        $scope.currentAnswerGroup = null;
        $scope.isEdit = true;
        $scope.numberOfFetues = new Array(1);
        $scope.mainQues.Answer = $scope.mainQuesValues[0];
    }
    this.setNumber = function setNumber(value) {
        $scope.numberOfFetues = new Array($scope.mainQuesValues.indexOf(value) + 1);
    }

    this.setFetuesCountText = function setFetuesCountText(count) {
        return $scope.mainQuesValues[count - 1];
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
    }

    this.ordinalSuffixOf = function ordinalSuffixOf(index) {
        return utilityService.ordinalSuffixOf(index);
    }


    this.init();
};

export { pastPregnancyController };