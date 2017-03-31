
Date.prototype.getMonthName = function() {
    return Date.locale.month_names[this.getMonth()];
};

Date.prototype.prettyFormat = function () {
    return this.getDate() + ' ' + this.getMonthName().toUpperCase() + ' ' + this.getHours() + ':' + this.getMinutes();
};

Date.locale = {
    month_names: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};

Object.deepCopy = function (object) {
    var copy = new Object();
    copy = Object.assign(copy, object);
    return copy;
};

var data = (function () {

    var articles = [];

    var example = [
        {
            id: '1489693022074',
            image: '/home/danilyanich/Pictures/Плюхи/9d2af8140f1d9dd93a9c7b134aaf8bd5.jpg',
            title: 'title',
            summary: 'summary',
            createdAt: new Date(1489693022074),
            author: 'danilyanich',
            content: 'content',
            tags: ['tag1', 'tag2', 'tag3']
        },{
            id: '1489693022075',
            image: '/home/danilyanich/Pictures/Плюхи/tumblr_mvs201ekjt1r46py4o1_1280.jpg',
            title: 'title',
            summary: 'Lorem ipsum dolor sit amet var sortArticles = function (articles) { articles.sort(function(obj1, obj2) {return obj2.createdAt - obj1.createdAt; }',
            createdAt: new Date(),
            author: 'danilyanich',
            content: 'content',
            tags: ['tag1', 'tag2', 'tag3']
        },{
            id: '1489693022076',
            image: '/home/danilyanich/Pictures/Плюхи/original.jpg',
            title: 'title',
            summary: 'summary',
            createdAt: new Date(),
            author: 'danilyanich',
            content: 'content',
            tags: ['tag1', 'tag2', 'tag3']
        }
    ];

    for (var i = 0; i < 11; i++) {
        var date = loremIpsum.randomDate(new Date('2016-01-01'), new Date());
        example.push({
            id: '' + date.getTime(),
            image: '/home/danilyanich/Pictures/Плюхи/original.jpg',
            title:  '' + i + ' ' + loremIpsum.generate(3),
            summary: loremIpsum.generate(10),
            createdAt: date,
            author: 'danilyanich',
            content: loremIpsum.generate(200),
            tags: [loremIpsum.generate(1, 20), loremIpsum.generate(1, 20), loremIpsum.generate(1, 20)]
        })
    }

    var addExample = function () {
        articles = example;
    }

    var sortArticles = function (articles) {
        articles.sort(function(obj1, obj2) {
            return obj2.createdAt - obj1.createdAt;
        });
    }

    var getMultiple = function (pages, filter) {
        pages = pages || new Object();
        pages.offset = pages.offset || 0;
        pages.count =  pages.count || 10;
        if (pages.all) {
            pages.offset = 0;
            pages.count = articles.length;
        }
        var slice = articles.slice();
        if (filter) {
            if (filter.author) {
                slice = slice.filter(function (article) {
                    return article.author === filter.author;
                });
            }
            if (filter.tags) {
                slice = slice.filter(function (article) {
                    var tagsIntersect = filter.tags.filter(function(tag) {
                        return article.tags.some(function (element) {
                            return element.toLowerCase() === tag.toLowerCase();
                        });
                    });
                    return tagsIntersect.length > 0;
                });
            }
            if (filter.date) {
                slice = slice.filter(function (article) {
                    return article.createdAt === filter.date;
                });
            }
        }
        sortArticles(slice);
        return slice.slice(pages.offset, pages.offset + pages.count);
    }

    var getById = function (id) {
        return articles.findIndex(function (article) {
            return article.id === id;
        })
    }

    var validator = {
        id: x => x && typeof(x) === 'string',
        title: x => x && typeof(x) === 'string' && x.length < 100,
        summary: x => x && typeof(x) === 'string' && x.length < 200,
        createdAt: x => x && x instanceof Date && x != 'Invalid date',
        author: x => x && typeof(x) === 'string',
        content: x => x && typeof(x) === 'string',
    }

    var isValid = function (obj) {
        if (!obj) return false;
        for (check in validator)
            if (!validator[check](obj[check]))
                return false;
        return true;
    }

    var add = function (obj) {
        if (!isValid(obj)) return false;
        articles.push(obj);
        sortArticles(articles);
        return true;
    }

    var edit = function (id, obj) {
        var index = getById(id);
        var article = deepCopy(articles[index]);
        if (!article) return false;
        var changed = Object.assign(article, obj);
        if (!isValid(changed) ||
            changed.id !== article.id) return false;
        articles[index] = changed;
        return true;
    }

    var remove = function (id) {
        var index = getById(id);
        if (index !== -1) {
            delete articles[index];
            articles.splice(index);
            return true;
        }
        return false;
    }

    var getByIndex = function (index) {
        return articles[index];
    }

    var size = function () {
        return articles.length;
    }

    var refresh = function () {
        handle.innerHTML = '';
        for (var i = 0; i < articles.length; i++) {
            handle.appendChild(makePostHTML(articles[i]));
        }
    }

    return {
        getMultiple: getMultiple,
        getById: getById,
        getByIndex: getByIndex,
        articleAt: getByIndex,
        isValid: isValid,
        add: add,
        edit: edit,
        remove: remove,
        refresh: refresh,
        example: addExample,
        size: size
    };
})();

var dom = (function () {

    var template = null;
    var handle = null;

    document.addEventListener('DOMContentLoaded', function(event) {
        template = document.getElementById('post-template');
        handle = document.getElementById('post-placeholder');
    });

    var makePostHTML = function (article) {
        var postWrap = template.content.cloneNode(true);
        post = postWrap.querySelector('.post');

        post.id = article.id;
        if(article.image)
            post.querySelector('img').src = article.image;
        else {
            post.querySelector('img').style.display = 'none';
            post.querySelector('.post-caption').style.marginTop = '15px';
        }
        post.querySelector('.post-caption').innerHTML = article.title;
        post.querySelector('.info-bar').innerHTML =
            article.createdAt.prettyFormat() + ' by' +
            '<span class="link-text">' + article.author + '</span>';
        post.querySelector('.summary').innerHTML = article.summary;
        var tags = '<span class="link-text">' +  article.tags.join('</span><span class="link-text">') + '</span>';
        post.querySelector('.tags-line .tags').innerHTML = tags;

        return postWrap;
    }

    var remove = function (id) {
        var postWrap = document.getElementById(id).parentNode;
        if (postWrap) postWrap.parentNode.removeChild(postWrap);
    }

    var clear = function () {
        handle.innerHTML = '';
    }

    var display = function(articles) {
        clear();
        for (article of articles) {
            handle.appendChild(
                makePostHTML(article)
            );
        }
    }

    var add = function (article, way) {
        if (data.isValid(article)) {
            if (way && way === 'append'){
                handle.appendChild(makePostHTML(article));
            } else {
                handle.insertBefore(
                    makePostHTML(article),
                    handle.firstChild
                );
            }
            return true;
        }
        return false;
    }

    return {
        remove: remove,
        display: display,
        clear: clear,
        add: add
    };
})();
