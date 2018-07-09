"use strict";
import generator from "generate-password";

const utilityService = function utilityService() {

    const titleTextReg = new RegExp(/(titleText\\*"):"(\w*\s*\w*)"/, "i");
    const uniqueIdReg = new RegExp(/(uniqueID\\*"):([0-9]+)/, "i");
    const questionGroupReg = new RegExp(/("questionGroup\\*"):([0-9]+)/, "i");

    this.init = function init() { };

    this.getQuestionType = function getQuestionType(question) {

        if (question.isLabel) return "label";
        if (question.hasTextBox && !question.multiButtonType) return "text";
        if (question.hasDateTime && question.hideIcon) return "dateTimeWithNoCalendarIcon";
        if (question.hasDateTime) return "dateTime";
        if (question.hasYesNo && question.hasCommentBox) return "yesNoWithComment";
        if (question.hasYesNo && !question.segmentedControlValues) return "yesNo";
        if (question.hasYesNo && question.segmentedControlValues) return "yesNoWithCustomValues";
        if (question.hasCombo) return "combo";
        if (question.multiButtonType === 1) return "mbt1";
    };


    this.constructAnwserGroups = function constructAnwserGroups(answerJson) {
        const allAnswerGroups = answerJson.filter(a => a.objectName === "2");
        const allAnswers = answerJson.filter(a => a.objectName === "1");

        allAnswerGroups.forEach(group => {
            let id = this.extractUniqueId(group, uniqueIdReg);
            group.answers = allAnswers.filter(q => q.data.includes(id));
        });
        allAnswerGroups.forEach(group => {
            let id = this.extractUniqueId(group, uniqueIdReg);
            group.subGroups = allAnswerGroups.filter(q => q.data.includes(`"parentAnswerGroup":${id}`));
        });
        return allAnswerGroups;
    };

    this.GetDefaultValue = (question) => {
        return this.getTypeCastedValue(question, question.defaultValue);
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
    
    this.ordinalSuffixOf = function ordinalSuffixOf(i) {
        var j = i % 10,
            k = i % 100;
        if (j == 1 && k != 11) {
            return i + "st";
        }
        if (j == 2 && k != 12) {
            return i + "nd";
        }
        if (j == 3 && k != 13) {
            return i + "rd";
        }
        return i + "th";
    }

    this.extractUniqueId = function extractUniqueId(group) {
        return extractValue(group, uniqueIdReg);
    };

    this.extractTitleText = function extractTitleText(group) {
        return extractValue(group, titleTextReg);
    };

    this.extractQuestionGroupId = function extractQuestionGroupId(group) {
        return extractValue(group, questionGroupReg);
    };

    this.generatePassword = function generatePassword(){
        // Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        return generator.generate({
            length: 10,
            numbers: true
        }); 
    }

    function extractValue(object, reg) {
        let capturingGroups = reg.exec(object.data);
        if (!capturingGroups) return;
        return capturingGroups[2];
    };
    
    this.init();
};

export { utilityService };