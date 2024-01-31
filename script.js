document.addEventListener("DOMContentLoaded", function () {
    const accessKey = ""; // Подставьте Ваш API-ключ от Unsplash

    getRandomPhoto();


    // Функция для получения случайного изображения из Unsplash
    function getRandomPhoto() {
        fetch(`https://api.unsplash.com/photos/random?client_id=${accessKey}`)
            .then(response => response.json())
            .then(data => {
                const photo = data.urls.regular;
                const photographer = data.user.name;

                document.getElementById("photo").setAttribute("src", photo);
                document.getElementById("photographer").textContent = `Photographer: ${photographer}`;

                // Сохранение информации о фото в историю просмотров
                saveToHistory(photo, photographer);
            });
    }

    // Обработчик события для кнопки "Лайк"
    const likeBtn = document.getElementById("like-btn");
    const likeCount = document.getElementById("like-count");
    let likes = Number(localStorage.getItem("likes")) || 0; // Получение количества лайков из локального хранилища

    likeCount.textContent = likes;

    likeBtn.addEventListener("click", function () {
        likes++;
        likeCount.textContent = likes;
        localStorage.setItem("likes", likes); // Сохранение количества лайков в локальное хранилище
    });

    // Функция для сохранения информации о фото в историю просмотров
    function saveToHistory(photoUrl, photographer) {
        const history = JSON.parse(localStorage.getItem("history")) || [];

        // Проверка, чтобы избежать дублирования фото в истории
        if (!history.some(entry => entry.photo === photoUrl)) {
            history.push({
                photo: photoUrl,
                photographer: photographer
            });

            localStorage.setItem("history", JSON.stringify(history));
        }
    }

    // Обработчик события для кнопки "Очистить историю"
    const clearHistoryBtn = document.getElementById("clear-history-btn");
    clearHistoryBtn.addEventListener("click", function () {
        localStorage.removeItem("history");
        const historyList = document.getElementById("history-list-ul");
        historyList.innerHTML = "";
    });

    // Функция для отображения истории просмотров
    function displayHistory() {
        const history = JSON.parse(localStorage.getItem("history")) || [];
        const historyList = document.getElementById("history-list-ul");
        const historyListItems = history.map(entry => `
            <li> 
                <a href="${entry.photo}" target="_blank">
                    <img src="${entry.photo}" alt="${entry.photographer}">
                </a>
                <p>${entry.photographer}</p>
            </li>
        `);
        historyList.insertAdjacentHTML("beforeend",
            historyListItems.join(" "));
    }


    // обработка события кнопки "Показать историю"
    const displayHistoryBtn = document.querySelector("#display-history-btn");
    displayHistoryBtn.addEventListener("click", displayHistory);
});
