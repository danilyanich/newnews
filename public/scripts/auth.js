'uses strict';

const auth = (() => {
    let currentUser = null;

    const users = {
        'danilyanich': {
            password: 'keklol',
            avatar: 'https://lh3.googleusercontent.com/-z3GchwNOeWI/Uzmi-PIwKAI/AAAAAAAABP4/3pFszaKio_EOnsGIVdvin9C5_wIwQ0luwCEw/w139-h140-p/RLa_CZvWdpY.jpg'
        },
        'admin': {
            password: 'admin',
            avatar: 'https://ssl.gstatic.com/images/branding/product/1x/avatar_square_blue_512dp.png'
        },
        'Google': {
            password: 'goo.gl',
            avatar: 'https://i.stack.imgur.com/Ga0da.png'
        }
    };

    const uiTweak = (show) => {
        if (show) {
            [].forEach.call(qsA('.button.post-menu'), menu => {
                menu.style.display = '';
            });
            qs('.wrap.add-form-wrap').style.display = '';
            qs('form .add-form-glimpse .avatar').src = getUser().avatar;
        } else {
            [].forEach.call(qsA('.button.post-menu'), menu => {
                menu.style.display = 'none';
            });
            qs('.wrap.add-form-wrap').style.display = 'none';
        }
        return show;
    };

    const authorize = (username, password) => {
        if (username && password && users[username]) {
            if (users[username].password === password) {
                currentUser = username;
                return uiTweak(true);
            }
        }
        return uiTweak(false);
    };

    const getUser = () => {
        if (currentUser) {
            return {
                user: currentUser,
                avatar: users[currentUser].avatar
            };
        }
        return false;
    };

    const getUserData = (user) => {
        return {
            avatar: users[user].avatar
        };
    };

    const isAuthorized = () => {
        return currentUser !== null;
    };

    return {
        authorize: authorize,
        getUser: getUser,
        getUserData: getUserData,
        isAuthorized: isAuthorized
    };
})();
