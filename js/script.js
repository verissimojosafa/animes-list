const api = "https://kitsu.io/api/edge";
const endpoint = "/anime";
let animesInfoContainer = null;
const defaultConfig = {
  limit: 10,
  offset: 0,
  url: "",
};

const getDefaultConfig = () => {
  const oldDefaultconfig = { ...defaultConfig };
  defaultConfig.offset += 10;

  return oldDefaultconfig;
};

const getAnimes = ({ limit, offset, url }) => {
  const target = url || api + endpoint;
  const queryParams = "?page[limit]=" + limit + "&page[offset]=" + offset;

  return axios.get(target + queryParams);
};

const moreInformation = ({ id, synopsis, name, image, youtubeVideoId }) => {
  const div = document.createElement("div");
  const figure = document.createElement("figure");
  const figcaption = document.createElement("figcaption");
  const img = document.createElement("img");
  const p = document.createElement("p");
  const hr = document.createElement("hr");

  div.setAttribute("id", "anime-info-" + id);
  div.setAttribute("data-anime-id", id);

  div.appendChild(figure, animesInfoContainer.firstChild);
  div.appendChild(p, animesInfoContainer.firstChild);
  div.appendChild(hr, animesInfoContainer.firstChild);

  figure.appendChild(img);
  figure.appendChild(figcaption);

  figcaption.textContent = name;
  img.src = image;
  img.classList.add("img-fluid");
  p.textContent = synopsis;

  animesInfoContainer.insertBefore(div, animesInfoContainer.firstChild);
  gotoAnimeInfo(id);
};

const animeIsNotInTheList = (animeId) => {
  let isNotInTheList = true;
  Object.values(animesInfoContainer.children).forEach((anime) => {
    if (anime.dataset.animeId == animeId) {
      isNotInTheList = false;
      return;
    }
  });

  return isNotInTheList;
};

const gotoAnimeInfo = (animeId) => {
  window.location = "#anime-info-" + animeId;
};

const mountList = (animes) => {
  const ul = document.createElement("ul");

  animes.forEach((anime) => {
    const li = document.createElement("li");
    const figure = document.createElement("figure");
    const figcaption = document.createElement("figcaption");
    const img = document.createElement("img");
    animeIsNotInTheList(anime.id);
    li.onclick = () => {
      if (animeIsNotInTheList(anime.id)) moreInformation(anime);
      else gotoAnimeInfo(anime.id);
    };
    li.setAttribute("id", anime.id);
    li.classList.add("anime");
    li.appendChild(figure);
    figure.appendChild(img);
    figure.appendChild(figcaption);
    figcaption.textContent = anime.name;
    img.src = anime.image;
    img.classList.add("img-fluid");

    ul.appendChild(li);
  });

  return ul;
};

const adjustAnimeData = (animes) => {
  const animesList = animes.map((anime) => {
    const attributes = anime.attributes;
    const title = attributes.canonicalTitle;
    const coverImage = attributes.coverImage
      ? attributes.coverImage.original
      : attributes.posterImage.original;
    const data = {
      id: anime.id,
      name: title,
      image: coverImage,
      synopsis: attributes.synopsis,
      youtubeVideoId: attributes.youtubeVideoId || null,
    };

    return data;
  });

  return animesList;
};

const showAnimes = async (element) => {
  const config = getDefaultConfig();
  let animes = await getAnimes(config);
  animes = adjustAnimeData(animes.data.data);
  const animeList = mountList(animes);

  element.appendChild(animeList);
};

const resetDefaultConfig = () => {
  defaultConfig.limit = 10;
  defaultConfig.offset = 0;
  defaultConfig.url = "";
};

const setAnimesInfoContainer = (element) => {
  animesInfoContainer = element;
};
