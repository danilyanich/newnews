var database = (function () {
    // initialize database
    document.addEventListener('DOMContentLoaded', function (event) {
        firebase.database().ref('/posts/').once('value').then(function (snapshot) {
            dom.clear();
            var articles = snapshot.val();
                for(var index in articles) {
                articles[index].createdAt = new Date(parseInt(articles[index].createdAt));
                articles[index].id = index;
                dom.add(articles[index]);
            }
        })
    })

    var addArticle = function (post) {
        var copy = deepCopy(post);
        delete copy.id;
        copy.createdAt = copy.createdAt.getTime();
        firebase.database().ref('/posts/' + post.id).set(copy);
    }

    return {
        addArticle: addArticle
    }
})();