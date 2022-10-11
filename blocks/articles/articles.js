import {
  fetchIndex,
} from '../../scripts/scripts.js';

function readColumns(block, tableRowDescription) {
  const numColumns = block.children[0]?.children?.length ?? 0;
  // eslint-disable-next-line no-new-object
  const table = Array.from({ length: numColumns }, () => new Object());
  const $rows = [...block.children];

  $rows.forEach(($row, i) => {
    const currentRowDescription = tableRowDescription[i];

    [...$row.children].forEach((item, columnNumber) => {
      if (columnNumber > numColumns) {
        console.warn('Article with inconsistent column numbers');
        return;
      }

      table[columnNumber][currentRowDescription] = item.innerHTML;
    });
  });

  return table;
}

export default async function decorate(block) {
  const columns = readColumns(block, ['title', 'tag', 'layout']);
  block.innerHTML = '';

  const newsIndex = await fetchIndex('query-index');

  columns.map(async ({ title, tag, layout }) => {
    const $col = document.createElement('div');
    $col.classList.add('article-column', layout);

    if (title) {
      $col.innerHTML = title;
    }

    let rawNews = newsIndex.data;
    rawNews = rawNews.filter((news) => news.tags.includes(tag));

    rawNews.forEach((newsItem) => {
      const eachNews = document.createElement('div');
      if (newsItem.image) {
        eachNews.innerHTML += `
      <a href="${newsItem.path}" target="_blank">
        <img src="${newsItem.image}" />
      </a>
      `;
      }
      if (layout !== 'banner-style') {
        eachNews.innerHTML += `
        <h2>${newsItem.title}</h2>
        <div class="article-link"><a href="${newsItem.path}" target="_blank" >Read More</a></div>
      `;
      }
      $col.appendChild(eachNews);
    });

    block.append($col);
  });
}
