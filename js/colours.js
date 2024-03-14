document.addEventListener('DOMContentLoaded', () => {
    // Use document.querySelectorAll to get a list of all buttons on the page
    // Iterate over each button
    // Use button.onclick to set the button's onclick event
    // Inside the event, use document.querySelector to get the #hello element
    // Set the #hello element's style.color to the value of the data-color attribute of the button
    document.querySelector('select').onchange = function() {
            document.querySelector('#hello').style.color = this.value;
        }
    });
    // Use document.querySelector to get the #hello element