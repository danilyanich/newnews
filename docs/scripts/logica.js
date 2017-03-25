
var logica = (function () {

    HTMLCollection.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];

    var fade = [
        { opacity: '0.0' },
        { opacity: '1.0' }
    ];

    var slide = [
        { transform: 'translateY(25px) scale(0.9)' },
        { transform: 'translateY(0px) scale(1)' }
    ];

    var timing = {
        normal: {
            duration: 200,
            direction: 'normal',
            easing: 'ease-out'
        },
        reverse: {
            duration: 200,
            direction: 'reverse',
            easing: 'ease-in'
        }
    };

    var openFullscreenWrap = function () {
        document.querySelector('body').style.overflowY = 'hidden';
        var fswrap = document.querySelector('div.fullscreen-scrollable-wrap');
        fswrap.style.display = 'flex';
        fswrap.animate(fade, timing.normal);
        return fswrap;
    }

    var closeFullscreenWrap = function(fswrap, callback) {
        document.querySelector('body').style.overflowY = 'scroll';
        fswrap.animate(fade, timing.reverse);
        fswrap.firstElementChild.animate(slide, timing.reverse)
            .onfinish = function () {
                fswrap.style.display = 'none';
                fswrap.innerHTML = '';
            };
    }

    var closeFullscreenWrapEvent = function (event) {
        var fswrap = document.querySelector('div.fullscreen-scrollable-wrap');
        var mwrap = document.querySelector('div.fullscreen-scrollable-wrap div.middle-wrap');

        if(event.target === fswrap || event.target === mwrap) {
            event.preventDefault();
            closeFullscreenWrap(fswrap);
        }
    }

    var addEditForm = (function () {

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
                    authorization.changeUser(login.replace(/@.*/g,''));
                    authorization.authorize();
                    var fswrap = document.querySelector('div.fullscreen-scrollable-wrap');
                    fswrap.removeEventListener('click', closeAuthorizationForm);
                    closeFullscreenWrap(fswrap);
                }).catch(function(error) {
                    alert(error.code + ':' + error.message);
                });
            }
        }

        var linkEvents = function (form) {
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
                linkEvents(copy);
                fswrap.appendChild(copy);
                fswrap.firstElementChild.animate(slide, timing.normal);
            }
        }

        return {
            open: openAuthorizationForm
        }

    })();

    var pass = document.querySelector('#post-placeholder').firstElementChild;
    var niceReveal = function (event) {
        if(!pass) pass = document.querySelector('#post-placeholder').firstElementChild;
        else {
            if (pass.getBoundingClientRect().bottom < window.innerHeight) {
                pass.firstElementChild.style.display = 'block';
                if (pass.nextElementSibling && pass.nextElementSibling.classList.contains('post-wrap'))
                    pass = pass.nextElementSibling;
            }
        }
    }
    window.addEventListener('scroll', niceReveal);

    document.addEventListener('DOMContentLoaded', function (event) {
        // link events
        document.querySelector('div.fullscreen-scrollable-wrap').addEventListener('click', closeFullscreenWrapEvent);
        document.getElementById('plus').addEventListener('click', addEditForm.open);
        document.querySelector('header.header.v-align div.v-align').addEventListener('click', authorizationForm.open);
    });

})();
