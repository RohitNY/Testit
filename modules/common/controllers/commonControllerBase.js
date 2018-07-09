"use strict";

const commonControllerBase = function commonControllerBase($scope, clientService, utilityService) {
    const uniqueIdReg = new RegExp(/(uniqueID\\*"):([0-9]+)/, "i");
    const questionGroupReg = new RegExp(/(questionGroup\\*"):([0-9]+)/, "i");
    const questionReg = new RegExp(/(question\\*"):([0-9]+)/, "i");
    const groupNameReg = new RegExp(/(groupName\\*"):"(\w*\s*\w*)"/, "i");
    const parentQuestionIdReg = new RegExp(/(parentPrintQuestion\\*"):([0-9]+)/, "i");

    this.init = function () { };

    this.getQuestionGroupswithQuestions = function getQuestionGroupswithQuestions() {
        $scope.groups.forEach((group) => {
            let questionGroup = $scope.allQuestionGroups.find(g => g.data.includes(`"groupName":"${group.Name}"`));
            if (!questionGroup || !questionGroup.questions.length) {
                console.log("no ques for: ", group.Title);
                return;
            }
            Object.assign(group, questionGroup);
            group.questions = this.extractGroupQuestions(questionGroup);
            this.createPrintQuestionsSubGroup(group);
            group.questions = group.questions.filter(q => !q.hideInEditMode);
        });

        clientService.storeUpdatedGroups($scope.groups);
    };

    this.extractGroupQuestions = function extractGroupQuestions(questionGroup, withDefault) {
        return questionGroup.questions
            .map((q, index) => {
                Object.assign(q, JSON.parse(q.data));
                const defaultValue = this.GetDefaultValue(q);
                q.uniqueId = this.extractUniqueId(q);
                q.type = utilityService.getQuestionType(q);
                q.Id = this.generateId(q.questionName) + `_${index}`;
                q.Title = this.getTitle(q);
                q.Answer = withDefault ? defaultValue : this.getAnswerOrDefault(q);
                q.defaultValue = defaultValue;
                q.subQues = this.createSubGroups(q, q.subQues, "parentQuestionAnswer");
                q.units = this.getUnits(q.text);
                return q;
            })
            //.filter(q => !q.hideInEditMode)
            .sort((a, b) => this.compare(a, b));
    };

    this.createSubGroups = function (parent, array, property) {
        const self = this;
        if (!array || !array.length) return {};
        return array.reduce(function (memo, x, index) {
            Object.assign(x, JSON.parse(x.data));
            x.uniqueId = self.extractUniqueId(x);
            x.Id = self.generateId(x.questionName) + `_${index}`;
            x.type = utilityService.getQuestionType(x);
            x.Title = self.getTitle(x);
            x.Answer = self.getAnswerOrDefault(x);
            x.units = self.getUnits(x.text);
            const val = self.getTypeCastedValue(parent, x[property]);
            if (!memo[val]) { memo[val] = []; }
            memo[val].push(x);
            return memo;
        }, {});
    };

    this.createPrintQuestionsSubGroup = function createPrintQuestionsSubGroup(group) {
        if (!group || !group.questions) return;
        const questionsWithParent = group.questions.filter(q => q.parentPrintQuestion && q.style);
        questionsWithParent.forEach(ques => {
            let parentId = this.extractParentQuestionId(ques);
            let parent = group.questions.find(q => q.uniqueId === parentId);
            if (!parent) return;
            parent.printQuestions = parent.printQuestions || [];
            parent.printQuestions.push(ques);
            parent.hideInEditMode *= ques.hideInEditMode;//parent.printQuestions.some(q => q.hideInEditMode != 1) ? 0 : 1;
            let index = group.questions.indexOf(ques);
            if (index >= 0) group.questions.splice(index, 1);
        });
    };

    this.compare = function compare(a, b) {
        if (a.sortOrder < b.sortOrder) return -1;
        if (a.sortOrder > b.sortOrder) return 1;
        return 0;
    };

    this.getTitle = (q) => this.CapitalizeString(q.text || q.textInViewMode || q.waterMark);

    this.getAnswerOrDefault = function getAnswerOrDefault(question, selectedAnswers, useOnlyProvidedAnswer) {
        return this.getAnswer(question, selectedAnswers, useOnlyProvidedAnswer) || this.GetDefaultValue(question);
    };

    this.getAnswer = function getAnswer(question, selectedAnswers, useOnlyProvidedAnswer) {
        selectedAnswers = selectedAnswers || [];
        const reg = new RegExp(/(uniqueID\\*"):([0-9]+)/, "i");
        let capturingGroups = reg.exec(question.data);
        if (!capturingGroups) return null;
        const questionId = capturingGroups[2];

        let answer = selectedAnswers.find(a => a.data.includes(`"question":${questionId}`))
        if (!answer && !useOnlyProvidedAnswer)
            answer = clientService.getAnswerFor(questionId);
        return this.extractAnswer(question, answer);
    };

    this.extractAnswer = function extractAnswer(question, answer) {
        return clientService.extractAnswer(question, answer);
    };

    this.extractGroupsForTheSection = function extractGroupsForTheSection(sectionName) {
        return clientService.reqQuestionGroups.filter(q => q.Section === sectionName);
    }

    this.generateId = function generateId(str) {
        let id = this.toCamelCase(str);
        if (id.match(/^\d/)) id = `a${id}`;
        if (id.includes("~")) id = id.split("~")[0];
        return id;
    };

    this.toCamelCase = (str) => str.replace(/(?:^\w|[A-Z]|\b\w)/g,
        (ltr, idx) => idx === 0 ? ltr.toLowerCase() : ltr.toUpperCase())
        .replace(/\s+/g, '');

    this.CapitalizeString = (str) => {
        if (!str) return "";
        if (str.includes("~")) str = str.split("~")[0];
        if (!str.trim()) return "";
        return str.trim().split(/\s+/).map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
    };

    this.getUnits = function getUnits(str) {
        if (!str) return "";
        return str.includes("~") ? str.split("~")[1] : "";
    }

    this.GetDefaultValue = (question) => {
        return this.getTypeCastedValue(question, question.defaultValue);
    };

    this.GetArray = function GetArray(stringValue, shouldSort) {
        if (!stringValue) return [];
        if (stringValue === ".States") stringValue = listOfStates;
        const result = stringValue.split(",");
        return shouldSort ? result.sort() : result;

    };

    this.chunkArray = function chunkArray(stringValue, shouldSort, chunk_size) {
        if ($scope.chunks) return $scope.chunks;
        const arr = this.GetArray(stringValue, shouldSort);
        var results = [];

        while (arr.length) {
            results.push(arr.splice(0, chunk_size));
        }

        return $scope.chunks = results;
    };

    this.getTypeCastedValue = function getTypeCastedValue(question, value) {
        if (question.hasYesNo && !question.segmentedControlValues) {
            const regex = new RegExp(/TRUE|1/, "i");
            return regex.test(value || "false");
        }
        if (question.hasDateTime && !!value) {
            if (value.toLowerCase() === "current time")
                return getTodayDate();
            if (isNaN(Date.parse(value))) return null;
        }
        return value;
    };

    this.ellipsis = function ellipsis(text) {
        return text.length > 90 ? `${text.substring(0, 89)}...` : text;
    };

    function getTodayDate() {
        let today = new Date();
        let dd = today.getDate();

        let mm = today.getMonth() + 1;
        const yyyy = today.getFullYear();
        if (dd < 10) {
            dd = `0${dd}`;
        }

        if (mm < 10) {
            mm = `0${mm}`;
        }
        return `${mm}/${dd}/${yyyy}`;
    }

    const listOfStates = "Alabama,Arizona,Alaska,American Samoa,Arkansas,California,Colorado,Connecticut,Delaware,District Of Columbia,Federated States Of Micronesia,Florida,Georgia,Guam,Hawaii,Idaho,Illinois,Indiana,Iowa,Kansas,Kentucky,Louisiana,Maine,Marshall Islands ,Maryland,Massachusetts,Michigan,Minnesota,Mississippi,Missouri,Nebraska,Nevada,New Hampshire,New Jersey,New Mexico,New York,North Carolina,North Dakota,Northern Mariana Islands,Ohio,Oklahoma,Oregon,Palau,Pennsylvania,Puerto Rico ,Rhode Island,South Carolina,South Dakota,Tennessee,Texas,Utah,Virginia,Vermont,Virgin Islands,Washington,West Virginia,Wisconsin,Wyoming,Montana,[Alberta],[British Columbia],[Manitoba],[New Brunswick],[Newfoundland and Labrador],[Northwest Territories],[Nova Scotia],[Nunavut],[Ontario],[Prince Edward Island],[Quebec],[Saskatchewan],[Yukon]";


    this.extractUniqueId = function extractUniqueId(group) {
        return extractValue(group, uniqueIdReg);
    };

    this.extractQuestionGroupId = function extractQuestionGroupId(group) {
        return extractValue(group, questionGroupReg);
    };

    this.extractQuestionId = function extractQuestionId(group) {
        return extractValue(group, questionReg);
    };

    this.extractGroupName = function extractGroupName(group) {
        return extractValue(group, groupNameReg);
    };

    this.extractParentQuestionId = function extractParentQuestionId(question) {
        return extractValue(question, parentQuestionIdReg);
    };

    function extractValue(object, reg) {
        if (!object || !object.data) return null;
        let capturingGroups = reg.exec(object.data);
        if (!capturingGroups) return null;
        return capturingGroups[2];
    };

    this.init();

};

export { commonControllerBase };