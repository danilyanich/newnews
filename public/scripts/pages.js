'uses strict';

const pages = (() => {
    let pass = null;

    const resetCurrentRevalingElement = () => {
        pass = id('post-placeholder').firstElementChild;
    };

    const niceReveal = (event) => {
        if (!pass) resetCurrentRevalingElement();
        else if (pass.getBoundingClientRect().bottom < window.innerHeight) {
            pass.qs('.card').style.display = 'block';
            let nextPass = pass.nextElementSibling;
            if (nextPass && nextPass.matches('.wrap.post')) {
                pass = nextPass;
            }
        }
    };

    const forceReveal = () => {
        for (let element of id('post-placeholder').qsA('.wrap.post')) {
            if (element.getBoundingClientRect().bottom < window.innerHeight) {
                element.qs('.card').style.display = '';
                pass = element;
            }
        }
    };

    let page = {
        offset: 0,
        count: 6
    };

    let currentFilter = null;

    const showMore = (event) => {
        let pairs = data.getMultiple(page, currentFilter);

        if (page.offset <= data.lastQueryLength())
            page.offset += page.count;
        if (page.offset >= data.lastQueryLength())
            qs('.show-more').style.visibility = 'hidden';

        pairs.forEach(pair => {
            marcoTask(() => {
                dom.add(pair.id, pair.article, 'append');
            });
        });

        marcoTask(forceReveal);
    };

    const applyFilter = (filter) => {
        qs('.show-more').style.visibility = '';
        page.offset = 0;

        id('post-placeholder').animate([
            { transform: 'translateY(0) scale(1)', opacity: 1 },
            { transform: 'translateY(calc(var(--line))) scale(0.95)', opacity: 0 }
        ], {
            duration: 300,
            easing: 'ease-in'
        }).onfinish = () => {
            currentFilter = filter;
            dom.clear();
            showMore();
        };
    };

    const search = (event) => {
        event.preventDefault();
        let string = document.forms.searchInput.search.value;
        let config = {};
        let tags = string.split(/\s+/).filter(tag => tag.match(/#\w+/)).map(tag => tag.replace('#', ''));
        if (tags.length) config.tags = tags;

        applyFilter(config);
    };

    document.forms.searchInput.onsubmit = search;

    qs('.wrap.overflow').on('scroll', niceReveal);

    qs('.show-more').on('click', showMore);

    return {
        applyFilter: applyFilter,
        showMore: showMore
    };
})();
