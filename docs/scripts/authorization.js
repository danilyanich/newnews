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

    var openAuthorizationForm = function (event) {
        
    }

    var getUser = function () {
        return user.toString();
    }

    document.addEventListener('DOMContentLoaded', function(event) {
        document.querySelector('header.header.v-align div.v-align')
            .addEventListener('click', function(event){
                alert('authorize dankr');
                changeUser('dankr');
            });
        authorize();
    });

    return {
        authorize: authorize,
        changeUser: changeUser,
        getUser: getUser
    }
})();
