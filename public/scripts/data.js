'uses strict';

const data = (() => {
    const getMultiple = (pages = {}, filter) =>
        Promise.resolve().then(() => {
            let stringTags = null;
            if (filter && filter.tags)
                stringTags = JSON.stringify(filter.tags);
            let queryObject = Object.assign(
                {},
                pages,
                filter,
                stringTags ? { tags: stringTags } : {}
            );
            return request('GET', '/posts', queryObject);
        })
        .then(checkResponse)
        .then(response => {
            let res = JSON.parse(response.responseText);
            res.pairs.map(pair => {
                pair.article.createdAt = new Date(pair.article.createdAt);
                return pair;
            });
            return res;
        });

    const getById = (id) =>
        request('GET', `/posts/${id}`)
        .then(checkResponse)
        .then(parseResponseText);

    const add = (obj) =>
        request('POST', '/upload', null, obj)
        .then(checkResponse)
        .then(parseResponseText)
        .then(pair => {
            pair.article = obj;
            pair.article.createdAt = new Date(pair.article.createdAt);
            return pair;
        });

    const edit = (id, obj) =>
        request('PATCH', `/upload/${id}`, null, obj)
        .then(checkResponse)
        .then(parseResponseText)
        .then(pair => {
            pair.article = obj;
            pair.article.createdAt = new Date(pair.article.createdAt);
            return pair;
        });

    const remove = () => false;

    return {
        getMultiple: getMultiple,
        getById: getById,
        add: add,
        edit: edit,
        remove: remove
    };
})();
