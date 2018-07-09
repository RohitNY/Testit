"use strict";
/**
 * Defines a path list widget.  It is a directive
 * that will render a list of paths.
 */
function ehrDatePickerDirective() {

    function parseDate(dateString) {
        return new Date(dateString);
    }

    return {
        scope: {
            'format': "@",
            'minDate': "=",
            'maxDate': "="
        },
        require: "?ngModel",
        link: function (scope, element, attrs, ngModel) {

            attrs.$observe("id", () => {
                // const $pickerElement = element.datetimepicker({
                //     autoClose: true,
                //     debug: true,
                //     format: 'L',
                //     icons: {
                //         time: "fa fa-clock-o",
                //         date: "fa fa-calendar",
                //         up: "fa fa-arrow-up",
                //         down: "fa fa-arrow-down"
                //     }
                // });
            });
        }
    };
}

export { ehrDatePickerDirective };