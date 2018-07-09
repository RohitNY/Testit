"use strict";
import { commonControllerBase } from "../../common/controllers/commonControllerBase";

const outcomeController = function outcomeController($scope, clientService, utilityService) {
    commonControllerBase.apply(this, arguments);

    this.init = function init() {
        this.createSubQuestion();
        if ($scope.selectedAnswerGroup
            && $scope.selectedAnswerGroup.subGroups
        ) {

            const pregnancyDetails = $scope.selectedAnswerGroup.subGroups.filter(s => s.summary !== "Complications");

            if (!pregnancyDetails[$scope.subGroupIndex]) return;
            const subAnswerGroup = pregnancyDetails[$scope.subGroupIndex];

            $scope.subQuestion.answer = subAnswerGroup.summary;
            this.onSelectionOfOutcome($scope.subQuestion.answer, subAnswerGroup);

            if (subAnswerGroup.summary === "Live Birth") {
                const subArray = pregnancyDetails.splice(0, $scope.subGroupIndex);
                if (subArray.some(s => s.summary === "Live Birth")) return;
                const complicationDetails = $scope.selectedAnswerGroup.subGroups.find(s => s.summary === "Complications");
                if (!complicationDetails) return;
                this.onSelectionOfOutcome("PregnancyDetails", complicationDetails);
            }

        }
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
        $scope.mainGroup.childGroups.forEach(group => {
            const shouldhideRegex = new RegExp(/hideInViewMode\\*":\s*1/, "i");
            if (shouldhideRegex.test(group.data)) return;
            const groupName = this.extractGroupName(group);
            if (!groupName) return;
            $scope.subQuestion.values.push(groupName);
        });
    };

    this.onSelectionOfOutcome = function onSelectionOfOutcome(value, answerGroup) {
        $scope.subQuestionGroups = answerGroup ? ($scope.subQuestionGroups || []) : [];
        if (value === "Please Select") return;
        $scope.subQuestionGroups = $scope.subQuestionGroups || [];

        const selectedAnswers = answerGroup ? answerGroup.answers : null;
        // let complicationAnswer;
        // if (value === "PregnancyDetails" && selectedAnswers && selectedAnswers.length > 0)
        //     complicationAnswer = selectedAnswers[0].answers;

        const group = $scope.mainGroup.childGroups.find(g => g.data.includes(`"groupName":"${value}"`));
        if (!group || !group.questions.length) {
            console.log("no ques for: ", group.Title);
            return;
        }
        const selectedGroup = angular.copy(group);
        const questions = selectedGroup.questions
            .map((q, index) => {
                Object.assign(q, JSON.parse(q.data));
                q.uniqueId = this.extractUniqueId(q);
                let answer = selectedAnswers.find(a => a.data.includes(`"question":${q.uniqueId}`));
                
                q.type = utilityService.getQuestionType(q);
                q.Id = this.generateId(q.questionName) + `_${index}`;
                q.Title = this.CapitalizeString(q.text);
                q.Answer = this.getAnswerOrDefault(q, selectedAnswers, true);
                q.subQues = this.createSubGroups(q, q.subQues, "parentQuestionAnswer");
                q.units = this.getUnits(q.text);
                q.answerGroup = answer ? answer.answerGroup : "";
                q.answerId = answer ? answer.answerId : "";
                return q;
            })
            // .filter(q => !q.hideInEditMode)
            .sort((a, b) => this.compare(a, b));

        const obj = {
            'data': selectedGroup.data,
            'questions': questions,
            'uniqueId': this.extractUniqueId(selectedGroup)
        };

        this.createPrintQuestionsSubGroup(obj);
        console.log(obj);
        $scope.subQuestionGroups.push(angular.copy(obj));

    };


    this.cancel = function cancel() {
        $scope.onCancel();
    }
    this.save = function save() {
        $scope.onSave({ $item: $scope.currentAnswer });
    }
    this.init();
};

export { outcomeController };