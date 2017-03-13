
document.addEventListener('DOMContentLoaded', function(event) {
    var searchBar = document.querySelector('div.search-bar.v-align.animatable');
    //var content = document.getElementById('post-placeholder');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 430) {
            searchBar.classList.add('search-bar-fixed');
            //content.classList.add('blur');
        } else {
            searchBar.classList.remove('search-bar-fixed');
            //content.classList.remove('blur');
        }
    });
});
