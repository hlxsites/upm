import {
  fetchIndex,
  readBlockConfig,
} from '../../scripts/scripts.js';

export default async function decorate(block) {
  const config = readBlockConfig(block);
  const layout = config?.layout || 'news';
  block.classList.add(layout);
  block.innerHTML = '';

  const newsIndex = await fetchIndex('query-index');

  let rawNews = newsIndex.data;
  rawNews = rawNews.filter((news) => news.tags.includes(layout));

  rawNews.forEach((newsItem) => {
    const eachNews = document.createElement('div');
    if (newsItem.image) {
      eachNews.innerHTML += `
      <a href="${newsItem.path}" target="_blank">
        <img src="${newsItem.image}" />
      </a>
      `;
    }
    if (layout !== 'banner') {
      eachNews.innerHTML += `
        <h2>${newsItem.title}</h2>
        <a href="${newsItem.path}" target="_blank">Read More</a>
      `;
    }
    block.appendChild(eachNews);
  });
}
