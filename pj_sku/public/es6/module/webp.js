let detectWebp = function() {
    if (!window.localStorage || typeof localStorage !== 'object') return;

    let name = 'webpa'; // webp available
    if (!localStorage.getItem(name) || (localStorage.getItem(name) !== 'available' && localStorage.getItem(name) !== 'disable')) {

        let img = document.createElement('img');

        img.onload = function () {
            try {
                localStorage.setItem(name, 'available');
            } catch (ex) {
            }
        };

        img.onerror = function () {
            try {
                localStorage.setItem(name, 'disable');
            } catch (ex) {
            }
        };
        img.src = 'data:image/webp;base64,UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAsAAAABBxAREYiI/gcAAABWUDggGAAAADABAJ0BKgEAAQABABwlpAADcAD+/gbQAA==';
    }
};

module.exports = detectWebp;

