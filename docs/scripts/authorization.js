var authorization = (function () {
    var user = null;

    var changeUser = function (username) {
        user = username || null;
    }

    var authorize = function (event) {
        event.currentTarget.querySelector('.username').innerHTML = user || 'authorize';
    }

    document.addEventListener('DOMContentLoaded', function(event) {
        document.querySelector('header.header.v-align div.v-align')
            .addEventListener('click', authorize);
    });

    return {
        authorize: authorize,
        changeUser: changeUser
    }
})();
