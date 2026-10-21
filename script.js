
const initialMenus = [
    "김치찌개",
    "돈까스",
    "제육볶음",
    "파스타",
    "초밥"
];

let menus = [...initialMenus];

const menuForm = document.getElementById("menuForm");
const menuInput = document.getElementById("menuInput");
const menuList = document.getElementById("menuList");
const menuCount = document.getElementById("menuCount");
const recommendBtn = document.getElementById("recommendBtn");
const result = document.getElementById("result");
const resultMessage = document.getElementById("resultMessage");
const notice = document.getElementById("notice");
const emptyMessage = document.getElementById("emptyMessage");

const emojis = ["🍲", "🍱", "🥩", "🍝", "🍣", "🍜", "🍛", "🥗", "🍔", "🍕"];

// 메뉴 목록 화면에 표시
function renderMenus() {
    menuList.replaceChildren();

    menus.forEach((menu, index) => {
        const item = document.createElement("li");
        item.className = "menu-card";

        const emoji = document.createElement("span");
        emoji.className = "menu-emoji";
        emoji.textContent = emojis[index % emojis.length];
        emoji.setAttribute("aria-hidden", "true");

        const name = document.createElement("span");
        name.className = "menu-name";
        name.textContent = menu;

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.type = "button";
        deleteBtn.textContent = "×";
        deleteBtn.setAttribute("aria-label", `${menu} 삭제`);

        // 삭제 버튼 클릭
        deleteBtn.addEventListener("click", () => {
            deleteMenu(menu);
        });

        item.append(emoji, name, deleteBtn);
        menuList.appendChild(item);
    });

    // 메뉴 개수 갱신
    menuCount.textContent = `${menus.length}개`;

    // 메뉴가 없으면 안내 화면 표시
    emptyMessage.hidden = menus.length !== 0;
    menuList.hidden = menus.length === 0;
}

// 안내 메시지 표시
function showNotice(message, isError = false) {
    notice.textContent = message;
    notice.classList.toggle("error", isError);
}

// 메뉴 추가
menuForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const newMenu = menuInput.value.trim();

    // 빈칸 검사
    if (newMenu === "") {
        showNotice("메뉴 이름을 입력해 주세요.", true);
        menuInput.focus();
        return;
    }

    // 같은 이름의 메뉴 검사 (공백 및 대소문자 차이 무시)
    const isDuplicate = menus.some(
        menu => menu.toLocaleLowerCase() === newMenu.toLocaleLowerCase()
    );

    if (isDuplicate) {
        showNotice("이미 등록된 메뉴입니다.", true);
        menuInput.focus();
        return;
    }

    // 메뉴 등록
    menus.push(newMenu);
    renderMenus();

    menuInput.value = "";
    showNotice(`'${newMenu}' 메뉴가 추가되었습니다.`);
    menuInput.focus();

    // 메뉴가 새로 등록되면 추천 안내 초기화
    result.textContent = "메뉴가 추가되었습니다!";
    resultMessage.textContent = "추천받기 버튼을 눌러 메뉴를 선택하세요.";
});

// 메뉴 삭제
function deleteMenu(menu) {
    menus = menus.filter(item => item !== menu);

    renderMenus();
    showNotice(`'${menu}' 메뉴를 삭제했습니다.`);

    if (menus.length === 0) {
        result.textContent = "메뉴가 없습니다.";
        resultMessage.textContent = "먼저 새로운 점심 메뉴를 등록해 주세요!";
    } else {
        result.textContent = "메뉴가 삭제되었습니다.";
        resultMessage.textContent = "남은 메뉴 중에서 다시 추천받을 수 있습니다.";
    }
}

// 무작위 메뉴 추천
recommendBtn.addEventListener("click", () => {
    if (menus.length === 0) {
        result.textContent = "추천할 메뉴가 없습니다.";
        resultMessage.textContent = "메뉴 추가 버튼을 눌러 메뉴를 등록해 주세요!";
        showNotice("등록된 메뉴가 없습니다. 메뉴를 먼저 추가해 주세요.", true);
        menuInput.focus();
        return;
    }

    const randomIndex = Math.floor(Math.random() * menus.length);
    const selectedMenu = menus[randomIndex];

    result.textContent = selectedMenu;
    resultMessage.textContent = "오늘 점심은 이 메뉴로 결정해 보세요!";
    showNotice("메뉴 추천이 완료되었습니다.");

    // 추천 결과를 강조하는 애니메이션
    result.animate(
        [
            { opacity: 0.3, transform: "translateY(8px)" },
            { opacity: 1, transform: "translateY(0)" }
        ],
        {
            duration: 350,
            easing: "ease-out"
        }
    );
});

// 첫 화면 표시
renderMenus();
