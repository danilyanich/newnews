'uses strict';

const auth = (() => {

    let currentUser = null;

    const users = {
        'danilyanich': {
            password: 'keklol',
            avatar: '/home/danilyanich/Pictures/Плюхи/RLa_CZvWdpY.jpg'
        },
        'admin': {
            password: 'admin',
            avatar: '/home/danilyanich/Pictures/Плюхи/ypiZHcy.jpg'
        },
        'Google': {
            password: 'goo.gl',
            avatar: '/home/danilyanich/Pictures/Плюхи/14098534854720.gif'
        }
    }

    const authorize = (username, password) => {
        if (username && password)
            if (users[username] === password)
                currentUser = username;
    }

    const getUser = () => {
        return {
            user: currentUser,
            avatar: users[currentUser].avatar
        }
    }

    const getUserData = (user) => {
        return {
            avatar: users[user].avatar
        }
    }

    const isAuthorized = () => {
        return currentUser !== null;
    }

    return {
        authorize: authorize,
        getUser: getUser,
        getUserData: getUserData,
        isAuthorized: isAuthorized
    }

})();
