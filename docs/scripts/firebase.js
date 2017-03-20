var database = (function () {
    // initialize database
    document.addEventListener('DOMContentLoaded', function (event) {
        firebase.database().ref('/posts/').once('value').then(function (snapshot) {
            var articles = snapshot.val();
                for(var index in articles) {
                articles[index].createdAt = new Date(parseInt(articles[index].createdAt));
                articles[index].id = index;
                data.add(articles[index]);
            }
            dom.display(data.getMultiple({offset: 0, count: 6}));

            var pass = document.querySelector('#post-placeholder').firstElementChild;
            var niceReveal = function (event) {
                if (pass.getBoundingClientRect().bottom < window.innerHeight + 100) {
                    pass.firstElementChild.style.display = 'block';
                    if (pass.nextElementSibling && pass.nextElementSibling.classList.contains('post-wrap'))
                        pass = pass.nextElementSibling;
                }
            }
            niceReveal();

            window.addEventListener('scroll', niceReveal);
        });
    });

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
