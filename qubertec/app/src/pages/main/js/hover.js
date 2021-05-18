'use strict';

const tiles = document.querySelectorAll('.tile'),
    navTiles = document.querySelectorAll('.tile__nav'),
    infos = document.querySelectorAll('.info__text--text8');

for (let i = 1; i < tiles.length; i++) {
    tiles[i].addEventListener('mouseenter', function() {
        navTiles[i - 1].classList.add('show-tile-nav');
        infos[i].children.length > 1 ? infos[i].children[1].classList.add('ok-white') : null;
    });
    tiles[i].addEventListener('mouseleave', function() {
        navTiles[i - 1].classList.remove('show-tile-nav');
        infos[i].children.length > 1 ? infos[i].children[1].classList.remove('ok-white') : null;
    });
}