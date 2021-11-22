const movies = document.querySelector('.movies');
const modal = document.querySelector('.modal');
const modalImg = document.querySelector('.modal__img');
const modalTitle = document.querySelector('.modal__title');
const modalDescription = document.querySelector('.modal__description');
const modalRating = document.querySelector('.modal__average');
const modalClose = document.querySelector('.modal__close');
const modalGenres = document.querySelector('.modal__genres');

let allMovies = [];

let page = 0;

let initialIndex = 1;

function listingMovies(body) {
    body.results.forEach(function (movie) {
        const div = document.createElement('div');
        div.classList.add('movie');
        div.style.backgroundImage = `url(${movie.poster_path})`;
        div.dataset.index = initialIndex;

        const div2 = document.createElement('div');
        div2.classList.add('movie__info');

        const title = document.createElement('span');
        title.classList.add('movie__title');
        title.textContent = movie.title;

        const rating = document.createElement('span');
        rating.classList.add('movie__rating');
        rating.textContent = movie.vote_average;

        const littleStar = document.createElement('img');
        littleStar.src = "./assets/estrela.svg";

        rating.append(littleStar)
        div2.append(title, rating)
        div.append(div2);
        movies.append(div);

        if (initialIndex > 5) {
            div.classList.add('hidden');
        }

        function openingModal(movieInfo) {
            modal.style.display = 'flex';
            modalImg.src = movieInfo.backdrop_path;
            modalTitle.textContent = movieInfo.title;
            modalDescription.textContent = movieInfo.overview;
            modalRating.textContent = movieInfo.vote_average;
            movieInfo.genres.forEach(genre => {
                const genreFound = document.createElement('span');
                genreFound.textContent = genre.name;
                genreFound.classList.add('modal__genre');
                modalGenres.append(genreFound);
            })
        }

        div.addEventListener('click', function () {
            const movieId = movie.id;
            fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${movieId}?language=pt-BR`).then(function (response) {
                const promiseBody = response.json();
                promiseBody.then(function (movieInfo) {
                    openingModal(movieInfo)
                })
            })
        })
        modalClose.addEventListener('click', function () {
            modal.style.display = 'none';
            modalGenres.innerHTML = "";
        })

        initialIndex++;
    })
    allMovies = [...document.querySelectorAll('.movie')];
}

fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR').then(function (response) {
    const promiseBody = response.json();

    promiseBody.then(function (body) {
        listingMovies(body)
    })

})

const nextMovie = document.querySelector('.btn-next');

nextMovie.addEventListener('click', function () {
    changeMovies();
})

function changeMovies() {
    const oldMovies = allMovies.slice(page * 5, page * 5 + 5);

    if (page !== 3) {
        page++;
    } else {
        page = 0;
    }

    const newMovies = allMovies.slice(page * 5, page * 5 + 5);
    oldMovies.forEach(movie => movie.classList.add('hidden'));
    newMovies.forEach(movie => movie.classList.remove('hidden'))
}

const previousMovie = document.querySelector('.btn-prev');

previousMovie.addEventListener('click', function () {
    changeMoviesBackwards();
})

function changeMoviesBackwards() {
    const oldMovies = allMovies.slice(page * 5, page * 5 + 5);

    if (page !== 0) {
        page--;
    } else {
        page = 3;
    }

    const newMovies = allMovies.slice(page * 5, page * 5 + 5);
    oldMovies.forEach(movie => movie.classList.add('hidden'));
    newMovies.forEach(movie => movie.classList.remove('hidden'))
}

const input = document.querySelector('.input');

input.addEventListener('keydown', function (event) {
    if (event.key !== 'Enter') return;

    while (movies.firstChild) {
        movies.removeChild(movies.firstChild);
    }

    if (input.value === "") {
        location.reload()
    } else {
        fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${input.value}`).then(function (response) {
            const promiseBody = response.json();

            promiseBody.then(function (body) {
                initialIndex = 1;
                if (body.results.length === 0) {
                    location.reload()
                }

                listingMovies(body)

                input.value = '';
            })
        })
    }
})

const highlightedMovie = document.querySelector('.highlight');
const highlightBackground = document.querySelector('.highlight__video');
const highlightTitle = document.querySelector('.highlight__title');
const highlightRating = document.querySelector('.highlight__rating');
const highlightGenres = document.querySelector('.highlight__genres');
const highlightLaunch = document.querySelector('.highlight__launch');
const highlightDescription = document.querySelector('.highlight__description');
const highlightVideo = document.querySelector('.highlight__video-link');

fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR').then(function (response) {
    const promiseBody = response.json();

    promiseBody.then(function (body) {
        highlightBackground.style.backgroundImage = `url(${body.backdrop_path})`;
        highlightTitle.textContent = body.title;
        highlightRating.textContent = body.vote_average;
        const genres = body.genres.map(genre => genre.name)

        highlightGenres.textContent = `${genres.join(", ")}`
        const actuallDate = new Date(body.release_date);

        const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
            "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
        ];

        getLongMonthName = function (date) {
            return monthNames[date.getMonth()];
        }

        console.log(getLongMonthName(actuallDate))

        highlightLaunch.textContent = `${actuallDate.getDay()} de ${getLongMonthName(actuallDate)} de ${actuallDate.getFullYear()}`;
        highlightDescription.textContent = body.overview;

        fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR').then(function (response) {
            const promiseBody = response.json();

            promiseBody.then(function (body) {
                highlightVideo.href = `https://www.youtube.com/watch?v=${body.results[1].key}`
            })
        })
    })
})

const themeButton = document.querySelector('.btn-theme');
const body = document.querySelector('body');
const highlightInfo = document.querySelector('.highlight__info');
const highlightSpans = document.querySelector('.highlight__genre-launch')

themeButton.addEventListener('click', function () {
    const movies = document.querySelectorAll('.movie')
    themeButton.src = themeButton.getAttribute('src') === "./assets/light-mode.svg" ? "./assets/dark-mode.svg" : "./assets/light-mode.svg"

    const newBackgroundColor = body.style.getPropertyValue('--background-color') === '#242424' ? '#FFF' : '#242424';
    body.style.setProperty('--background-color', newBackgroundColor);

    const newTextColor = body.style.getPropertyValue('--color') === '#FFF' ? '#000' : '#FFF';
    body.style.setProperty('--color', newTextColor);

    const newNextMovieColor = nextMovie.getAttribute('src') === './assets/seta-direita-preta.svg' ? './assets/seta-direita-branca.svg' : './assets/seta-direita-preta.svg';
    nextMovie.src = newNextMovieColor;

    const newPreviousMovieColor = previousMovie.getAttribute('src') === './assets/seta-esquerda-preta.svg' ? './assets/seta-esquerda-branca.svg' : './assets/seta-esquerda-preta.svg'
    previousMovie.src = newPreviousMovieColor;

    const newHighlightBackgroundColor = highlightInfo.style.getPropertyValue('--highlight-background') === '#5c5b5b' ? '#FFF' : '#5c5b5b';
    highlightInfo.style.setProperty('--highlight-background', newHighlightBackgroundColor);

    const newHighlightShadowBoxColor = getComputedStyle(highlightInfo).getPropertyValue('--shadow-color') === ' 0px 4px 8px rgba(0, 0, 0, 0.15)' ? '0px 4px 8px rgba(218, 216, 216, 0.336)' : ' 0px 4px 8px rgba(0, 0, 0, 0.15)';
    highlightInfo.style.setProperty('--shadow-color', newHighlightShadowBoxColor);

    movies.forEach(movie => {
        const newMovieShadowBoxColor = getComputedStyle(movie).getPropertyValue('--shadow-color') === ' 0px 4px 8px rgba(0, 0, 0, 0.15)' ? '0px 4px 8px rgba(218, 216, 216, 0.336)' : ' 0px 4px 8px rgba(0, 0, 0, 0.15)';
        movie.style.setProperty('--shadow-color', newMovieShadowBoxColor);
    })

    const newDescriptionColor = highlightDescription.style.getPropertyValue('--highlight-description') === '#FFF' ? '#000' : '#FFF';
    highlightDescription.style.setProperty('--highlight-description', newDescriptionColor);

    const newSpansColor = highlightSpans.style.getPropertyValue('--highlight-color') === '#FFF' ? 'rgba(0, 0, 0, 0.7)' : '#FFF';
    highlightSpans.style.setProperty('--highlight-color', newSpansColor);
})