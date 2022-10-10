import { decorateIcons } from '../../scripts/scripts.js';
import ResumableInterval from './ResumeableInterval.js';

function getCurrentSlideIndex($block) {
  return [...$block.children].findIndex(($child) => $child.getAttribute('active') === 'true');
}

function updateSlide(nextIndex, $block) {
  const $slidesContainer = $block.querySelector('.slides-container');
  const $tabBar = $block.querySelector('.tab-bar-container');

  const currentIndex = getCurrentSlideIndex($slidesContainer);

  $slidesContainer.children[currentIndex].removeAttribute('active');
  $slidesContainer.children[nextIndex].setAttribute('active', true);

  $tabBar.querySelector('ol').children[currentIndex].querySelector('span').className = 'icon icon-circle';
  $tabBar.querySelector('ol').children[nextIndex].querySelector('span').className = 'icon icon-circle-fill';
  decorateIcons($tabBar.querySelector('ol'));

  $slidesContainer.style.transform = `translateX(-${nextIndex * 100}vw)`;
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
    updateSlide((currentIndex + 1) % numChildren, $block);
  });

  prevButton.addEventListener('click', () => {
    const currentIndex = getCurrentSlideIndex($slidesContainer);
    updateSlide((((currentIndex - 1) % numChildren) + numChildren) % numChildren, $block);
  });

  // create tab bar
  const $tabBar = document.createElement('div');
  $tabBar.classList.add('tab-bar-container');
  $tabBar.innerHTML = '<ol role="tablist"></ol>';
  [...$slidesContainer.children].forEach(($slide, i) => {
    const $tabBarButton = document.createElement('li');
    $tabBarButton.innerHTML = `<button class="control-button"><span class="icon icon-circle${i === 0 ? '-fill' : ''}" /></button>`;
    $tabBar.querySelector('ol').append($tabBarButton);
    $tabBarButton.querySelector('button').addEventListener('click', () => {
      updateSlide(i, $block);
    });
  });
  $block.append($tabBar);
  decorateIcons($tabBar);

  // auto-play
  const autoplayTimer = new ResumableInterval(7000, () => {
    const currentIndex = getCurrentSlideIndex($slidesContainer);
    updateSlide((currentIndex + 1) % numChildren, $block);
  });
  autoplayTimer.start();

  $block.addEventListener('mouseenter', () => {
    autoplayTimer.pause();
  });

  $block.addEventListener('mouseleave', () => {
    autoplayTimer.resume();
  });
}