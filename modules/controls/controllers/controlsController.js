"use strict";
import { commonControllerBase } from "../../common/controllers/commonControllerBase";

const controlsController = function controlsController($scope, clientService, utilityService) {
    commonControllerBase.apply(this, arguments);
    this.init = function init() {
        if ($scope.ques.hasDateTime && $scope.ques.style === "noDay") {
            $scope.ques.dateFormat = "month";
        }
        if ($scope.ques.type === "label") {
            if ($scope.ques.text && $scope.ques.text.toLowerCase().includes("section:")) {
                $scope.ques.text = $scope.ques.text.split(":")[1];
                $scope.ques.showBottomBorder = true;
            }
        }

        if ($scope.prefix !== 0 && !$scope.prefix) $scope.prefix = "";
        if ($scope.prefix !== "") {
            $scope.ques.Id = `${$scope.prefix}_${$scope.ques.Id}`;
            if($scope.ques.printQuestions && $scope.ques.printQuestions.length > 0){
                $scope.ques.printQuestions.forEach(q => {
                    q.Id = `${$scope.prefix}_${q.Id}`;
                });
            }
        
        }
    };

    this.AddPlaceholder = function AddPlaceholder(eltId, stringValue) {
        if (!eltId || !stringValue) return;
        const selectedElement = angular.element(document.querySelector(`[id="${eltId}"]`));
        if (!selectedElement) return;
        selectedElement.attr('placeholder', stringValue);
    };

    this.RemovePlaceholder = function RemovePlaceholder(eltId) {
        if (!eltId) return;
        const selectedElement = angular.element(document.querySelector(`[id="${eltId}"]`));
        if (!selectedElement) return;
        selectedElement.removeAttr('placeholder');
        if (!selectedElement.val()) {
            selectedElement.siblings("label").removeClass("active");
        }
    };

    this.CalculateControlWidth = function CalculateControlWidth(ques) {
        if (ques.putOnNewLine && ques.showBottomBorder) return 12;
        if (ques.width) return ques.width;
        if (ques.columns) {
            const column = parseInt(ques.columns);
            if (!isNaN(column)) return column * 3;
        }

        if ($scope.group.defaultWidth) {
            return $scope.group.defaultWidth;
        }

        if (ques.Title.length > 30) return 6;
        return 4;
    };

    this.checkforClass = function checkforClass(ques) {
        return ($scope.group.defaultWidth) ? 'col-md-8' : '';
    };

    this.getType = function getType(question) {
        return question.numberResponse ? "number" : "text";
    }

    this.setSelectedValues = function setSelectedValues(question, value) {
        return question.Answer && question.Answer.includes(value);
    }

    this.onClickOfMultiTypeButton = function onClickOfMultiTypeButton(question, value) {
        question.Answer = question.Answer || "";
        if (question.Answer && question.Answer.includes(value)) {
            question.Answer = question.Answer.replace(value, "").replace(",,", ",");
            if (question.Answer.endsWith(","))
                question.Answer = question.Answer.substring(0, question.Answer.length - 1);
        }
        else {
            if (question.Answer) question.Answer += ",";
            question.Answer += value;
        }
    }

    this.onBlur = function onBlur() {
        if (!ques.saveToLocation) return;
        //save details to client answer obj with objectName : 3 
    }

    this.init();
};

export { controlsController };