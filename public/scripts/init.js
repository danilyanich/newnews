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


const id = (_id) => {
    return document.getElementById(_id);
};

const on = document.addEventListener;

const marcoTask = (callback) => {
    setTimeout(callback, 0);
};

const objectToQuery = (object) => {
    let string = '?';
    Object.keys(object).forEach(key => {
        string += `${key}=${object[key]}&`;
    });
    return string;
};

const request = (method, url, query, json) =>
    new Promise((resolve, reject) => {
        let req = new XMLHttpRequest();
        let queryString = null;
        if (query) queryString = objectToQuery(query);
        req.open(method, url + (queryString || ''));
        req.onload = event => resolve(event.target);
        req.onabort = event => reject(event.target);
        if (json) {
            req.setRequestHeader('content-type', 'application/json');
            req.send(JSON.stringify(json));
        } else req.send();
    });

const checkResponse = (response) =>
    new Promise((resolve, reject) => {
        if (response.status !== 200)
            reject(new Error(`request ${response.responseURL} failed`));
        else resolve(response);
    });

const parseResponseText = (response) =>
    JSON.parse(response.responseText);
