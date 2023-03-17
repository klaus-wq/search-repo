let search__input = document.querySelector("#search__input");
let search__button = document.querySelector("#search__button");
let repo__list = document.querySelector(".repo__list");

search__input.onkeydown = function (key) {
    if (key.key == "Enter") {
        searchRepository();
    }
};

function checkNameError() {
    if (search__input.value.length < 2) {
        name__error.textContent = "Название репозитория должно быть не короче 2-ух символов!";
        search__input.classList.add("error__border");
        search__input.oninput = checkNameError;
        return true;
    } else {
        search__input.classList.remove("error__border");
        name__error.textContent = "";
        search__input.oninput = null;
        return false;
    }
}

async function searchRepository(){
    repo__list.innerHTML = '';
    if (checkNameError()) {
        return;
    }

    const queryString = 'q=' + encodeURIComponent("\"" + search__input.value + "\" in:name");
    let url = `https://api.github.com/search/repositories?${queryString}&${per_page=10}`;
    
    let repo__loading = document.createElement("div");
    repo__loading.textContent = "Загрузка...";
    repo__list.appendChild(repo__loading);
    
    // let result = await fetch(url);
    // let json = await result.json();
    let result = fetch(url).then(
        successResponse => {
            if (successResponse.status !== 200) {
                return;
            } else {
                return successResponse.json();
            }
        }
    );

    let json = await result;

    repo__list.innerHTML = '';

    if (json.items.length === 0) {
        let repo__nothing = document.createElement("div");
        repo__nothing.textContent = "Ничего не найдено";
        repo__list.appendChild(repo__nothing);
        return;
    }

    json.items.forEach(element => {
        let repo__block = document.createElement("div");
        repo__block.classList.add("repo__block");
        let repo__name = document.createElement("a");
        repo__name.classList.add("repo__name");
        repo__name.href = element.html_url;
        repo__name.textContent = element.name;
        repo__name.target = "_blank";
        let repo__author = document.createElement("div");
        repo__author.classList.add("repo__author");
        repo__author.textContent = "Автор: " + element.owner.login;
        let repo__create = document.createElement("div");
        repo__create.classList.add("repo__create");
        repo__create.textContent = "Создано: " + new Date(element.created_at).toLocaleString();
        let repo__update = document.createElement("div");
        repo__update.textContent = "Обновлено: " + new Date(element.updated_at).toLocaleString();

        repo__block.appendChild(repo__name);
        repo__block.appendChild(repo__author);
        repo__block.appendChild(repo__create);
        repo__block.appendChild(repo__update);

        repo__list.appendChild(repo__block);
    });
}

search__button.onclick = function () {
    searchRepository();
};