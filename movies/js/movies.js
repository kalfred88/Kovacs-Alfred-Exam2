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
    });
    document.getElementById('stats').addEventListener('click', function () {
        getStats(moviesData);
    });


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
        div.className = "movie";
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

function getStats(data) {
    let content = document.querySelector('.content');
    let actorStats = actorMap(data);
    let genreStats = genreMap(data);
    let timeStats = getTimes(data);
    content.innerHTML = timeStats + actorStats + genreStats;
}

function actorMap(data) {
    let actorMap = new Map();
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].cast.length; j++) {
            if (actorMap.has(data[i].cast[j].name)) {
                let currValue = actorMap.get(data[i].cast[j].name);
                actorMap.set(data[i].cast[j].name, currValue + 1);
            } else {
                actorMap.set(data[i].cast[j].name, 1);
            }
        }
    }
    let actorStats = "";
    for (let i of actorMap) {
        actorStats += (`<p>${i[0]} filmjeinek száma az adatbázisban: ${i[1]}</p>`);
    }
    return actorStats;
}

function genreMap(data) {
    let genreMap = new Map();
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].categories.length; j++) {
            if (genreMap.has(data[i].categories[j])) {
                let currValue = genreMap.get(data[i].categories[j]);
                genreMap.set(data[i].categories[j], currValue + 1);
            } else {
                genreMap.set(data[i].categories[j], 1);
            }
        }
    }
    let genreStats = "";
    for (let i of genreMap) {
        genreStats += (`<p> A(z) ${i[0]} kategóriájú filmek száma az adatbázisban: ${i[1]}</p>`);
    }
    return genreStats;
}

function getTimes(data) {
    let totalTime = 0;
    let count = 0;

    for (let i = 0; i < data.length; i++) {
        totalTime += parseInt(data[i].timeInMinutes);
        count++;
    }
    let avgTime = (totalTime / count / 60).toFixed(2);
    totalTime = (totalTime / 60).toFixed(2);

    let timeStats = `<p>Az filmek összhossza: ${totalTime} óra<br>
    A filmek átlagos hossza: ${avgTime} óra.</p>`;

    return timeStats
}