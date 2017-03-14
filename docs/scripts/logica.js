
var logica = (function () {

    HTMLCollection.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];

    document.addEventListener('DOMContentLoaded', function (event) {

        document.getElementById('plus').addEventListener('click', function (event) {
            document.querySelector('body').style.overflowY = 'hidden';
            document.querySelector('div.fullscreen-scrollable-wrap').style.display = 'block';
            document.forms.edit.querySelector('.info-bar').innerHTML = (new Date()).prettyFormat() + ' by' +
            '<span>' + authorization.getUser() + '</span>';
        });

        var resize = function (event){
            event.currentTarget.style.height = event.currentTarget.scrollHeight +'px';
        }
        for (var textarea of document.querySelectorAll('textarea')) {
            textarea.addEventListener('keypress', resize);
        }

        document.querySelector('div.fullscreen-scrollable-wrap').addEventListener('click', function (event) {
            var fswrap = document.querySelector('div.fullscreen-scrollable-wrap');
            var mwrap = document.querySelector('div.fullscreen-scrollable-wrap div.middle-wrap');
            var cross = document.querySelector('div.fullscreen-scrollable-wrap div.middle-wrap svg.light-svg');
            if(event.target === fswrap || event.target === mwrap || event.target === cross) {
                document.querySelector('body').style.overflowY = 'scroll';
                fswrap.style.display = 'none';
            }
        });

    });
})();
