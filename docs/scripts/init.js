'uses strict';

Date.prototype.getMonthName = function getMonthName() {
    return Date.locale.month_names[this.getMonth()];
};

Date.prototype.prettyFormat = function prettyFormat() {
    return this.getDate() + ' ' + this.getMonthName() + ' ' + this.getHours() + ':' + this.getMinutes();
};

Date.locale = {
    month_names: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
};

Object.deepCopy = (object) => {
    let copy = {};
    copy = Object.assign(copy, object);
    return copy;
};

HTMLCollection.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];

HTMLElement.prototype.querySelectorParent = function querySelectorParent(query) {
    let element = this;
    while (element) {
        if (!element.matches)
            return false;
        if (element.matches(query))
            return element;
        element = element.parentNode;
    }
    return false;
};

HTMLElement.prototype.qs = HTMLElement.prototype.querySelector;
HTMLElement.prototype.qsA = HTMLElement.prototype.querySelectorAll;
HTMLElement.prototype.on = HTMLElement.prototype.addEventListener;

const qs = (query) => {
    return document.querySelector(query);
};

const qsA = (query) => {
    return document.querySelectorAll(query);
};


const id = (id) => {
    return document.getElementById(id);
};

const on = document.addEventListener;

const marcoTask = (callback) => {
    setTimeout(callback, 0);
};
