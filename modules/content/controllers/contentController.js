"use strict";

const contentController = function contentController($scope, modalService, contentService) {
    $scope.currentTab = null;
    this.init = function init() {
        $scope.currentTab = "basicSection";
        $scope.displaySaveButton = true;
        $scope.saveButtonNotReqd = ["pastPregnanciesSection", "summarySection"];
        $('[data-toggle="popover"]').popover();
        /**Temporary code */
        if (tempQuestionJson) {
            $scope.allQuestionGroupsWithQuestions = contentService.getAllQuestionGroupsWithQuestions(tempQuestionJson);
            $scope.allQuestionGroups = contentService.getAllQuestionGroups();
            $scope.isProcessing = false;
            return;
        }
        /**End of Temp code */
        $scope.isProcessing = true;
        $scope.questionJson = contentService.getQuestionGroups();
        $scope.allQuestionGroups = [];
        $scope.questionJson.$promise.then(() => {
            $scope.allQuestionGroupsWithQuestions = contentService.getAllQuestionGroupsWithQuestions();
            $scope.allQuestionGroups = contentService.getAllQuestionGroups();
        })
            .catch((error) => { console.log(error) })
            .finally(() => $scope.isProcessing = false);
    };

    this.SetActiveTab = function SetActiveTab(tabName) {

        if ($scope.currentTab) {
            if ($scope.currentTab === tabName) return;
            this.save($scope.contentForm, tabName);
        }
        else
            saveAndContinueCallback();
    };

    this.save = function save(mainForm, tabName) {
        //Object.keys(form).filter(key =>!key.startsWith("$")).filter(key =>form[key].$dirty)
        // contentService.saveSection($scope.currentTab);
        if (!mainForm) {
            saveAndContinueCallback(tabName);
            return;
        }

        const form = mainForm[$scope.currentTab + "Form"];

        if (!tabName) {
            contentService.saveForm(form);
            modalService.showSaveModal();
            return;
        }


        const saveDetails = () => {
            contentService.saveForm(form);
            modalService.showSaveModal();
            saveAndContinueCallback(tabName, form);
        };

        if (form) {
            if(form.$pristine) {
                saveAndContinueCallback(tabName, form); 
                return;
            }
            form.$setSubmitted(); 
            if (form.$error && form.$error["required"]) {
                const listOfFields = form.$error["required"].map(e => e.$$attr.title);
                modalService.showConfirmationBeforeNavigatingModal(listOfFields, saveDetails, discontinueNavCallback);
            }
            else {
                saveAndContinueCallback(tabName);
            }
        }
    };

    const saveAndContinueCallback = (tabName, form) => {
        if (!tabName) return;
        if(form) form.$setPristine();
        $scope.currentTab = tabName;
        $scope.displaySaveButton = $scope.saveButtonNotReqd.includes(tabName) ? false : true;
        $(`#${$scope.tabName}Tab`).blur();
    };

    const discontinueNavCallback = () => {
        $(".nav-link").removeClass("active");
        $(`#${$scope.currentTab}Tab`).addClass("active");
    };

    this.init();

}

export { contentController };