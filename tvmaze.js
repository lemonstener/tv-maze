async function searchShows(query) {
  const res = await axios.get(`http://api.tvmaze.com/search/shows?q=${query}`);
  const tvArr = [];
  for (let show of res.data) {
    getEpisodes(show.show.id);
    tvArr.push(
      {
        id: show.show.id,
        name: show.show.name,
        summary: show.show.summary,
        image: show.show.image ? show.show.image.medium : 'https://pbs.twimg.com/profile_images/1027586212234768385/c0hzVIBb_400x400.jpg'
      }
    )
  }
  return tvArr;
}


function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    const $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
           <img class='card-img-top' src=${show.image}>
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
           </div>
         </div>
       </div>
      `);
    $showsList.prepend($item);
  }
  document.querySelector('#search-query').value = '';
}


$("#search-form").on("submit", async function handleSearch(evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  const res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  const episodeArr = [];
  for (let el of res.data) {
    episodeArr.push(
      {
        id: el.id,
        name: el.name,
        season: el.season,
        number: el.number
      }
    )
  }
  return episodeArr;
}

function populateEpisodes(arr) {
  const $episodesList = $("#episode-area");
  $episodesList.empty();

  for (let episode of arr) {
    const $item = $(
      `<li>
         ${episode.name}
         (season ${episode.season}, episode ${episode.number})
       </li>
      `);

    $episodesList.append($item);
  }
  $("#episodes-area").show();
}
