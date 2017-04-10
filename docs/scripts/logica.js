'uses strict';

const logica = (() => {

    const animation = {
        fade: [
            { opacity: '0.0' },
            { opacity: '1.0' }
        ],
        slide: [
            { transform: 'translateY(var(--line-wrap)) scale(0.9)' },
            { transform: 'translateY(0px) scale(1)' }
        ]
    }

    const timing = {
        normal: {
            duration: 200,
            direction: 'normal',
            easing: 'ease-out'
        },
        reverse: {
            duration: 400,
            direction: 'reverse',
            easing: 'ease-in'
        }
    };

    const openOverlay = (callback) => {
        qs('body').style.overflowY = 'hidden';
        let overlay = id('overlay');
        overlay.style.display = '';
        if(callback)
            overlay.animate(animation.fade, timing.normal)
                .onfinish = callback;
        return overlay;
    }

    const closeOverlay = (callback) => {
        let overlay = id('overlay');
        qs('body').style.overflowY = 'scroll';
        overlay.animate(animation.fade, timing.reverse)
            .onfinish = () => {
                overlay.style.display = 'none';
                overlay.innerHTML = '';
                if (callback) callback();
            };
        if (overlay.firstElementChild)
            overlay.firstElementChild.animate(animation.slide, timing.reverse);
    }

    var closeOverlayEvent = (event) => {
        if(event.target === event.currentTarget) {
            event.preventDefault();
            closeOverlay();
        }
    }

    id('overlay').on('click', closeOverlayEvent);

    let detailed = (() => {
        let template = id('detailed-post-template');

        const open = (_id) => {

            openOverlay();

            let article = data.getById(_id);
            let content = template.content.cloneNode(true);
            let post = content.querySelector('.card');

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
            post.qs('.content').innerHTML = article.content;
            let tags = '<div>' +  article.tags.join('</div><div>') + '</div>';
            post.qs('.tags').innerHTML = tags;

            id('overlay').appendChild(content);
        }

        // id('post-placeholder').on('click', (event) => {
        //     if (event.target.querySelectorParent('.post-menu')) {
        //         let parent = event.target.querySelectorParent('.post');
        //         if (parent) open(parent.id);
        //     }
        // });
    })();

    /*var addEditForm = (function () {

        var editAddForm = document.getElementById('edit-add-form-template');

        // saving article
        var saveArtice = function (event) {
            var tagsline = document.forms.edit.tags.value;
            tagsline = tagsline.replace('#', ' ');
            var now = new Date();
            var article = {
                id: '' + now.getTime(),
                title: document.forms.edit.caption.value,
                summary: document.forms.edit.summary.value,
                createdAt: now,
                author: authorization.getUser(),
                content: document.forms.edit.content.value,
                tags: tagsline.split(' ')
            }
            var result = dom.add(article);
            var image = document.querySelector('#dragndrop img');
            if (image) article.image = image.src;
            if (result) {
                database.addArticle(article);
                document.querySelector('span.form-button.discard').click();
            } else {
                alert('invalid article');
            }
        }

        // dragndrop emplementation
        function allowDrop(event) {
            event.preventDefault();
        }

        function drop(event) {
            event.preventDefault();
            var path = event.dataTransfer.getData('text');
            var image = document.createElement('img');
            var callback = function (exists) {
                if(exists) {
                    var container = document.querySelector('#dragndrop');
                    container.innerHTML = '';
                    container.appendChild(image);
                } else {
                    alert('only links to images allowed');
                }
            }
            image.onerror = function () { callback(false); };
            image.onload = function () { callback(true); };
            image.src = path;
        }

        // textareas are resizing to fit content
        var resize = function (event) {
            event.currentTarget.style.height = event.currentTarget.scrollHeight +'px';
        }

        // click on wrap / cross button closes the form
        var checkUnsaved = function() {
            return !(document.forms.edit.caption.value === '' &&
                document.forms.edit.summary.value === '' &&
                document.forms.edit.content.value === '' &&
                document.forms.edit.tags.value === '');
        }

        var closeAddEditForm = function (event) {
            var cross = document.querySelector('div.fullscreen-scrollable-wrap div.middle-wrap svg.light-svg');
            var discard = document.querySelector('span.form-button.discard');
            if(event.target === cross || event.target === discard || event.target.parentNode === cross) {
                if (checkUnsaved() && event.target !== discard) alert('unsaved form');
                var fswrap = document.querySelector('div.fullscreen-scrollable-wrap');
                fswrap.removeEventListener('click', closeAddEditForm);
                closeFullscreenWrap(fswrap);
            }
        }

        // plus button opens add form, and sets it's content to default
        var openAddEditForm = function (event) {
            var copy = editAddForm.content.cloneNode(true);
            var form = copy.querySelector('form');

            form.querySelector('.info-bar').innerHTML =
                (new Date()).prettyFormat() + ' by' +
                '<span>' + authorization.getUser() + '</span>';

            var fswrap = openFullscreenWrap();

            fswrap.addEventListener('click', closeAddEditForm);
            linkAddEditFormEvents(copy);
            fswrap.appendChild(copy);
            fswrap.firstElementChild.animate(slide, timing.normal);
        }

        // link all events
        function linkAddEditFormEvents(form) {
            form.getElementById('dragndrop').addEventListener('dragover', allowDrop, false);
            form.getElementById('dragndrop').addEventListener('drop', drop, false);
            form.querySelector('span.form-button.add').addEventListener('click', saveArtice);
            for (var textarea of form.querySelectorAll('textarea')) {
                textarea.addEventListener('keypress', resize);
            }
        }

        return {
            open: openAddEditForm
        }

    })();

    var authorizationForm = (function () {

        var authorizationForm = document.getElementById('authorization-form-template');

        var closeAuthorizationForm = function (event) {
            var form =  event.currentTarget.querySelector('form');
            var button = event.currentTarget.querySelector('form > button');

            if (event.target == button) {
                var login = form.login.value;
                var password = form.password.value;
                firebase.auth().signInWithEmailAndPassword(login, password).then(function () {
                    authorization.changeUser(login.replace(/@.*//*,''));
                    authorization.authorize();
                    var fswrap = document.querySelector('div.fullscreen-scrollable-wrap');
                    fswrap.removeEventListener('click', closeAuthorizationForm);
                    closeFullscreenWrap(fswrap);
                }).catch(function(error) {
                    alert(error.code + ':' + error.message);
                });
            }
        }

        var openAuthorizationForm = function (event) {
            if (authorization.isAuthorized()) {
                firebase.auth().signOut().then(function() {
                    alert('logout');
                    authorization.changeUser(null);
                    authorization.authorize();
                }).catch(function(error) {
                    alert(error.code + ':' + error.message);
                });
            } else {
                var copy = authorizationForm.content.cloneNode(true);
                var form = copy.querySelector('form');

                var fswrap = openFullscreenWrap();

                fswrap.addEventListener('click', closeAuthorizationForm);
                fswrap.appendChild(copy);
                fswrap.firstElementChild.animate(slide, timing.normal);
            }
        }

        return {
            open: openAuthorizationForm
        }

    })();

    var search = function () {
        var filter = {};
        var query = document.forms.searchInput.search.value;
        var tags = query.split(/\s+/).filter(tag => tag.match(/#\w+/));
        if (tags.length) {
            tags = tags.map(tag => tag.replace('#',''));
            filter.tags = tags;
        }

        pagination.applyFilter(filter);
        return false;
    }

    var detailedForm = (function (){

        var detailedForm = document.getElementById('detailed-form-template');

        var closeDetailedForm = function (event) {
            var fswrap = document.querySelector('div.fullscreen-scrollable-wrap');
            if (event.target.matches('span.form-button.add')){

            } else if (event.target.matches('span.form-button.discard')){
                var id =  event.target.querySelectorParent('.middle-content')
                                            .getAttribute('opened-post');
                fswrap.removeEventListener('click', closeDetailedForm);
                alert('post deleted');
                closeFullscreenWrap(fswrap);
                dom.remove(id);
                data.remove(id);
            } else if (event.target.matches('svg.light-svg') ||
                event.target.matches('span.form-button')) {
                fswrap.removeEventListener('click', closeDetailedForm);
                closeFullscreenWrap(fswrap);
            }
        }

        var openDetailedForm = function (article) {
            var copy = detailedForm.content.cloneNode(true);
            post = copy.querySelector('.middle-content');

            post.setAttribute('opened-post', article.id);
            if(article.image) {
                post.querySelector('img').src = article.image;
            } else {
                post.querySelector('img').style.display = 'none';
                post.querySelector('.post-caption').style.marginTop = '15px';
            }
            post.querySelector('.post-caption').innerHTML = article.title;
            post.querySelector('.info-bar').innerHTML =
                article.createdAt.prettyFormat() + ' by' +
                '<span class="link-text">' + article.author + '</span>';
            post.querySelector('.summary').innerHTML = article.summary;
            post.querySelector('.post-content').innerHTML = article.content;
            var tags = '<span class="link-text">' + article.tags.join('</span><span class="link-text">') + '</span>';
            post.querySelector('.tags-line .tags').innerHTML = tags;

            var fswrap = openFullscreenWrap();

            fswrap.addEventListener('click', closeDetailedForm);
            fswrap.appendChild(copy);
            fswrap.firstElementChild.animate(slide, timing.normal);
        }

        return {
            open: openDetailedForm
        }

    })();

    var postPlaceholderEventHandler = function (event) {
        var post = event.target.querySelectorParent('div.post.strong-shadow')
        if (!post) return;
        var id = post.id;
        var article = data.getByIndex(data.getById(id));
        if (event.target.matches('div.post-caption.link-text') ||
            event.target.matches('img')) {
            detailedForm.open(article);
        } else if (event.target.matches('div.info-bar.v-align > span.link-text')) {
            pagination.applyFilter({author: article.author});
        } else if (event.target.matches('div.tags-line.v-align > span.link-text')) {
            pagination.applyFilter({tags: article.tags});
        } else if (event.target.matches('span.tags > span.link-text')) {
            pagination.applyFilter({tags: [event.target.innerText]});
        }
    }

    document.addEventListener('DOMContentLoaded', function (event) {
        // link events
        // document.querySelector('div.fullscreen-scrollable-wrap').addEventListener('click', closeFullscreenWrapEvent);
        document.getElementById('plus').addEventListener('click', addEditForm.open);
        // document.querySelector('header.header.v-align div.v-align').addEventListener('click', authorizationForm.open);
        document.forms.searchInput.onsubmit = search;
        document.querySelector('#post-placeholder').addEventListener('click', postPlaceholderEventHandler);
    });*/

})();
