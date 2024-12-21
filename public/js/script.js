document.addEventListener('DOMContentLoaded', function(){
const allbutton = document.querySelectorAll('.srcbtn');
const searchbar = document.querySelector('.srcbar');
const searchinput = document.getElementById('srcinput');
const searchclose = document.getElementById('srcclose');

for (var i = 0; i < allbutton.length; i++ ){
    allbutton[i].addEventListener('click', function(){
        searchbar.style.visibility = 'visible';
        searchbar.classList.add('open');
        this.setAttribute('aria-expaned', 'true');
        searchinput.focus();
    })
}
searchclose.addEventListener('click', function(){
    searchbar.style.visibility = 'hidden';
    searchbar.classList.remove('open');
    this.setAttribute('aria-expaned', 'false');
 
})


});