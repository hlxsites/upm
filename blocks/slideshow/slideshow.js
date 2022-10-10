import { decorateIcons } from '../../scripts/scripts.js';

function getCurrentSlideIndex($block) {
  return [...$block.children].findIndex(($child) => $child.getAttribute('active') === 'true');
}

export default async function decorate($block) {
  const numChildren = $block.children.length;
  $block.children[0].setAttribute('active', true);
  $block.children[numChildren - 1].setAttribute('prev', true);
  $block.children[1].setAttribute('next', true);

  // set a11y properties
  $block.setAttribute('role', 'group');
  $block.setAttribute('aria-roledescription', 'carousel');

  // move slides into slides wrapper
  const $slidesContainer = document.createElement('div');
  $slidesContainer.innerHTML = $block.innerHTML;
  $block.innerHTML = '';
  $block.prepend($slidesContainer);
  $slidesContainer.classList.add('slides-container');

  [...$slidesContainer.children].forEach(($slide, i) => {
    // set slide a11y properties
    $slide.setAttribute('role', 'group');
    $slide.setAttribute('aria-roledescription', 'slide');
    $slide.setAttribute('aria-label', `Slide ${i} of ${numChildren}`);

    // Make the picture be the link
    const $anchor = $slide.querySelector('a');
    const $picture = $slide.querySelector('picture');
    $anchor.innerHTML = $picture.outerHTML;
    $picture.remove();
  });

  // create controls
  const $controlsContainer = document.createElement('div');
  $controlsContainer.classList.add('controls-container');
  $controlsContainer.innerHTML = `
    <button name="prev" aria-label="Previous Slide" class="control-button"><span class="icon icon-chevron-left" /></button>
    <button name="next" aria-label="Next Slide" class="control-button"><span class="icon icon-chevron-right" /></button>
  `;
  $block.append($controlsContainer);
  decorateIcons($controlsContainer);

  const nextButton = $controlsContainer.querySelector('button[name="next"]');
  const prevButton = $controlsContainer.querySelector('button[name="prev"]');

  nextButton.addEventListener('click', () => {
    const currentIndex = getCurrentSlideIndex($slidesContainer);
    const add1 = (currentIndex + 1) % numChildren;

    $slidesContainer.children[currentIndex].removeAttribute('active');
    $slidesContainer.children[add1].setAttribute('active', true);

    $slidesContainer.style.transform = `translateX(-${add1 * 100}vw)`;
  });

  prevButton.addEventListener('click', () => {
    const currentIndex = getCurrentSlideIndex($slidesContainer);
    const neg1 = (((currentIndex - 1) % numChildren) + numChildren) % numChildren;

    $slidesContainer.children[currentIndex].removeAttribute('active');
    $slidesContainer.children[neg1].setAttribute('active', true);

    $slidesContainer.style.transform = `translateX(-${neg1 * 100}vw)`;
  });
}
