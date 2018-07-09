"use strict";

const headerController = function headerController($scope, $state, modalService, userAuthenticationService, clientService) {

    this.init = function init() {
        $scope.loginParams = {
            'guid': "",
            'uniqueid': ""
        };
        $scope.loginParams = userAuthenticationService.getLoginParams();
        if (userAuthenticationService.isNewUser) {
            $scope.name = "New User";
            return;
        }
        if (!userAuthenticationService.isUserAuthenticated) return;
        
        const clientInfo = clientService.getClientInfo($scope.loginParams.uniqueid);
        if (clientInfo) {
            $scope.name = `${clientInfo.firstName}`;
            if (clientInfo.middleName) $scope.name += ` ${clientInfo.middleName}`;
            if (clientInfo.lastName) $scope.name += ` ${clientInfo.lastName}`;
        }
    };

    this.onLogOut = function onLogOut() {
        modalService.showConfirmationModal('Are you sure you want to logout?', 'Log Out', () => {
            $state.go("login", { 'guid': $scope.loginParams.guid, 'uniqueid': $scope.loginParams.uniqueid });
        });
    };

    this.init();
};

export { headerController };