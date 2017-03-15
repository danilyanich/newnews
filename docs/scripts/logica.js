
var logica = (function () {

    HTMLCollection.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];

    document.addEventListener('DOMContentLoaded', function (event) {

        // plus button opens add form, and sets it's content to default
        var openForm = function (event) {
            document.querySelector('body').style.overflowY = 'hidden';
            document.querySelector('div.fullscreen-scrollable-wrap').style.display = 'flex';
            document.forms.edit.querySelector('.info-bar').innerHTML = (new Date()).prettyFormat() + ' by' +
            '<span>' + authorization.getUser() + '</span>';
            document.forms.edit.caption.value = '';
            document.forms.edit.summary.value = '';
            document.forms.edit.content.value = '';
            document.forms.edit.tags.value = '';
        }
        document.getElementById('plus').addEventListener('click', openForm);

        // textareas are resizing to fit content
        var resize = function (event) {
            event.currentTarget.style.height = event.currentTarget.scrollHeight +'px';
        }
        for (var textarea of document.querySelectorAll('textarea')) {
            textarea.addEventListener('keypress', resize);
        }

        // saving article
        var saveArtice = function (event) {
            var tagsline = document.forms.edit.tags.value;
            tagsline = tagsline.replace('#', ' ');
            var article = {
                id: '' + (new Date()).getTime(),
                title: document.forms.edit.caption.value,
                summary: document.forms.edit.summary.value,
                createdAt: new Date(),
                author: authorization.getUser(),
                content: document.forms.edit.content.value,
                tags: tagsline.split(' ')
            }
            if(!dom.add(article)) {
                alert('article - invalid');
            } else {
                document.querySelector('span.form-button.discard').click();
            }
        }
        document.querySelector('span.form-button.add').addEventListener('click', saveArtice);

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
            }
        }
        document.querySelector('div.fullscreen-scrollable-wrap').addEventListener('click', closeForm);
    });
})();
