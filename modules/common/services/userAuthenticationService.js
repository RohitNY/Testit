"use strict";

const userAuthenticationService = function userAuthenticationService() {
 
    this.init = function init() {
        this.isUserAuthenticated = false;
        this.isNewUser = false;
        this.guid = null;
        this.uniqueid = null;
        this.sessionToken = null;
        this.practiceName = null;
    };

    this.setLoginParams = function setLoginParams(guid, uniqueid) {
        this.guid = guid;
        this.uniqueid = uniqueid;
    };

    this.getLoginParams = function getLoginParams() {
        return {
            'guid': this.guid,
            'uniqueid': this.uniqueid
        };
    };

    this.init();
};

export { userAuthenticationService };