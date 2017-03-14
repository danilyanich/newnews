'uses strict';

document.addEventListener('DOMContentLoaded', function(event) {
    var searchBar = document.querySelector('form.search-bar.v-align');
    var pass = document.querySelector('html>body>div.middle-wrap>div.middle-content>div.search-bar-wrap');
    window.addEventListener('scroll', function() {
        if (pass.getBoundingClientRect().top < 0) {
            searchBar.classList.add('search-bar-fixed');
        } else {
            searchBar.classList.remove('search-bar-fixed');
        }
    });
});
