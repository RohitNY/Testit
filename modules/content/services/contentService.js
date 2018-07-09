"use strict";

const contentService = function contentService($resource, clientService) {

    let questionJson = null;
    let questionGroups = {};
    let allQuestionGroups = {};
    const reg = new RegExp(/(uniqueID\\*"):([0-9]+)/, "i");

    this.init = function () {
        this.contentResource =
            $resource("https://www.mobilemidwifeehr.com/MidwifeService.svc/jsons/GetQuestionObjects2/:id",
                {},
                { 'getQuestions': { 'method': 'GET', 'params': { 'id': 0 } } })
    };

    this.getQuestionGroups = function getQuestionGroups(id) {
        if (questionJson) return questionJson;
        id = id || "7048d32f-6924-4e10-87fe-db5e0b097915";
        return questionJson = this.contentResource.getQuestions({ 'id': id });
    };

    this.getAllQuestionGroupsWithQuestions = function getAllQuestionGroupsWithQuestions(questionJson) {

        if (Object.keys(questionGroups).length) return questionGroups;
        questionJson = questionJson || this.getQuestionGroups();

        let quesGroups = questionJson.GetQuestionObjects2Result.filter(q => q.objectName === "7");
        const questions = questionJson.GetQuestionObjects2Result.filter(q => q.objectName === "8");

        clientService.setQuestions(questions);

        quesGroups.map(group => {
            let id = extractId(group);
            group.uniqueId = id;

            const groupQuestions = questions.filter(q => q.data.includes(id));

            const parentChildArrays = groupQuestions.reduce(([child, parent], question) => (question.data.includes("parentQuestion") ? [[...child, question], parent] : [child, [...parent, question]]), [[], []]);

            parentChildArrays[1].map(q => { let id = extractId(q); q.subQues = parentChildArrays[0].filter(q => q.data.includes(id)); return q; })

            group.questions = parentChildArrays[1];
            // const subQuestions = groupQuestions.filter(q =>q.data.includes("parentQuestion"));

        });
        //const groupsWithQues = quesGroups.filter(group => group.questions && Object.keys(group.questions).length > 0);
        quesGroups = this.getChildQuestionGroups(quesGroups);
        allQuestionGroups = quesGroups;
        clientService.setQuestionGroups(quesGroups);
        return questionGroups = quesGroups;//groupsWithQues;

    };

    this.getChildQuestionGroups = function getChildQuestionGroups(allQuesGroups) {
        //const quesGroups = angular.copy(allQuesGroups);
        allQuesGroups.map(group => {
            let id = extractId(group);
            group.childGroups = allQuesGroups.filter(q => q.data.includes(`"parentQuestionGroup":${id}`));
        });
        return allQuesGroups;
    };

    this.getAllQuestionGroups = function getAllQuestionGroups() {
        return allQuestionGroups;
    };

    this.saveSection = function saveSection(sectionName) {
        clientService.saveSection(sectionName);
    };

    this.saveForm = function saveForm(sectionName) {
        clientService.saveForm(sectionName);
    };

    function extractId(group) {
        let capturingGroups = reg.exec(group.data);
        if (!capturingGroups) return;
        return capturingGroups[2];
    };

    this.init();
}

export { contentService };