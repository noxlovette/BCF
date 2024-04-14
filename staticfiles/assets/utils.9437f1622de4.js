function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = $.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie('csrftoken');
const userId = sessionStorage.getItem('user_id');

let emojis = ["🧪", "🔬", "🧫", "🧬", "🌡️", "⚗️", "🔭", "🧲", "🔩", "🧰"];

function getRandomEmoji() {
    var randomIndex = Math.floor(Math.random() * emojis.length);
    return emojis[randomIndex];
}

let listItems = document.querySelectorAll("li");
listItems.forEach(function(li) {
    var randomEmoji = getRandomEmoji();
    li.style.setProperty("--random-emoji", `"${randomEmoji}"`);
});