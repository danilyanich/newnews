
function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

var articles = []
var tags = new Set();

for(var i = 0; i < 20; i++) {
    var article = {
        id: ''+i,
        title: generateLoremIpsum(5),
        summary: generateLoremIpsum(10),
        createdAt: randomDate(new Date(2017,1,0), new Date()),
        author: generateLoremIpsum(2),
        content: generateLoremIpsum(50),
        tags: [generateLoremIpsum(1, 20), generateLoremIpsum(1, 20)]
    }
    articles[i] = article;
    for(tag of article.tags)
        tags.add(tag);
}

function sortArticles(array) {
    array.sort(function(obj1, obj2){
        return obj1.createdAt - obj2.createdAt;
    });
}

sortArticles(articles);

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

console.log(articles);
console.log(tags);
console.log(getArticles(null, {tags: ['lorem', 'ipsum']}));
console.log(getArticles({offset: 2, count: 5}));
console.log(addArticle({
    id: '100',
    title: 'title',
    summary: 'lorem ipsum',
    createdAt: new Date(),
    author: 'dan kr',
    content: 'olololollollolollo',
    tags: ['kek', 'lol']
}));
console.log(getArticles(null, {author: 'dan kr'}));
console.log(editArticle("100", {
    id: '100',
    title: 'new title',
    summary: 'lorem ipsum',
    createdAt: new Date(),
    author: 'dan kr',
    content: 'Ooops!',
    tags: ['kek', 'lol', 'foo', 'bar']
}));
console.log(getArticles(null, {author: 'dan kr'}));
console.log(removeArticle('100'));
console.log(getArticles(null, {author: 'dan kr'}));
console.log(getArticles(null, null));
