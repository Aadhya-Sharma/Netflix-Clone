// Consts
const apikey ="80a8ac830a6840dfa013c06ff760caaf";
const apiEndpoint = "https://api.themoviedb.org/3";
const imagePath = "https://image.tmdb.org/t/p/original";
const apiPaths = {
    fetchAllCategories: `${apiEndpoint}/genre/movie/list?api_key=${apikey}`,

    fetchMoviesList: (id) => `${apiEndpoint}/discover/movie?api_key=${apikey}&with_genres=${id}`,

    fetchTrending:`${apiEndpoint}/trending/all/day?api_key=${apikey}&language=en-US`
}

// Boots up the app

function init() {
    fetchTrendingMovies();
    fetchAndBuildAllSections();
}

// TRENDING MOVIES

function fetchTrendingMovies(){
    fetchAndBuildSection(apiPaths.fetchTrending, 'Trending Now')
    .then(list => {
        const randomIndex = parseInt(Math.random() * list.length);
        buildBannerSection(list[randomIndex]);
    })
    .catch(err=>{
        console.error(err);
    });
}

// BANNER SECTION

function buildBannerSection(movie){
    const bannerCont = document.getElementById('banner-section');
    
    bannerCont.style.backgroundImage = `url('${imagePath}${movie.backdrop_path}')`;

    const div = document.createElement('div');

    div.innerHTML = `
            <h2 class="banner-title">${movie.title}</h2>
            <p class="banner-info">Trending in movies | Released - ${movie.release_date} </p>
            <p class="banner-overview">${movie.overview && movie.overview.length > 200 ? movie.overview.slice(0,200).trim()+ '...':movie.overview}</p>
            <div class="action-buttons-cont">
                <button class="action-button"><i class='bx bx-play'></i> Play</button>
                <button class="action-button"><i class='bx bx-info-circle'></i>  More Info</button>
            </div>`;
    div.className = "banner-content";

    bannerCont.append(div);
}

// GENRE SECTION

function fetchAndBuildAllSections(){
    fetch(apiPaths.fetchAllCategories)
    .then(res=>res.json())
    .then(res=>{
        const categories=res.genres;
        if(Array.isArray(categories) && categories.length){
           categories.forEach(category=> {
            fetchAndBuildSection(
                apiPaths.fetchMoviesList(category.id),category.name);
           });
        }
    })
    .catch(err=>console.error(err));
}

function fetchAndBuildSection(fetchUrl,categoryName){
    console.log(fetchUrl,categoryName);
    return fetch(fetchUrl)
    .then(res=>res.json())
    .then(res=>{
        const movies=res.results;
        if(Array.isArray(movies) && movies.length){
            buildMoviesSection(movies.slice(0,5),categoryName);
        }
        return movies;
    })
    .catch(err=>console.error(err))
}

// MOVIES SECTION

function buildMoviesSection(list,categoryName){
    console.log(list,categoryName);

    const moviesCont = document.getElementById('movies-container');

    const moviesList = list.map(item=>{
        return `<img class="movie" src="${imagePath}${item.backdrop_path}" alt="${item.title}">`;
    }).join('');

    const moviesSection = ` 
        <h2 class="heading">${categoryName}<span class="explore">Explore All<i class='bx bx-chevron-right'></i></span>
        </h2>
        <div class="movies-row">
            ${moviesList}
        </div>`

    const div = document.createElement('div');
    div.className="movies-section";
    div.innerHTML= moviesSection;
    moviesCont.append(div);
}

window.addEventListener('load',function() {
    init();
    window.addEventListener('scroll', function(){
        // header ui update
        const header = document.getElementById('header');
        if (window.scrollY > 5) header.classList.add('black-bg')
        else header.classList.remove('black-bg');
    })
})