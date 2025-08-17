// ==UserScript==
// @name         B站全屏/关闭控制优化版
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Enter切换全屏（排除输入框场景），单引号键关闭标签页
// @author       YourName
// @match        https://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 判断焦点是否在可输入元素上[6,7](@ref)
    function isFocusOnInput() {
        const activeElement = document.activeElement;
        return (
            activeElement.tagName === 'INPUT' ||
            activeElement.tagName === 'TEXTAREA' ||
            activeElement.isContentEditable
        );
    }

    // 全屏状态检测
    function isFullscreen() {
        return document.fullscreenElement ||
               document.webkitFullscreenElement ||
               document.mozFullScreenElement;
    }

    // 全屏切换
    function toggleFullscreen() {
        const player = document.querySelector('.bpx-player-container');
        if (!player) return;

        isFullscreen() ? exitFullscreen() : enterFullscreen(player);
    }

    function enterFullscreen(element) {
        const fsReq = element.requestFullscreen ||
                     element.webkitRequestFullscreen ||
                     element.mozRequestFullScreen;
        fsReq.call(element);
    }

    function exitFullscreen() {
        const fsExit = document.exitFullscreen ||
                      document.webkitExitFullscreen ||
                      document.mozCancelFullScreen;
        fsExit.call(document);
    }

    // 关闭当前标签页
    function closeTab() {
        try {
            window.close();
            if (!window.closed) window.location.href = 'about:blank';
        } catch(e) {
            console.log('关闭标签页需要用户交互权限');
        }
    }

    // 键盘事件处理（关键修改部分）[3,6](@ref)
    function handleKeyPress(event) {
        // 焦点在输入元素时不处理Enter键
        if (event.code === 'Enter' && isFocusOnInput()) return;

        // Enter键切换全屏
        if (event.code === 'Enter') {
            event.preventDefault();
            toggleFullscreen();
        }

        // 单引号物理键关闭页面
        if (event.code === 'Quote') {
            event.preventDefault();
            closeTab();
        }
    }

    // 播放器加载检测
    let playerObserver;
    const initObserver = () => {
        playerObserver = new MutationObserver(() => {
            const player = document.querySelector('.bpx-player-container');
            if (player) {
                document.addEventListener('keydown', handleKeyPress);
                playerObserver.disconnect();
            }
        });

        playerObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    };

    // 页面加载完成后初始化
    window.addEventListener('load', () => {
        if (!document.querySelector('.bpx-player-container')) {
            initObserver();
        } else {
            document.addEventListener('keydown', handleKeyPress);
        }
    });

    // 清理监听器
    window.addEventListener('unload', () => {
        document.removeEventListener('keydown', handleKeyPress);
        if (playerObserver) playerObserver.disconnect();
    });
})();
