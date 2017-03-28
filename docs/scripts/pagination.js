'uses strict';

var pagination = (function () {

    var pass = null;

    var resetCurrentRevalingElement = function () {
        pass = document.querySelector('#post-placeholder').firstElementChild;
    }

    var niceReveal = function (event) {
        if (!pass) resetCurrentRevalingElement();
        else if (pass.getBoundingClientRect().bottom < window.innerHeight) {
            pass.firstElementChild.style.display = 'block';
            var nextPass = pass.nextElementSibling;
            if (nextPass && nextPass.classList.contains('post-wrap')) {
                pass = nextPass;
            }
        }
    }

    var forceReveal = function () {
        for (element of document.querySelector('#post-placeholder').querySelectorAll('.post-wrap')) {
            if (element.getBoundingClientRect().bottom < window.innerHeight) {
                element.firstElementChild.style.display = 'block';
                pass = element;
            }
        }
    }

    var arrayOnDisplay = [];
    var index = 0;

    var showMore = function (event) {
        for(var i = index; i < index + 6 && i < arrayOnDisplay.length; i++)
            dom.add(arrayOnDisplay[i], 'append');
        if(index < arrayOnDisplay.length - 6)
            index = index + 6;
        else document.querySelector('.show-more').style.visibility = 'hidden';
        forceReveal();
    }

    var applyFilter = function (filter) {
        arrayOnDisplay = data.getMultiple({all:true}, filter);
        document.querySelector('.show-more').style.visibility = '';
        index = 0;
        dom.clear();
        showMore();
    }

    window.addEventListener('scroll', niceReveal);

    document.addEventListener('DOMContentLoaded', function(event) {
        document.querySelector('div.show-more.v-align').addEventListener('click', showMore);
    });

    return {
        applyFilter: applyFilter,
        showMore: showMore,
    }
})();
