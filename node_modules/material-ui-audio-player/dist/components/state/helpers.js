"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.populateDispatch = exports.getRemaningTime = exports.getCurrentTime = exports.getProgress = exports.getFormattedTime = exports.appendZero = void 0;
var appendZero = function (num) { return (num < 10 ? "0" + num : num); };
exports.appendZero = appendZero;
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
var getFormattedTime = function (time, remaning) {
    if (remaning === void 0) { remaning = false; }
    var dateTime = new Date(0, 0, 0, 0, 0, time, 0);
    var dateTimeH = exports.appendZero(dateTime.getHours());
    var dateTimeM = exports.appendZero(dateTime.getMinutes());
    var dateTimeS = exports.appendZero(dateTime.getSeconds());
    var minus = remaning ? '-' : '';
    return dateTimeH > 0
        ? "" + minus + dateTimeH + ":" + dateTimeM + ":" + dateTimeS
        : "" + minus + dateTimeM + ":" + dateTimeS;
};
exports.getFormattedTime = getFormattedTime;
var getProgress = function (currentTime, duration) {
    if (isNumeric(currentTime) && isNumeric(duration)) {
        return parseFloat((100 * (currentTime / duration)).toString());
    }
    return 0;
};
exports.getProgress = getProgress;
var getCurrentTime = function (progress, duration) {
    if (isNumeric(progress) && isNumeric(duration)) {
        return parseFloat(((progress * duration) / 100).toString());
    }
    return 0;
};
exports.getCurrentTime = getCurrentTime;
var getRemaningTime = function (progress, duration) {
    if (isNumeric(progress) && isNumeric(duration)) {
        return parseFloat((((100 - progress) * duration) / 100).toString());
    }
    return 0;
};
exports.getRemaningTime = getRemaningTime;
var populateDispatch = function (dispatch, player) {
    var funcs = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        funcs[_i - 2] = arguments[_i];
    }
    return funcs.reduce(function (acc, func) {
        acc.push(func(dispatch, player));
        return acc;
    }, []);
};
exports.populateDispatch = populateDispatch;
//# sourceMappingURL=helpers.js.map