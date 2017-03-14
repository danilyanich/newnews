
Date.prototype.getMonthName = function() {
    return Date.locale.month_names[this.getMonth()];
};
Date.prototype.prettyFormat = function () {
    return this.getDate() + ' ' + this.getMonthName().toUpperCase() + ' ' + this.getHours() + ':' + this.getMinutes();
};
Date.locale = {
    month_names: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};
Object.prototype.deepCopy = function () {
    var copy = new Object();
    copy = Object.assign(copy, this);
    return copy;
};

var data = (function () {

    var articles = []

    for(var i = 0; i < 15; i++) {
        var article = {
            id: '' + i,
            image: 'img/' + (i + 1) + '.jpg',
            title: loremIpsum.generate(5, null, {capital: true, dots: false}),
            summary: loremIpsum.generate(15 + Math.random()*30),
            createdAt: loremIpsum.randomDate(new Date(2017,1,0), new Date()),
            author: loremIpsum.generate(2, null, {dots: false, capital: true}),
            content: loremIpsum.generate(10 + Math.random()*36),
            tags: [loremIpsum.generate(1,10), loremIpsum.generate(1, 10),  loremIpsum.generate(1, 10), loremIpsum.generate(1)]
        }
        articles[i] = article;
    }

    var sortArticles = function (array) {
        array.sort(function(obj1, obj2){
            return obj1.createdAt - obj2.createdAt;
        });
    }

    var getMultiple = function (pages, filter) {
        pages = pages || new Object();
        pages.offset = pages.offse || 0;
        pages.count =  pages.count || 10;
        var slice = articles.slice();
        if(filter) {
            if(filter.all) pages.count = articles.length;
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

    var isValid = function (obj) {
        result = obj.id && typeof(obj.id) ===  'string';
        result = result && obj.title && typeof(obj.title) ===  'string' && obj.title.length < 100;
        result = result && obj.summary && typeof(obj.summary) ===  'string' && obj.title.length < 200;
        result = result && obj.createdAt && obj.createdAt instanceof Date;
        result = result && obj.author && typeof(obj.author) ===  'string';
        result = result && obj.content && typeof(obj.content) ===  'string';
        return result;
    }

    var add = function (obj) {
        if (!isValid(obj)) return false;
        articles.push(obj);
        return true;
    }

    var edit = function (id, obj) {
        var index = getById(id);
        var article = articles[index].deepCopy();
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
        refresh: refresh
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
        var post = document.getElementById(id);
        if (post) post.parentNode.remove();
    }

    var clear = function () {
        handle.innerHTML = '';
    }

    var display = function(articles) {
        clear();
        for (article of articles) {
            handle.insertBefore(
                makePostHTML(article),
                handle.firstChild
            );
        }
    }

    var add = function (article) {
        if (data.add(article)) {
            handle.insertBefore(
                makePostHTML(article),
                handle.firstChild
            );
        }
    }

    return {
        remove: remove,
        display: display,
        clear: clear,
        add: add
    };
})();

document.addEventListener('DOMContentLoaded', function(event) {
    var somepost = {
        id: '100',
        title: 'title',
        summary: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        createdAt: new Date(),
        author: 'dan kr',
        content: 'olololollollolollo',
        tags: ['kek', 'lol']
    }
    var otherpost = {
        title: 'new title',
        createdAt: new Date(),
        author: 'dan kr',
        content: 'Ooops!',
        tags: ['kek', 'lol', 'foo', 'bar']
    }
    console.log(data.getMultiple());
    console.log(data.getMultiple(null, {tags: ['lorem', 'ipsum', 'dolor', 'sit', 'amet']}));
    console.log(data.getMultiple({offset: 2, count: 5}));
    console.log(data.add(somepost));
    console.log(data.getMultiple(null, {tags: ['kek']}));
    console.log(data.edit('100', otherpost));
    console.log(data.getMultiple(null, {author: 'dan kr'}));
    console.log(data.remove('100'));
    console.log(data.getMultiple(null, {author: 'dan kr'}));
    console.log(data.getMultiple(null, null));

    console.log(data.add(somepost));
    console.log(dom.clear());
    console.log(dom.display(data.getMultiple(null, {all: true})));
});
