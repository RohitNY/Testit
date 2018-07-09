"use strict";

const loginService = function loginService($resource) {

    this.init = function init() {
        this.loginResource =
            $resource("https://www.mobilemidwifeehr.com/MidwifeService.svc/jsons/HandleLoginClientFromWeb/:guid/:username/:password/:uniqueid/test",
                {},
                { "login": { 'method': 'GET', 'params': { 'guid': 0, 'uniqueid': 0, 'username': null, 'password': null } } });

        this.clientInfoResource =
            $resource("https://www.mobilemidwifeehr.com/MidwifeService.svc/jsons/GetClientInfo/:uniqueid/:guid",
                {},
                { "clientInfo": { 'method': 'GET', 'params': { 'guid': 0, 'uniqueid': 0 } } });

        this.ehrResource =
            $resource("https://www.mobilemidwifeehr.com/MidwifeService.svc/jsons/HandleLoginNewClientFromWeb/:guid/Windows10-ChromeBrowser",
                {},
                { "ehrInfo": { 'method': 'GET', 'params': { 'guid': 0 } } });
    }

    this.login = function login(guid, uniqueid, username, password) {
        return this.loginResource.login({
            'guid': guid,
            'uniqueid': uniqueid,
            'username': username,
            'password': password
        });
    };

    this.getClientInfo = function getClientInfo(guid, uniqueid) {
        return this.clientInfoResource.clientInfo({
            'guid': guid,
            'uniqueid': uniqueid
        });
    };

    this.getEHR = function getEHR(guid) {
        return this.ehrResource.ehrInfo({ 'guid': guid });
    };

    this.init();
};

export { loginService };