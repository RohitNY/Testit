"use strict";

const sectionController = function sectionController($scope) {
    this.init = function init() { 
console.log($scope.prefix);
        $scope.show = {};
     };

    this.GetKeys = (obj) => Object.keys(obj);
    this.IsMatch = (selectedAns, key) => selectedAns == key;
    this.setFlag = function setFlag(ques, key, questionIndex, currentIndex) {

        const flag = `${questionIndex}_${currentIndex}`;
        $scope.show[flag] = isEqualOrContained(ques.Answer, key);
        $scope.$watch(() => ques.Answer, (newValue, oldValue) => {
            let comparer =
                (typeof newValue == "boolean") ? key == "true" : key;
            $scope.show[flag] = isEqualOrContained(ques.Answer, key);
        });
    };

    function isEqualOrContained(newValue, key) {
        if (newValue === undefined || newValue === null) return false;
        const listOfValues = key.split(",");
        return listOfValues.includes(newValue.toString());
    };

    this.init();
};

export { sectionController };