'use strict';

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}

String.prototype.removeShits = function () {
    const hunChars = {
        á: 'a',
        é: 'e',
        í: 'i',
        ó: 'o',
        ö: 'o',
        ő: 'o',
        ú: 'u',
        ü: 'u',
        ű: 'u'
    }
    return this
        .toLocaleLowerCase()
        .replace(/[\?:;,\.\+\*\!\&/]/g, '')
        .replace(/[áéíóöőúüű]/g, c => hunChars[c])
        .replace(/ +/g, '-');
}

function successAjax(xhttp) {
    let moviesData = JSON.parse(xhttp.responseText).movies;
    //hívás
    console.log(moviesData);
    sortByTitle(moviesData);
    categoryNames(moviesData);
    createGrid(moviesData);
}


function getData(url, callbackFunc) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            callbackFunc(this);
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}

getData('/movies/json/movies.json', successAjax);


function sortByTitle(data) {
    data.sort((a, b) => {
        return a.title.localeCompare(b.title)
    });
    return data;
}

function categoryNames(data) {
    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].categories.length; j++) {
            data[i].categories[j] = data[i].categories[j].capitalize();
        }
    }
    return data;
}

function createGrid(datas) {
    let content = document.querySelector('.content');

    for (let i = 0; i < datas.length; i++) {
        let title = datas[i].title.removeShits();
        let div = document.createElement('div');
        /*let poster = document.createElement('img');
        poster.src = `/movies/img/covers/${title}.jpg`;
        poster.alt = title;*/
        div.className = "movie";
        div.innerHTML = `<img src="/movies/img/covers/${title}.jpg" alt="${title}">
        <p>Cím: ${datas[i].title}</p>
        <p>Hossz: ${datas[i].timeInMinutes} perc</p>
        <p>Premier: ${datas[i].premierYear}</p>
        <p>Kategória: ${datas[i].categories.join(', ')}</p>
        <p>Rendező(k): ${datas[i].directors.join(', ')}</p>
        <div class="cast">Szereplők: ${showCast(datas[i].cast)}</div>`;

        content.appendChild(div);
    }
}

function showCast(cast) {

    let element = "";
    for (let i = 0; i < cast.length; i++) {
        element += `<p>${cast[i].name} (${cast[i].characterName})\n ${cast[i].birthYear}, ${cast[i].birthCountry}, ${cast[i].birthCity}</p>`;
    }
    return element;
}