'uses strict';

const pages = (() => {
    let pass = null;

    const resetCurrentRevalingElement = () => {
        pass = id('post-placeholder').firstElementChild;
    };

    const revealSingle = (element) => {
        if (element.getBoundingClientRect().bottom < window.innerHeight) {
            element.qs('.card').style.display = '';
            pass = element;
        }
    };

    const niceReveal = () => {
        if (!pass) resetCurrentRevalingElement();
        else if (pass.getBoundingClientRect().bottom < window.innerHeight) {
            revealSingle(pass);
            let nextPass = pass.nextElementSibling;
            if (nextPass && nextPass.matches('.wrap.post'))
                pass = nextPass;
        }
    };

    const forceReveal = () =>
        [].forEach.call(id('post-placeholder').qsA('.wrap.post'),
            revealSingle);

    let page = {
        offset: 0,
        count: 6
    };

    let currentFilter = null;

    const showMore = () => {
        data.getMultiple(page, currentFilter)
        .then(data => {
            if (page.offset <= data.lastQueryLength)
                page.offset += page.count;
            if (page.offset >= data.lastQueryLength)
                qs('.show-more').style.visibility = 'hidden';
            data.pairs.forEach(pair => {
                marcoTask(() => {
                    dom.add(pair.id, pair.article, 'append');
                    revealSingle(id(pair.id));
                });
            });
        });
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
        let author = string.match(/by\s+(\w+)/);

        if (tags.length) config.tags = tags;
        if (author && author[1]) config.author = author[1];

        applyFilter(config);
    };

    document.forms.searchInput.onsubmit = search;

    qs('.wrap.overflow').on('scroll', niceReveal);

    qs('.show-more').on('click', showMore);

    return {
        reveal: revealSingle,
        applyFilter: applyFilter,
        showMore: showMore
    };
})();
