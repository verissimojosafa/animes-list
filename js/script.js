const api = "https://kitsu.io/api/edge";
const endpoint = "/anime";
let selectedAnimeContainer = null;
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

const moreInformation = ({ synopsis, name, image, youtubeVideoId }) => {
  const figure = document.createElement("figure");
  const figcaption = document.createElement("figcaption");
  const img = document.createElement("img");
  const p = document.createElement("p");
  const hr = document.createElement("hr");
  figure.appendChild(img);
  figure.appendChild(figcaption);
  figcaption.textContent = name;
  img.src = image;
  img.classList.add("img-fluid");
  p.textContent = synopsis;

  selectedAnimeContainer.querySelector("div.animes-info").appendChild(figure);
  selectedAnimeContainer.querySelector("div.animes-info").appendChild(p);
  selectedAnimeContainer.querySelector("div.animes-info").appendChild(hr);
};

const mountList = (animes) => {
  const ul = document.createElement("ul");

  animes.forEach((anime) => {
    const li = document.createElement("li");
    const figure = document.createElement("figure");
    const figcaption = document.createElement("figcaption");
    const img = document.createElement("img");

    li.onclick = () => {
      moreInformation(anime);
    };
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

const setSelectedAnimeContainer = (element) => {
  selectedAnimeContainer = element;
};
