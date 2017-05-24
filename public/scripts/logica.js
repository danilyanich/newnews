'uses strict';

/* logica */ (() => {
    const animation = {
        fade: [
            { opacity: '0.0' },
            { opacity: '1.0' }
        ],
        slide: [
            { transform: 'translateY(var(--line-wrap)) scale(0.9)' },
            { transform: 'translateY(0px) scale(1)' }
        ],
        sideMenu: [
            { transform: 'translateX(calc(var(--line-wrap)*-5))' },
            { transform: 'translateX(0)' }
        ]
    };

    const timing = {
        normal: {
            duration: 300,
            direction: 'normal',
            easing: 'cubic-bezier(0.4, 0.0, 1, 1)'
        },
        reverse: {
            duration: 300,
            direction: 'reverse',
            easing: 'cubic-bezier(0.0, 0.0, 0.2, 1)'
        }
    };


    /* detailed post template */
    const detailed = (() => {
        const open = (post) => {
            post.qs('.button.show-full span').innerText = 'close';
            post.qs('.button.show-full i').innerText = 'expand_less';
            post.setAttribute('opened', true);

            post.qs('.card').style['box-shadow'] = 'var(--elevation-8)';
            post.style.padding = '8px 0px';

            post.qs('.article-image').style['max-height'] = 'none';

            let content = post.qs('.content');
            content.style.display = '';
            content.animate(
                animation.fade,
                timing.normal
            );
        };

        const close = (post) => {
            let content = post.qs('.content');
            content.style.display = 'none';

            post.qs('.button.show-full span').innerText = 'show full';
            post.qs('.button.show-full i').innerText = 'expand_more';
            post.removeAttribute('opened');

            post.qs('.article-image').style['max-height'] = '';

            post.qs('.card').style['box-shadow'] = '';
            post.style.padding = '';
        };

        const openMenu = (post) => {
            let menu = post.qs('.menu-insertion');
            menu.style.display = '';
            menu.animate(
                animation.fade,
                timing.normal
            );

            post.setAttribute('menu-opened', true);
        };

        const closeMenu = (post) => {
            let menu = post.qs('.menu-insertion');
            menu.animate(
                animation.fade,
                timing.reverse
            ).onfinish = () => {
                menu.style.display = 'none';
            };

            post.removeAttribute('menu-opened');
        };

        id('post-placeholder').on('click', (event) => {
            let parent = event.target.querySelectorParent('.post');
            if (parent) {
                if (event.target.querySelectorParent('.button.show-full')) {
                    if (parent.getAttribute('opened')) close(parent);
                    else open(parent, parent.id);
                } else if (event.target.querySelectorParent('.button.post-menu')) {
                    if (auth.getUser())
                        openMenu(parent, parent.id);
                } else if (event.target.matches('.menu-insertion .edit')) {
                    addEditForm.open(null, parent.id);
                    id('plus').click();
                    closeMenu(parent);
                } else if (parent.getAttribute('menu-opened'))
                    closeMenu(parent);
            }
        });
    })();


    /* refresh button */
    qs('.button.refresh').on('click', (event) => {
        event.target.animate([
            { transform: 'rotate(0deg)' },
            { transform: 'rotate(360deg)' }
        ], {
            duration: 800,
            direction: 'normal',
            easing: 'ease'
        });
        document.forms.searchInput.search.value = '';
        pages.applyFilter(null);
    });


    /* scroll to top */
    const easeInOutQuad = (t) =>
        (t < 0.5 ? 2 * t * t : -1 + ((4 - (2 * t)) * t));
    const mainContent = qs('.main-content');
    id('plus').on('click', () => {
        let max = mainContent.scrollTop;
        let progress = 0;
        let stop = 200;
        let scroll = setInterval(() => {
            progress += 10;
            let alpha = 1 - (progress / stop);
            mainContent.scrollTop = max * easeInOutQuad(alpha);
            if (progress >= stop)
                clearInterval(scroll);
        }, 10);
    });


    /* add and edit form template */
    const addEditForm = (() => {
        let opened = false;
        const template = id('add-edit-form-template');
        const form = document.forms.addEditForm;

        const open = (event, id) => {
            form.qs('.add-form').style.display = '';

            let whatsnew = form.qs('.whatsnew');
            whatsnew.innerHTML = '';
            whatsnew.style['flex-direction'] = 'column';
            let info = template.content.cloneNode(true);
            info.querySelector('.author').innerText = auth.getUser().username;
            info.querySelector('.timing').innerText = new Date().prettyFormat();
            whatsnew.appendChild(info);

            if (id) {
                data.getById(id)
                .then(article => {
                    form.title.value = article.title;
                    form.summary.value = article.summary;
                    form.content.value = article.content;
                    form.tags.value = article.tags.join(' ');

                    if (article.image) {
                        form.qs('.image-drop').innerHTML =
                            `<img src="${article.image}"></img>`;
                    }

                    form.setAttribute('edit-id', id);

                    opened = true;
                }).catch(alert);
            } else {
                if (opened) return;

                form.title.value = '';
                form.summary.value = '';
                form.content.value = '';
                form.tags.value = '';
                form.qs('.image-drop').innerText = 'Drop an image here!';

                form.removeAttribute('edit-id');
            }
            opened = true;
        };
        form.qs('.add-form-glimpse').on('click', open);

        const close = (event) => {
            form.qs('.add-form').style.display = 'none';
            form.qs('.whatsnew').innerHTML = 'What\'s new?';
            opened = false;
        };
        form.qs('.expand .close').on('click', close);

        // saving article
        const postArticle = (event) =>
            new Promise((resolve, reject) => {
                event.preventDefault();
                if (!opened) reject(new Error('form not opened'));

                let tagsline = form.tags.value;
                tagsline = tagsline.replace('#', ' ');
                let now = new Date();
                let article = {
                    title: form.title.value,
                    summary: form.summary.value,
                    createdAt: +now,
                    author: auth.getUser().username,
                    content: form.content.value,
                    tags: tagsline.split(' ')
                };

                let image = qs('.image-drop img');
                if (image) article.image = image.src;
                resolve(article);
            })
            .then(article => {
                let editId = form.getAttribute('edit-id');
                if (editId)
                    return data.edit(editId, article);
                return data.add(article);
            })
            .then(pair => {
                dom.add(pair.id, pair.article);
                pages.reveal(id(pair.id));
                /* close form */close();
            })
            .catch(err => {
                let info = form.qs('.expand .post-info');
                info.innerText = 'invalid';
                setTimeout(() => {
                    info.innerText = '';
                }, 3000);
            });

        form.onsubmit = postArticle;

        // dragndrop emplementation
        const imageDrop = form.qs('.image-drop');
        imageDrop.on('dragover', (event) => event.preventDefault(), false);
        imageDrop.on('drop', (event) => {
            event.preventDefault();
            let path = event.dataTransfer.getData('text');
            let image = document.createElement('img');

            const callback = (exists) => {
                if (exists) {
                    imageDrop.innerHTML = '';
                    imageDrop.appendChild(image);
                } else
                    alert('only links to images allowed');
            };

            image.onerror = () => callback(false);
            image.onload = () => callback(true);

            image.src = path;
        }, false);


        // textareas are resizing to fit content
        const resize = (event) => {
            event.currentTarget.style.height = event.currentTarget.scrollHeight + 'px';
        };
        [].forEach.call(form.qsA('textarea'), textarea =>
            textarea.on('keypress', resize));

        return {
            open: open
        };
    })();


    const loginForm = (() => {
        let opened = false;
        let formPlaceholder = qs('.intro .login-form');
        let logged = formPlaceholder.qs('.logged');
        let form = document.forms.login;

        const open = () => {
            formPlaceholder.style.display = '';
            formPlaceholder.animate(
                animation.fade,
                timing.normal
            );
            opened = true;
        };

        const close = () => {
            formPlaceholder.animate(
                animation.fade,
                timing.reverse
            ).onfinish = () => {
                formPlaceholder.style.display = 'none';
                opened = false;
            };
        };

        const logIn = (event) => {
            event.preventDefault();
            let username = form.username.value;
            let password = form.password.value;
            auth.authorize(username, password)
            .then(user => {
                logged.qs('img').src = user.avatar;
                logged.qs('.author').innerText = user.username;
                /* close form */close();
                setTimeout(() => {
                    logged.style.display = '';
                    form.style.display = 'none';
                }, 400);
            })
            .catch(alert);
        };

        const logOut = (event) =>
            auth.logout()
            .then(err => {
                logged.qs('img').src = '';
                logged.qs('.author').innerText = '';
                logged.style.display = 'none';
                form.style.display = '';
                form.animate(
                    animation.fade,
                    timing.normal
                );
            });

        form.onsubmit = logIn;

        formPlaceholder.qs('.button.logout').on('click', logOut);

        qs('body').on('click', (event) => {
            if (event.target.querySelectorParent('.intro .button.account'))
                open();
            else if (!event.target.querySelectorParent('.intro .login-form'))
                close();
        });
    })();


    const sideMenu = (() => {
        const menu = id('side-menu');

        const open = (event) => {
            menu.style.display = '';
            menu.animate(
                animation.sideMenu,
                timing.normal
            );
        };

        const close = (event) => {
            menu.animate(
                animation.sideMenu,
                timing.reverse
            ).onfinish = () => {
                menu.style.display = 'none';
            };
        };

        qs('body').on('click', (event) => {
            if (event.target.querySelectorParent('.intro .button.menu'))
                open();
            else if (!event.target.querySelectorParent('#side-menu'))
                close();
        });
    })();
})();
