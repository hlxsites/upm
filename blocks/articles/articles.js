import {
  fetchIndex,
  readBlockConfig,
} from '../../scripts/scripts.js';

export default async function decorate(block) {
  const config = readBlockConfig(block);
  block.innerHTML = '';

  const newsIndex = await fetchIndex('query-index');

  let rawNews = newsIndex.data;
  rawNews = rawNews.filter((news) => news.tags.includes('article'));

  rawNews.forEach((newsItem) => {
    const eachNews = document.createElement('div');
    eachNews.classList.add('news');
    eachNews.innerHTML = `
      <a href="${newsItem.path}" target="_blank">
        <img src="${newsItem.image}" />
      </a>
      <h2>${newsItem.title}</h2>
      <a href="${newsItem.path}" target="_blank">Read More</a>
    `;
    block.appendChild(eachNews);
  });
}