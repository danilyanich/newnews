'uses strict';

const dom = (() => {

    const template = id('post-template');
    const handle = id('post-placeholder');

    const makePostHTML = (pair) => {
        let postWrap = template.content.cloneNode(true);
        postWrap.id = pair.id;
        post = postWrap.querySelector('.card');

        let article = pair.article;

        if (article.image)
            post.qs('img').src = article.image;
        else {
            post.qs('img').style.display = 'none';
            post.qs('.title').classList.add('dark');
            post.qs('.title').classList.add('no-image');
        }
        post.qs('.title').innerHTML = article.title;
        post.qs('.info').innerHTML = '<span class="author">' + article.author + '</span>' +
            article.createdAt.prettyFormat();
        post.qs('.summary').innerHTML = article.summary;
        let tags = '<div>' +  article.tags.join('</div><div>') + '</div>';
        post.qs('.tags').innerHTML = tags;

        return postWrap;
    }

    const remove = (id) => {
        Error();
        let postWrap = id(id).parentNode;
        if (postWrap) postWrap.parentNode.removeChild(postWrap);
    }

    const clear = () => {
        handle.innerHTML = '';
    }

    const display = (pairs) => {
        for (pair of pairs) {
            handle.appendChild(
                makePostHTML(pair)
            );
        }
    }

    const add = (id, article, way) => {
        let pair = {
            id: id,
            article: article
        }
        if (way && way === 'append'){
            handle.appendChild(makePostHTML(pair));
        } else {
            handle.insertBefore(
                makePostHTML(pair),
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
