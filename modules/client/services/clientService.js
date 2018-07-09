"use strict";

const clientService = function clientService($resource, userAuthenticationService, utilityService) {

    const uniqueIdReg = new RegExp(/(uniqueID\\*"):([0-9]+)/, "i");
    const questionGroupReg = new RegExp(/(questionGroup\\*"):([0-9]+)/, "i");
    const questionReg = new RegExp(/(question\\*"):([0-9]+)/, "i");

    this.clientAnswers = null;
    this.answerGroupsWithAnswers = [];
    this.allQuestions = [];
    this.allQuestionGroups = [];
    this.questionGroups = [];

    this.reqQuestionGroups =
        [{
            Id: "BasicInfo",
            Title: "Basic Information",
            Name: "Basic Information",
            Section: "basicSection",
            IsOpen: true
        },
        {
            Id: "FinancialInfo",
            Title: "Financial Information",
            Name: "Financial Information",
            Section: "basicSection",
            IsOpen: true
        },
        {
            Id: "CurrentPregnancy",
            Title: "Current Pregnancy",
            Name: "currentPregnancy",
            Section: "pregnancySection",
            IsOpen: true
        },
        {
            Id: "MotherHistory",
            Title: "Your Mother's History",
            Name: "Your Mother's History",
            Section: "pregnancySection",
            IsOpen: true
        },
        {
            Id: "FatherOfBaby",
            Title: "Father of Baby",
            Name: "Father of Baby",
            Section: "pregnancySection",
            IsOpen: true
        },
        {
            Id: "FatherHistory",
            Title: "Father's History",
            Name: "Father's History",
            Section: "pregnancySection",
            IsOpen: true
        },
        {
            Id: "GeneticHistory",
            Title: "Genetic History",
            Name: "Genetic History",
            Section: "pregnancySection",
            IsOpen: true,
            defaultWidth: 6
        },
        {
            Id: "Past Pregnancy",
            Title: "Past Pregnancy",
            Name: "Pregnancy",
            Section: "pastPregnanciesSection",
            IsOpen: true
        }, {
            Id: "FamilyHistory",
            Title: "Your Family History",
            Name: "Family History",
            Section: "healthSection",
            IsOpen: true
        },
        {
            Id: "health",
            Title: "Your Health",
            Name: "Your History",
            Section: "healthSection",
            IsOpen: true
        },
        {
            Id: "Medications",
            Title: "Medications",
            Name: "MedicationStatus",
            Section: "healthSection",
            IsOpen: true
        },
        /**subsection */
        // {
        //     Id: "LifeStyle",
        //     Title: "Life Style",
        //     IsOpen: true
        // },
        {
            Id: "GynecologicHistory",
            Title: "Gynecologic History",
            Name: "gynHistory",
            Section: "healthSection",
            IsOpen: true
        }
            /**subsection */
            // {
            //     Id: "SexualHistory",
            //     Title: "Sexual History",
            //     IsOpen: true
            // },
        ];

    this.init = function init() {
        this.clientResource = $resource("https://www.mobilemidwifeehr.com/MidwifeService.svc/jsons/GetClient/:guid/:uniqueid",
            {},
            { 'getAnswers': { 'method': 'GET', params: { 'guid': 0, 'uniqueid': 0 } } }
        );

        this.saveResource = $resource("https://www.mobilemidwifeehr.com/MidwifeService.svc/jsons/:actionName", {},
            { 'save': { 'method': "POST", 'params': {'actionName': "ReceiveTransactions4"} } }
        );

    };

    this.setQuestionGroups = function setQuestionGroups(questionGroups) {
        this.allQuestionGroups = questionGroups;
    };

    this.setQuestions = function setQuestions(questions) {
        this.allQuestions = questions;
    };

    this.storeUpdatedGroups = function storeUpdatedGroups(groups) {
        this.questionGroups = [...this.questionGroups, ...groups];
    };

    this.getClientAnswers = function getClientAnswers(guid, uniqueid) {
        const resource = this.clientResource.getAnswers({ guid, uniqueid });
        resource.$promise.then(data => {
            this.clientAnswers = data;
            this.constructAnwserGroups(data);
        });
        return resource;
        return this.clientAnswers = this.clientResource.getAnswers({ guid, uniqueid });
    };

    this.getClientInfo = function getClientInfo(uniqueid) {
        if (!this.clientAnswers) return;
        const client = this.clientAnswers;
        if (!client.GetClientResult || (client.errorReport && Object.keys(client.errorReport).length)) {
            return;
        }
        const info = client.GetClientResult
            .find(q => q.objectName === "3");
        if (!info) return;
        Object.assign(info, JSON.parse(info.data));
        return info;
    };

    this.getAnswerFor = function getAnswerFor(questionId) {
        if (!this.clientAnswers) return;
        const answerContainer = this.clientAnswers.GetClientResult;
        return answerContainer
            .find(a => a.data.includes(`"question":${questionId}`));
    };

    this.getAnswerById = function getAnswerById(id) {
        if (!this.clientAnswers) return;
        const answerContainer = this.clientAnswers.GetClientResult;
        return answerContainer
            .find(a => a.data.includes(`"uniqueID":${id}`));
    };

    this.getAnswerGroupsFor = function getAnswerGroupsFor(questionGroupId) {
        if (!this.answerGroupsWithAnswers) return [];
        return questionGroupId ?
            this.answerGroupsWithAnswers
                .filter(a => a.data.includes(`"questionGroup":${questionGroupId}`))
            : this.answerGroupsWithAnswers;
    };

    this.constructAnwserGroups = function constructAnwserGroups() {

        const allAnswerGroups = this.clientAnswers.GetClientResult.filter(a => a.objectName === "2");
        const allAnswers = this.clientAnswers.GetClientResult.filter(a => a.objectName === "1");

        allAnswerGroups.forEach(group => {
            let id = extractUniqueId(group, uniqueIdReg);
            group.answers = allAnswers.filter(q => q.data.includes(id));
        });

        allAnswerGroups.forEach(group => {
            if (group.data.includes("clientObj")) return;
            let id = extractUniqueId(group, uniqueIdReg);
            group.subGroups = allAnswerGroups.reduce((subgroup, g) => {
                if (g.data.includes(`"parentAnswerGroup":${id}`)) {
                    subgroup.push(g);
                    g.isSubGroup = true;
                }
                return subgroup;
            }, []);

        });
        this.answerGroupsWithAnswers = allAnswerGroups;
    };

    this.mapAnswersToQuestions = function mapAnswersToQuestions() {
        const groupsToDisplay = [];
        $scope.allAnswerGroups.forEach(answerGroup => {
            let questionGroupId = extractQuestionGroupId(answerGroup);
            const questionGroup = this.allQuestionGroups.find(group => group.data.includes(`"uniqueID":${questionGroupId}`));
            if (!questionGroup || !questionGroup.questions) return;
            answerGroup.Answers.forEach(answer => {
                let questionId = extractQuestionId(answer);
                let question = this.allQuestions.questions.find(q => q.data.includes(`"uniqueID":${questionId}`));
                if (!question) return;
                question.savedAnswer = readAnswer(answer, question);
            });
            if (questionGroup.questions.some(q => !!q.savedAnswer)) {
                groupsToDisplay.push(questionGroup);
            }
        });
    };

    this.mapAnswerGroupToQuestionGroup = function mapAnswerGroupToQuestionGroup(answerGroup, questionGroup) {
        answerGroup.answers.forEach(answer => {
            let questionId = extractQuestionId(answer);
            let question = questionGroup.questions.find(q => q.data.includes(`"uniqueID":${questionId}`));
            if (!question) return;
            question.Answer = this.extractAnswer(question, answer);
        });

    };

    this.saveForm = function saveForm(form, sectionName) {
        if (!form) return;
        const elementsToBeSaved = Object.keys(form)
            .filter(key => !key.startsWith("$"))
            .filter(key => form[key].$dirty);
        if (!elementsToBeSaved || elementsToBeSaved.length <= 0) return;

        let transactionData = [];
        elementsToBeSaved.forEach(element => {
            let elt = form[element];
            const eltAttributes = elt.$$attr;
            const eltQuestionId = eltAttributes.questionId;
            if (!eltQuestionId) return;
            let question = this.allQuestions.find(q => q.data.includes(`"uniqueID":${eltQuestionId}`));
            if (question.Answer === utilityService.GetDefaultValue(question)) return;
            //get group for the question
            const groupId = utilityService.extractQuestionGroupId(question);
            const group = this.questionGroups.find(q => q.data.includes(`"uniqueID":${groupId}`))
            const answersGroup = this.getAnswerGroupsFor(groupId);
            const answersFromTheGroup = this.createAnswerTransaction(question, group, answersGroup[0]);
            if (answersFromTheGroup)
                transactionData = [...transactionData, ...answersFromTheGroup];
            //if question has savetolocation    
        });
        if (!transactionData || transactionData.length <= 0) return;
        const saveObj = {
            'sessionToken': userAuthenticationService.sessionToken,
            'isLastBatch': 1,
            'isWebPortalOrLogUploadOrAndroid': true,
            'transactions': transactionData
        };
        console.log(saveObj);
        return this.saveResource.save(saveObj);
    };

    this.getTransactionForElement = function getTransactionForElement(elt){
        const eltAttributes = elt.$$attr;
        const eltQuestionId = eltAttributes.questionId;
        if (!eltQuestionId) return;
        let question = this.allQuestions.find(q => q.data.includes(`"uniqueID":${eltQuestionId}`));
        if (question.Answer === utilityService.GetDefaultValue(question)) return;
        //get group for the question
        const groupId = utilityService.extractQuestionGroupId(question);
        const group = this.questionGroups.find(q => q.data.includes(`"uniqueID":${groupId}`))
        const answersGroup = this.getAnswerGroupsFor(groupId);
         return this.createAnswerTransaction(question, group, answersGroup[0]);
    };

    this.createAnswerTransaction = function createAnswerTransaction(question, group, answerGroup) {
        if (!group) return null;
        const answerGroupId = extractUniqueId(answerGroup);
        const transactionData = [];

        const exisitingAnswer = this.getAnswerFor(question.uniqueId);
        if (exisitingAnswer && !this.doesQuestionHasDifferentAnswer(question, exisitingAnswer)) return;
        let uniqueId = this.getUniqueIdentifier(exisitingAnswer);
        const transactionObject = this.createTransactionObject(group, question, answerGroupId, uniqueId);
        transactionData.push(transactionObject);
        // transactionData.push({
        //     'uniqueID': uniqueId,
        //     'actionType': 2,
        //     'objectName': "1",
        //     'createdDate': `/Date(${getCurrentDate()})/`,
        //     'data': buildData(group, question, answerGroupId, uniqueId),
        //     'details': `${group.Name}-${getQuestionText(question)}`,
        //     'byID': uniqueId
        // });

        console.log(transactionData);
        return transactionData;

    };

    this.createTransactionObject = function createTransactionObject(group, question, answerGroupId, uniqueId){
        return {
            'uniqueIDStr': uniqueId,
            'actionType': 2,
            'objectName': "1",
            'createdDate': `/Date(${getCurrentDate()})/`,
            'data': buildData(group, question, answerGroupId, uniqueId),
            'details': `${group.Name}-${getQuestionText(question)}`,
            'byIDStr': uniqueId
        }
    }

    this.saveSection = function saveSection(sectionName) {
        const groups = this.questionGroups.filter(group => group.Section === sectionName);
        console.log(groups);
        const transactionData = this.saveGroupDetails(groups);
        console.log(transactionData);
        if (!transactionData || !transactionData.length) return null;
        const saveObj = {
            'sessionToken': userAuthenticationService.sessionToken,
            'isLastBatch': 1,
            'isWebPortalOrLogUploadOrAndroid': true,
            'transactions': transactionData
        };
        return this.saveResource.save(saveObj);
    };

    this.saveGroupDetails = function saveGroupDetails(questionGroups) {
        if (!questionGroups) return;
        let transactionData = [];
        questionGroups.forEach(group => {
            const groupId = extractUniqueId(group);
            const answersGroup = this.getAnswerGroupsFor(groupId);

            const answersFromTheGroup = this.createAnswerObjects(group, answersGroup[0]);
            transactionData = [...transactionData, ...answersFromTheGroup];
        });
        return transactionData;
    };


    this.createAnswerObjects = function createAnswerObjects(group, answerGroup) {
        if (!group || !group.questions) return null;
        const questionWithAnswers = group.questions.filter(q => q.Answer);
        const answerGroupId = extractUniqueId(answerGroup);
        const transactionData = [];
        questionWithAnswers.forEach(question => {
            const exisitingAnswer = this.getAnswerFor(question.uniqueId);
            if (exisitingAnswer && !this.doesQuestionHasDifferentAnswer(question, exisitingAnswer)) return;
            let uniqueId = this.getUniqueIdentifier(exisitingAnswer);
            transactionData.push({
                'uniqueID': uniqueId,
                'actionType': 2,
                'objectName': "1",
                'createdDate': `/Date(${getCurrentDate()})/`,
                'data': buildData(group, question, answerGroupId, uniqueId)
            });
        });
        console.log(transactionData);
        return transactionData;
    };

    this.doesQuestionHasDifferentAnswer = function doesQuestionHasDifferentAnswer(question, answer) {
        const ans = this.extractAnswer(question, answer);
        return ans !== question.Answer;
    };

    this.extractAnswer = function extractAnswer(question, answer) {
        if (!answer) return null;

        const answerData = JSON.parse(answer.data);

        if (question.hasTextBox) return answerData.comment || answerData.number;
        if (question.numberStepper) return answerData.number;
        if (question.hasCombo || question.multiButtonType) return answerData.comboSelection;
        if (question.hasYesNo) return answerData.yesNo ? true : false;
        if (question.hasDateTime) {
            const dateTime = answerData.dateTime;
            const dateReg = new RegExp(/(\d+)\+?(\d+)/, "i");
            const dateGroup = dateReg.exec(dateTime);
            if (!dateGroup) return null;
            const date = parseInt(dateGroup[0]);
            const timezone = parseInt(dateGroup[2]);
            return moment(new Date(date)).format("MM/DD/YYYY");

        }
        return null;
    };

    this.getUniqueIdentifier = function getUniqueIdentifier(answer) {
        if (answer) return extractUniqueId(answer);
        return randomFixedInteger(16);
    };

    const randomFixedInteger = (length) =>
        Math.floor(Math.pow(10, length - 1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1));

    function getCurrentDate() {
        const timezone = new Date().toString().match(/([-\+][0-9]+)\s/)[1];
        return `${Date.now()}${timezone}`;
    };

    function buildData(group, question, answerGroupId, uniqueid) {
        // const data = {
        //     'createdDate': `Date(${getCurrentDate()})`,
        //     'answerGroup': answerGroupId,
        //     'question': extractUniqueId(question),
        //     'uniqueID': uniqueid
        // };
        // data[getAnswerKey(question)] = question.Answer;
        // return JSON.stringify(data);

        return `{"createdDate":"\/Date(${getCurrentDate()})\/","lastUpdated":"\/Date(${getCurrentDate()})\/",` +
            ` "answerGroup":${answerGroupId},"question":${question.uniqueId},"uniqueIDStr":${uniqueid},` +
            ` ${getAnswerKey(question)}}`;
    };

    function getAnswerKey(question) {
        if (question.hasTextBox) return `"comment":"${question.Answer}"`;
        if (question.numberStepper) return `"number":${question.Answer}`;
        if (question.hasCombo) return `"comboSelection":"${question.Answer}"`;
        if (question.hasYesNo) return `"yesNo":${question.Answer ? 1 : 0}`;
        if (question.hasDateTime) `"dateTime":"\/Date(${Date.parse(question.Answer)})\/"`;
    }

    function getQuestionText(q) {
        return q.questionName || q.text || q.textInViewMode || q.waterMark || "";
    }

    function extractUniqueId(group) {
        return extractValue(group, uniqueIdReg);
    };

    function extractQuestionGroupId(group) {
        return extractValue(group, questionGroupReg);
    };

    function extractQuestionId(group) {
        return extractValue(group, questionReg);
    };

    function extractValue(object, reg) {
        if (!object || !object.data) return null;
        let capturingGroups = reg.exec(object.data);
        if (!capturingGroups) return null;
        return capturingGroups[2];
    };

    this.getQuestionGroupByName = function getQuestionGroupByName(groupName) {
        return this.allQuestionGroups.find(group => group.data.includes(`"groupName":"${groupName}"`));
    }

    this.init();
}

export { clientService };