// ==UserScript==
// @name         인지개 자동 댓글 달기
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically fill "name" in the textarea at a specific time (UTC+9)
// @author       You
// @match        https://canvas.skku.edu/courses/53457/external_tools/3
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let targetTimeUTC; // 설정된 시간 저장
    let isCommentPosted = false;
    let isActive = false; // 기능 활성화 상태 저장

    let textarea, submitButton;

    const description = document.createElement("p");
    description.textContent = "댓글 작성 시간 입력 (형식: YYYY-MM-DD HH:MM:SS, 24시간 형식 사용)\n입력하면 자동으로 댓글창에 내용 채워짐, 내용 채워진 후 댓글창 클릭해서 아무 문자 하나 친 뒤 백스페이스로 삭제해야 작동함. 댓글창에 아무 상호작용 안해두면 댓글창 비어있다고 뜸";
    description.style.marginBottom = '10px';
    description.style.fontSize = "100%";
    description.style.width = '100%';
    description.style.height = '40px';
    description.style.backgroundColor = '#f0f0f0';
    description.style.border = '1px solid #ccc';
    description.style.borderRadius = '4px';
    description.style.padding = '10px';

    const myInputBox = document.createElement('input');
    myInputBox.type = 'text';
    myInputBox.placeholder = '댓글 작성 시간 입력 (형식: YYYY-MM-DD HH:MM:SS, 24시간 형식 사용)';
    myInputBox.style.marginBottom = '10px';
    myInputBox.style.fontSize = "100%";
    myInputBox.style.width = '100%';
    myInputBox.style.height = '40px';
    myInputBox.style.backgroundColor = '#f0f0f0';
    myInputBox.style.border = '1px solid #ccc';
    myInputBox.style.borderRadius = '4px';
    myInputBox.style.padding = '10px';

    const target = document.querySelector("#wrapper > div.ic-app-nav-toggle-and-crumbs.no-print");
    if (!target) alert("없음");

    target.parentNode.insertBefore(myInputBox, target.nextSibling);
    target.parentNode.insertBefore(description, target.nextSibling);


    myInputBox.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && myInputBox.value.length) {
            const userTime = new Date(myInputBox.value);
            if (!isNaN(userTime.getTime())) {
                targetTimeUTC = new Date(userTime.getTime()); // UTC로 변환
                alert(`댓글 작성 시간이 ${userTime}로 설정되었습니다.`);
                isActive = true; // 활성화
                isCommentPosted = false; // 댓글 작성 여부 초기화
            } else {
                alert("잘못된 시간 형식입니다. 다시 시도해주세요.");
            }

            const iframe = document.querySelector("#tool_content");
            const iframeDoc = iframe.contentDocument;
            const commentWriteContainer = iframeDoc.querySelector("#xn-post-comments > div.xpc-all-comments-container > div.xpc-comment-write-container");
            if (!commentWriteContainer) alert("요소 없음");

            textarea = commentWriteContainer.querySelector("textarea");
            submitButton = commentWriteContainer.querySelector("button");
            if (!textarea || !submitButton) console.log("textarea 또는 버튼을 찾지 못했습니다.");

            textarea.value = "2024311654 김준호";
            textarea.focus();

            // 입력 이벤트 발생
            // const inputEvent = new InputEvent('input', { bubbles: true, cancelable: true });
            // textarea.dispatchEvent(inputEvent);

            // const keyboardEvent = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'a' });
            // iframeDoc.dispatchEvent(keyboardEvent);

            // const keyboardUpEvent = new KeyboardEvent('keyup', { bubbles: true, cancelable: true, key: 'a' });
            // iframeDoc.dispatchEvent(keyboardUpEvent);
        }
    });

    const checkTime = setInterval(function() {
        if (isActive && targetTimeUTC) {
            const currentTime = new Date();

            if (currentTime >= targetTimeUTC && !isCommentPosted) {
                submitButton.click();

                isCommentPosted = true;
                isActive = false;

                // alert("댓글이 성공적으로 작성되었습니다.");
            }
        }
    }, 1);

})();
