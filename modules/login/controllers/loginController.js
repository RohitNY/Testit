"use strict";

const loginController = function loginController($scope, $state, modalService, clientService, loginService, userAuthenticationService) {
    this.init = function init() {
        const existingPopUp = angular.element(".modal");
        if (existingPopUp && existingPopUp.scope())
            existingPopUp.scope().$dismiss();

        $scope.title = "Mobile Wife EHR";
        $scope.welcomeNote = "Welcome";
        $scope.username = null;
        $scope.password = null;
        $scope.stateParams = $state.params;
        if (!$scope.stateParams.guid) {
            modalService.showMessageModal("Invalid URL. Please verify the link is accurate and try again.", "Information Missing", false);
            return;
        }
        //if (!$scope.stateParams.uniqueid) {

        const midWifeInfo = loginService.getEHR($scope.stateParams.guid);
        midWifeInfo.$promise.then((info) => {
            if (info.errorReport && info.errorReport.ErrorMessage) {
                modalService.showMessageModal(info.errorReport.ErrorMessage, "Error", false);
                return;
            }
            userAuthenticationService.sessionToken = info.sessionToken;
            userAuthenticationService.practiceName = info.practicename;
            if (info.practicename) $scope.practiceName = `${info.practicename}`;
            if (!$scope.stateParams.uniqueid) {
                userAuthenticationService.isNewUser = true;
                $state.go("main");
            }
            else {
                const clientInfoResource = loginService.getClientInfo($scope.stateParams.guid, $scope.stateParams.uniqueid);
                clientInfoResource.$promise.then((info) => {
                    if (!info || !!info.errorReport) return;
                    $scope.welcomeNote = `Welcome ${info.firstName}`
                });
            }
        }).catch(() => {
            modalService.showMessageModal("Invalid URL. Please verify the link is accurate and try again.", "Information Missing", false);
            //        return;
        });
        //    return;
        //}
        // const clientInfoResource = loginService.getClientInfo($scope.stateParams.guid, $scope.stateParams.uniqueid);
        // clientInfoResource.$promise.then((info) => {
        //     if (!info || !!info.errorReport) return;
        //     $scope.welcomeNote = `Welcome ${info.firstName}`
        // });

        // const clientInfo = clientService.getClientAnswers("7048d32f-6924-4e10-87fe-db5e0b097915", $scope.stateParams.uniqueid);
        // clientInfo.$promise.then((client) => {
        //     console.log(client);
        //     if (!client.GetClientResult || (client.errorReport && Object.keys(client.errorReport).length)) {
        //         modalService.showMessageModal("Unable to retrieve your details", "Error", true);
        //         return;
        //     }
        //     const info = client.GetClientResult
        //         .find(q => q.data.includes(`"uniqueID":${$scope.stateParams.uniqueid}`));
        //     if (!info) return;
        //     Object.assign(info, JSON.parse(info.data));
        //     $scope.welcomeNote = `Welcome ${info.firstName}`;
        // });
    };

    this.login = function login() {
        const loginResource = loginService.login($scope.stateParams.guid, $scope.stateParams.uniqueid, $scope.username, $scope.password);
        loginResource.$promise.then((data) => {
            if (data.errorReport && !!Object.keys(data.erorrReport)) {
                modalService.showMessageModal("Invalid username or password", "Login Failed", true);
                return;
            }
            userAuthenticationService.setLoginParams($scope.stateParams.guid, $scope.stateParams.uniqueid);
            userAuthenticationService.isUserAuthenticated = true;
            userAuthenticationService.sessionToken = data.sessionToken;

            const clientAnswers = this.getClientAnswers(data.sessionToken, $scope.stateParams.uniqueid);
            clientAnswers.$promise.finally(() => $state.go("main"));
        })
            .catch(() => {
                modalService.showMessageModal("Failed to verify username/password", "Unable To Login", true);

            })

    };

    this.getClientAnswers = function getClientAnswers(sessionToken, uniqueid) {
        const clientInfo = clientService.getClientAnswers(sessionToken, uniqueid);
        //const clientInfo = clientService.getClientAnswers("719C68CB-C8F6-4CAC-9E4A-3B039149AB28", "4301001099256679");
        clientInfo.$promise.then((client) => {
            console.log(client);
            if (!client.GetClientResult || (client.errorReport && Object.keys(client.errorReport).length)) {
                modalService.showMessageModal("Unable to retrieve your details", "Error", true);
                return;
            }
            const info = client.GetClientResult
                .find(q => q.data.includes(`"uniqueID":${uniqueid}`));
            if (!info) return;
            Object.assign(info, JSON.parse(info.data));
            $scope.welcomeNote = `Welcome ${info.firstName}`;
        });


        return clientInfo;
    };

    this.init();

};

export { loginController };