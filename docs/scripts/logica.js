
var logica = (function () {

    HTMLCollection.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];

    document.addEventListener('DOMContentLoaded', function (event) {



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
            var image = document.querySelector('#dragndrop img');
            if (image) article.image = image.src;
            var result = dom.add(article);
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
            var img = document.createElement('img');
            img.src = path;
            event.currentTarget.innerHTML = '';
            event.currentTarget.appendChild(img);
        }



        // textareas are resizing to fit content
        var resize = function (event) {
            event.currentTarget.style.height = event.currentTarget.scrollHeight +'px';
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



        // click on wrap / cross button closes the form
        var checkUnsaved = function() {
            return !(document.forms.edit.caption.value === '' &&
                document.forms.edit.summary.value === '' &&
                document.forms.edit.content.value === '' &&
                document.forms.edit.tags.value === '');
        }

        var closeForm = function (event) {
            var fswrap = document.querySelector('div.fullscreen-scrollable-wrap');
            var mwrap = document.querySelector('div.fullscreen-scrollable-wrap div.middle-wrap');
            var cross = document.querySelector('div.fullscreen-scrollable-wrap div.middle-wrap svg.light-svg');
            var discard = document.querySelector('span.form-button.discard');
            if(event.target === fswrap || event.target === mwrap || event.target === cross || event.target === discard) {
                if (checkUnsaved() && event.target !== discard) alert('unsaved form');
                document.querySelector('body').style.overflowY = 'scroll';
                fswrap.style.display = 'none';
                fswrap.innerHTML = '';

                document.querySelector('div.fullscreen-scrollable-wrap').removeEventListener('click', closeForm);
            }
        }



        // plus button opens add form, and sets it's content to default
        var editAddForm = document.getElementById('edit-add-form-template');

        var openForm = function (event) {
            var copy = editAddForm.content.cloneNode(true);
            var form = copy.querySelector('form');

            form.querySelector('.info-bar').innerHTML =
                (new Date()).prettyFormat() + ' by' +
                '<span>' + authorization.getUser() + '</span>';

            document.querySelector('body').style.overflowY = 'hidden';
            var fswrap = document.querySelector('div.fullscreen-scrollable-wrap');
            fswrap.style.display = 'flex';
            fswrap.addEventListener('click', closeForm);
            linkAddEditFormEvents(copy);
            fswrap.appendChild(copy);
        }

        document.getElementById('plus').addEventListener('click', openForm);
    });
})();
