"use strict";

const commonService = function commonService() {

    let questionGroups = [];

    this.init = function init() { };

    this.storeUpdatedGroups = function storeUpdatedGroups(groups) {
        questionGroups = [...questionGroups, ...groups];
    };

    this.getAllQuestionGroups = function getAllQuestionGroups() {
        return questionGroups;
    };

    this.init();
}

export { commonService };