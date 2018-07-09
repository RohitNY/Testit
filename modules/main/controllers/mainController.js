"use strict";

const mainController = function mainController($state, userAuthenticationService) {
    this.init = function init() {
        if (!userAuthenticationService.isUserAuthenticated
            && !userAuthenticationService.isNewUser
        ) {
            $state.go("login");
        }
    };

    this.init();
};

export { mainController };