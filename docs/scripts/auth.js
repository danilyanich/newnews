'uses strict';

const authorization = (() => {

    let user = null;

    const users = {
        'danilyanich': 'keklol',
        'admin': 'admin'
    }

    const authorize = (username, password) => {
        if (username && password)
            if (users[username] === password)
                user = username;
    }

    const getUser = () => {
        return user.toString();
    }

    const isAuthorized = () => {
        return user !== null;
    }

    return {
        authorize: authorize,
        getUser: getUser,
        isAuthorized: isAuthorized
    }

})();
