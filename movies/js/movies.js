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
        .replace(/ +/g, '-')
        .replace(/-+/g, '-');
}

function successAjax(xhttp) {
    let moviesData = JSON.parse(xhttp.responseText).movies;
    //hívás
    console.log(moviesData);
    sortByTitle(moviesData);
    categoryNames(moviesData);
    createGrid(moviesData);
    document.getElementById('search').addEventListener('click', function () {
        searchingFor(moviesData);
    })
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
    content.innerHTML = "";
    for (let i = 0; i < datas.length; i++) {
        let title = datas[i].title.removeShits();
        let div = document.createElement('div');
        div.className = "movie col-xs-12 col-sm-6 col-md-4 col-lg-3";
        div.innerHTML = `<img src="/movies/img/covers/${title}.jpg" alt="${title}">
        <p>Cím: ${datas[i].title}<br>
        Hossz: ${datas[i].timeInMinutes} perc<br>
        Premier: ${datas[i].premierYear}<br>
        Kategória: ${datas[i].categories.join(', ')}<br>
        Rendező(k): ${datas[i].directors.join(', ')}</p>
        <div class="cast">Szereplők: ${showCast(datas[i].cast)}</div>`;

        content.appendChild(div);
    }
}

function showCast(cast) {
    let element = "";
    for (let i = 0; i < cast.length; i++) {
        let portrait = cast[i].name.removeShits();
        element += `<div class="castpic">
        <img src="/movies/img/actors/${portrait}.jpg" alt="${cast[i].name}"><br>
        ${cast[i].name} (${cast[i].characterName})<br>
        ${cast[i].birthYear}, ${cast[i].birthCountry}, ${cast[i].birthCity}</div>`;
    }
    return element;
}

function searchingFor(data) {
    let attr = document.getElementById('searchBy').value;
    let keyword = document.getElementById('keyword').value.toLowerCase();
    console.log(keyword);
    switch (attr) {
        case "name":
            searchByActor(data, keyword);
            break;
        case "directors":

            searchByDirector(data, keyword);
            break;
        case "title":
            searchByTitle(data, keyword);
            break;

        default:
            content.innerHTML = `<h1 class="error">Bubuka, valamit nem jól csinálsz!</h1>`;
            break;
    }
}

function searchByTitle(data, title) {
    let content = document.querySelector('.content');
    for (let i = 0; i < data.length; i++) {
        if (data[i].title.toLowerCase() == title) {
            let result = [];
            result.push(data[i]);
            createGrid(result);
            break;
        } else {
            content.innerHTML = `<h1 class="error">Nincs ilyen film az adatbázisban!</h1>`;
        }
    }
}

function searchByDirector(data, director) {
    let content = document.querySelector('.content');
    for (let i = 0; i < data.length; i++) {
        if (data[i].directors.map(name => name.toLowerCase()).includes(director)) {
            let result = [];
            result.push(data[i]);
            createGrid(result);
            break;
        } else {
            content.innerHTML = `<h1 class="error">Nincs ilyen film az adatbázisban!</h1>`;
        }
    }
}

function searchByActor(data, actor) {
    let content = document.querySelector('.content');
    let result = [];
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].cast.length; j++) {
            if (data[i].cast[j].name.toLowerCase() == actor) {
                result.push(data[i]);
            }
        }
    }
    if (result.length == 0) {
        content.innerHTML = `<h1 class="error">Nincs ilyen film az adatbázisban!</h1>`;
    } else {
        createGrid(result);
    }
}