'use strict';

qs('body').on('click', (event) => {

    let affected = event.target.querySelectorParent('.ripple');

    if (affected) {

        let rect = affected.getBoundingClientRect();
        let xOfs = 0;
        let yOfs = 0;

        if (event.target != affected) {
            let eventRect = event.target.getBoundingClientRect();
            xOfs = eventRect.left - rect.left;
            yOfs = eventRect.top - rect.top;
        }

        let length = 2*Math.sqrt(Math.pow(rect.width, 2) + Math.pow(rect.height, 2));

        let ripple = document.createElement('div');

        ripple.classList.add('inside');
        ripple.style.height = length + 'px';
        ripple.style.width = length + 'px';
        ripple.style.zIndex = '' + (parseInt(affected.style.zIndex) + 1);

        if (affected.matches('.centered')) {
            ripple.style.left = rect.width/2 + 'px';
            ripple.style.top = rect.height/2 + 'px';
        } else {
            ripple.style.left = event.offsetX + (xOfs || 0) + 'px';
            ripple.style.top = event.offsetY + (yOfs || 0) + 'px';
        }

        affected.appendChild(ripple);

        setTimeout(function () {
            affected.removeChild(ripple);
        }, 300);

    }
});

qs('.button.refresh').on('click', (event) => {
    event.target.animate([
        {transform: 'rotate(0deg)'},
        {transform: 'rotate(360deg)'}
    ],{
        duration: 800,
        direction: 'normal',
        easing: 'ease'
    });
    document.forms.searchInput.search.value = '';
    pages.applyFilter(null);
});
