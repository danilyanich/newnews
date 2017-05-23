'uses strict';

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

const authorize = (username, password) =>
    new Promise((resolve, reject) => {
        if (username && password) {
            if (users[username].password === password) {
                currentUser = username;
                return uiTweak(true);
            }
        }
        return uiTweak(false);
    });

const getUserData = (user) => {
    return {
        avatar: users[user].avatar
    };
};

module.exports = {
    authorize: authorize,
    getUser: getUser,
    getUserData: getUserData,
    isAuthorized: isAuthorized
};
