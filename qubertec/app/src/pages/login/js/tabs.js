'use strict';

const tabs = document.querySelectorAll('.tabs__button');

tabs.forEach(
    t => t.addEventListener('click', function() {
        this.classList.add('current-tab');
        t.nextElementSibling ? t.nextElementSibling.classList.remove('current-tab') : t.previousElementSibling.classList.remove('current-tab');
    })
)