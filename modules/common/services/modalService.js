"use strict";

const modalService = function ($rootScope, $uibModal) {
    this.showModal = function (templateUrl, scope, controller, size) {
        const scp = $rootScope.$new();
        Object.assign(scp, scope);
        const modalInstance = $uibModal.open({
            'templateUrl': templateUrl,
            'scope': scp,
            'backdrop': "static",
            'backdropClass': "modal-backdrop",
            'controller': controller,
            'controllerAs': "ctrl",
            'size': size
        });

        return modalInstance;
    };

    this.showMessageModal = function (message, title, showCloseButton) {
        const scope = { 'message': message, 'title': title, 'showCloseButton': showCloseButton };
        return this.showModal("modules/common/templates/message.modal.html", scope);
    };

    this.showConfirmationModal = function (message, title, yesCallback, noCallback) {
        const scope = { 'message': message, 'title': title };
        const modalInstance = this.showModal("modules/common/templates/confirmation.modal.html", scope);
        if (typeof yesCallback === "function") {
            modalInstance.result.then((result) => { yesCallback(result); });
        }

        modalInstance.result.catch((result) => {
            // if (!(result === 'cancel' || result === 'escape key press')) {
            //     throw result;
            // }
            // if (typeof noCallback === "function")
            // noCallback(result);
            // modalInstance.close(false);
            return false;
        });

        return modalInstance;
    }

    this.showConfirmationBeforeNavigatingModal = function (content, ignoreCallback, okCallback) {
        const scope = {
            'message': "You missed following required fields:",
            'content': content,
            'title': "Confirm Navigation"
        };
        const modalInstance = this.showModal("modules/common/templates/confirmationBeforeSaving.modal.html", scope);
        if (typeof ignoreCallback === "function") {
            modalInstance.result.then((result) => { ignoreCallback(result); });
        }

        modalInstance.result.catch((result) => {
            if (typeof okCallback === "function")
                okCallback(result);
            modalInstance.close(false);
        });

        return modalInstance;
    }

    this.showSaveModal = function () {
        const scope = { 'message': "Saving" };
        const modalInstance = this.showModal("modules/common/templates/circularLoader.html", scope, '', 'sm');
        window.setTimeout(() => {
            $(".circle-loader").toggleClass("load-complete");
            $(".checkmark").toggle();
            scope.message = "Saved";
        }, 1500);
        window.setTimeout(() => {
            modalInstance.close();
        }, 3000);
    }
};

export { modalService };

