document.addEventListener('DOMContentLoaded', function() {

    // by default, submit is disabled
    document.querySelector('#submit').disabled = true;

    document.querySelector('#task').onkeyup = function() {
        document.querySelector('#submit').disabled = document.querySelector('#task').value.length <= 0;
    }

    document.querySelector('form').onsubmit = () => {
        const task = document.querySelector('#task').value;

        const li = document.createElement('li');
        li.innerHTML = task;

        document.querySelector('#tasks').append(li);
        document.querySelector('#task').value = '';
        //stop form from submitting
        return false;
    };
})