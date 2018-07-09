"use strict";

const expandCollapseController = function expandCollapseController($scope){
    
    this.init = function init(){};

    this.ExpandOrCollapseAll = function ExpandOrCollapseAll(isExpand){
        $scope.expandCollapseObj.forEach(group => {
           group.IsOpen = isExpand;
        });
    };

    this.init();
};

export {expandCollapseController};