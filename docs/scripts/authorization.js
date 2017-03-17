var authorization = (function () {
    var user = null;

    var changeUser = function (username) {
        user = username || null;
        authorize();
    }

    var authorize = function (event) {
        if (user) {
            document.querySelector('header.header.v-align div.v-align .username').innerHTML = user;
            document.getElementById('plus').style.display = 'flex';
        } else {
            document.querySelector('header.header.v-align div.v-align .username').innerHTML = 'authorize';
            document.getElementById('plus').style.display = 'none';
        }
    }

    var getUser = function () {
        return user.toString();
    }

    var isAuthorized = function () {
        return user !== null;
    }

    document.addEventListener('DOMContentLoaded', function(event) {
        authorize();
    });

    return {
        authorize: authorize,
        changeUser: changeUser,
        getUser: getUser,
        isAuthorized: isAuthorized
    }
})();
