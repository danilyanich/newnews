'uses strict';

Date.prototype.getMonthName = function() {
    return Date.locale.month_names[this.getMonth()];
};

Date.prototype.prettyFormat = function () {
    return this.getDate() + ' ' + this.getMonthName() + ' ' + this.getHours() + ':' + this.getMinutes();
};

Date.locale = {
    month_names: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};

Object.deepCopy = function (object) {
    let copy = new Object();
    copy = Object.assign(copy, object);
    return copy;
};

HTMLCollection.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];

HTMLElement.prototype.querySelectorParent = function (query) {
    let element = this;
    while (element) {
        if (!element.matches) return;
        if (element.matches(query))
            return element;
        element = element.parentNode;
    }
}

HTMLElement.prototype.qs = HTMLElement.prototype.querySelector;
HTMLElement.prototype.qsA = HTMLElement.prototype.querySelectorAll;
HTMLElement.prototype.on = HTMLElement.prototype.addEventListener;

const qs = (query) => {
    return document.querySelector(query);
}

const id = (id) => {
    return document.getElementById(id);
}

const on = document.addEventListener;

const marcoTask = (callback) => {
    setTimeout(callback, 0);
}
