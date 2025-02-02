// ==UserScript==
// @name         B站定制化需求
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  使用Enter键切换B站全屏状态
// @author       LiPan
// @match        https://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 检测是否全屏状态
    function isFullscreen() {
        return document.fullscreenElement ||
               document.webkitFullscreenElement ||
               document.mozFullScreenElement;
    }

    // 进入全屏
    function enterFullscreen() {
        const player = document.querySelector('.bpx-player-container');
        if (player) {
            if (player.requestFullscreen) {
                player.requestFullscreen();
            } else if (player.webkitRequestFullscreen) {
                player.webkitRequestFullscreen();
            } else if (player.mozRequestFullScreen) {
                player.mozRequestFullScreen();
            }
        }
    }

    // 退出全屏
    function exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        }
    }

    // 处理键盘事件
    function handleKeyPress(event) {
        if (event.keyCode === 13) { // Enter键
            event.preventDefault();

            if (isFullscreen()) {
                exitFullscreen();
            } else {
                enterFullscreen();
            }
        }
    }

    // 等待播放器加载完成后绑定事件
    const checkPlayer = setInterval(() => {
        const player = document.querySelector('.bpx-player-container');
        if (player) {
            clearInterval(checkPlayer);
            document.addEventListener('keydown', handleKeyPress);
        }
    }, 500);

    // 清理监听器
    window.addEventListener('unload', () => {
        document.removeEventListener('keydown', handleKeyPress);
    });
})();