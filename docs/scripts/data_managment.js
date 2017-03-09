
var articlesHandle = (function () {

    var sortArticles = function (array) {
        array.sort(function(obj1, obj2){
            return obj1.createdAt - obj2.createdAt;
        });
    }

    var articles = []
    var tags = new Set();

    Date.prototype.getMonthName = function() {
        return Date.locale.month_names[this.getMonth()];
    };
    Date.prototype.prettyFormat = function () {
        return this.getDay() + ' ' + this.getMonthName().toUpperCase() + ' ' + this.getHours() + ':' + this.getMinutes();
    };
    Date.locale = {
        month_names: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    };

    for(var i = 0; i < 15; i++) {
        var a = {
            id: '' + i,
            image: 'img/' + (i + 1) + '.jpg',
            title: loremIpsum.generate(5, null, {capital: true, dots: false}),
            summary: loremIpsum.generate(15 + Math.random()*30),
            createdAt: loremIpsum.randomDate(new Date(2017,1,0), new Date()),
            author: loremIpsum.generate(2, null, {dots: false, capital: true}),
            content: loremIpsum.generate(10 + Math.random()*36),
            tags: [loremIpsum.generate(1), loremIpsum.generate(1),  loremIpsum.generate(1), loremIpsum.generate(1)]
        }
        articles[i] = a;
        for(tag of a.tags)
            tags.add(tag);
    }

    sortArticles(articles);

    var template = document.getElementById('post-template');
    var handle = document.getElementById('post-placeholder');

    var makePostHTML = function (article) {
        var postWrap = template.cloneNode(true).querySelector('.post-wrap');
        post = postWrap.querySelector('.post');

        post.id = article.id;
        post.querySelector('img').src = article.image;
        post.querySelector('.post-caption').innerHTML = article.title;
        post.querySelector('.info-bar').innerHTML =
            article.createdAt.prettyFormat() + ' by' +
            '<span>' + article.author + '</span>';
        post.querySelector('.summary').innerHTML = article.summary;
        post.querySelector('.tags-line .tags').innerHTML = article.tags.join(' ');

        return postWrap;
    }

    for (var i = 0; i < 15; i++) {
        handle.appendChild(makePostHTML(articles[i]));
    }

    var getArticles = function (pages, filter) {
        if(!pages) pages = new Object();
        if(!pages.offset) pages.offset = 0;
        if(!pages.count) pages.count = 10;
        var slice = articles.slice();
        if(filter) {
            if (filter.author) {
                slice = slice.filter(function (article) {
                    return article.author === filter.author;
                });
            }
            if (filter.tags) {
                slice = slice.filter(function (article) {
                    var tagsIntersect = filter.tags.filter(function(n) {
                        return article.tags.indexOf(n) !== -1;
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

    var getArticle = function (id) {
        return articles.findIndex(function (article) {
            return article.id === id;
        })
    }

    var validateArticle = function (obj) {
        result = obj.id && typeof(obj.id) ===  'string';
        result = result && obj.title && typeof(obj.title) ===  'string' && obj.title.length < 100;
        result = result && obj.summary && typeof(obj.summary) ===  'string' && obj.title.length < 200;
        result = result && obj.createdAt && obj.createdAt instanceof Date;
        result = result && obj.author && typeof(obj.author) ===  'string';
        result = result && obj.content && typeof(obj.content) ===  'string';
        return result;
    }

    var addArticle = function (obj) {
        if (!validateArticle(obj)) return false;
        articles.push(obj);
        for(tag of obj.tags)
            tags.add(tag);
        sortArticles(articles);
    }

    var editArticle = function (id, obj) {
        var index = getArticle(id);
        var article = articles[index];
        if (!article) return false;
        var changed = Object.assign(article, obj);
        if (!validateArticle(changed) ||
            changed.id !== article.id) return false;
        articles[index] = changed;
        return true;
    }

    var removeArticle = function (id) {
        var index = getArticle(id);
        if (index !== -1) {
            articles.splice(index);
            return true;
        }
        return false;
    }

    return {
        getMultiple: getArticles,
        getById: getArticle,
        isValid: validateArticle,
        add: addArticle,
        edit: editArticle,
        remove: removeArticle,
        tags: tags,
        makePostHTML: makePostHTML
    };
})();

console.log(articlesHandle.getMultiple());
console.log(articlesHandle.tags);
console.log(articlesHandle.getMultiple(null, {tags: ['lorem', 'ipsum']}));
console.log(articlesHandle.getMultiple({offset: 2, count: 5}));
console.log(articlesHandle.add({
    id: '100',
    title: 'title',
    summary: 'lorem ipsum',
    createdAt: new Date(),
    author: 'dan kr',
    content: 'olololollollolollo',
    tags: ['kek', 'lol']
}));
console.log(articlesHandle.getMultiple(null, {tags: ['kek']}));
console.log(articlesHandle.edit("100", {
    id: '100',
    title: 'new title',
    summary: 'lorem ipsum',
    createdAt: new Date(),
    author: 'dan kr',
    content: 'Ooops!',
    tags: ['kek', 'lol', 'foo', 'bar']
}));
console.log(articlesHandle.getMultiple(null, {author: 'dan kr'}));
console.log(articlesHandle.remove('100'));
console.log(articlesHandle.getMultiple(null, {author: 'dan kr'}));
console.log(articlesHandle.getMultiple(null, null));
