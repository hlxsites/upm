import { readBlockConfig, decorateIcons } from '../../scripts/scripts.js';

/**
 * collapses all open nav sections
 * @param {Element} sections The container element
 */

function collapseAllNavSections(sections) {
  sections.querySelectorAll('.nav-sections > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', 'false');
  });
}

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */

export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';

  // fetch nav content
  const navPath = cfg.nav || '/nav';
  const resp = await fetch(`${navPath}.plain.html`);
  if (resp.ok) {
    const html = await resp.text();

    // decorate nav DOM
    const nav = document.createElement('nav');
    nav.innerHTML = html;
    decorateIcons(nav);

    const classes = ['brand', 'top-links', 'sections', 'tools'];
    classes.forEach((e, j) => {
      const section = nav.children[j];
      if (section) section.classList.add(`nav-${e}`);
    });

    const navSections = [...nav.children][2];
    if (navSections) {
      navSections.querySelectorAll(':scope > ul > li').forEach((navSection) => {
        if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
        navSection.addEventListener('click', () => {
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          collapseAllNavSections(navSections);
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        });
      });
    }

    nav.setAttribute('aria-expanded', 'false');

    decorateIcons(nav);
    block.append(nav);

    // Extract search bar config
    const $searchAnchor = block.querySelector('.nav-tools p a');
    const $searchPara = block.querySelector('.nav-tools p');
    if ($searchAnchor) {
      const searchHref = $searchAnchor.getAttribute('href');
      const searchIconClass = $searchAnchor.querySelector('span')?.classList;
      $searchPara.innerHTML = `
        <form action="${searchHref}">
            <input name="query" type="text" placeholder="Search" />
            <button type="submit">
                <span class="${searchIconClass.toString()}"></span>
            </button>
        </form>
      `;
      decorateIcons($searchPara);
    }
  }
}
