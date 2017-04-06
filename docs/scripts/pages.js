'uses strict';

const pages = (() => {

    let pass = null;

    const resetCurrentRevalingElement = () => {
        pass = id('post-placeholder').firstElementChild;
    }

    const niceReveal = (event) => {
        if (!pass) resetCurrentRevalingElement();
        else if (pass.getBoundingClientRect().bottom < window.innerHeight) {
            pass.qs('.card').style.display = 'block';
            let nextPass = pass.nextElementSibling;
            if (nextPass && nextPass.matches('.wrap.post')) {
                pass = nextPass;
            }
        }
    }

    const forceReveal = () => {
        for (let element of id('post-placeholder').qsA('.wrap.post')) {
            if (element.getBoundingClientRect().bottom < window.innerHeight) {
                element.qs('.card').style.display = '';
                pass = element;
            }
        }
    }

    let page = {
        offset: 0,
        count: 6
    };

    let filter = null;

    const showMore = (event) => {

        let pairs = data.getMultiple(page, filter);

        if (page.offset <= data.lastQueryLength())
            page.offset += page.count;
        if (page.offset >= data.lastQueryLength())
            qs('.show-more').style.visibility = 'hidden';

        for (let pair of pairs) {
            dom.add(pair.id, pair.article, 'append');
        }

        forceReveal();
    }

    const applyFilter = (filter) => {
        qs('.show-more').style.visibility = '';
        page.offset = 0;
        dom.clear();
        showMore();
    }

    qs('.wrap.overflow').on('scroll', niceReveal);

    qs('.show-more').on('click', showMore);

    return {
        applyFilter: applyFilter,
        showMore: showMore,
    }

})();
