'uses strict';

const auth = (() => {
    let currentUser = null;

    const uiTweak = (show) => {
        if (show) {
            [].forEach.call(qsA('.button.post-menu'), menu => {
                menu.style.display = '';
            });
            qs('.wrap.add-form-wrap').style.display = '';
            qs('form .add-form-glimpse .avatar').src = currentUser.avatar;
        } else {
            [].forEach.call(qsA('.button.post-menu'), menu => {
                menu.style.display = 'none';
            });
            qs('.wrap.add-form-wrap').style.display = 'none';
        }
        return show;
    };

    const authorize = (username, password) =>
        request('PUT', '/login', null, {
            username: username,
            password: password
        })
        .then(checkResponse)
        .then(parseResponseText)
        .then(user => {
            currentUser = user;
            uiTweak(true);
            return user;
        })
        .catch(err => {
            uiTweak(false);
            throw new Error('invalid username or password');
        });

    const getUserData = (username) =>
        request('GET', `/user/${username}`)
        .then(checkResponse)
        .then(parseResponseText);

    const getUser = () => currentUser;

    const logout = () =>
        request('PUT', '/goodbye')
        .then(() => uiTweak(false))
        .catch();

    return {
        authorize: authorize,
        getUser: getUser,
        getUserData: getUserData,
        logout: logout
    };
})();
