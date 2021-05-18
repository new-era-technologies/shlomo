'use strict';

const reset = document.getElementById('reset-username'),
    username = document.getElementById('username');

reset.addEventListener('click', () => username.value = '');