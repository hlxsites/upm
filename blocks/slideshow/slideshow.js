function getCurrentSlideIndex($block) {
  return [...$block.children].findIndex(($child) => $child.getAttribute('active') === 'true');
}

export default async function decorate($block) {
  const numChildren = $block.children.length;
  $block.children[0].setAttribute('active', true);
  $block.children[numChildren - 1].setAttribute('prev', true);
  $block.children[1].setAttribute('next', true);

  // create wrapper for slides
  const $slidesContainer = document.createElement('div');
  $slidesContainer.innerHTML = $block.innerHTML;
  $block.innerHTML = '';
  $block.prepend($slidesContainer);
  $slidesContainer.classList.add('slides-container');

  // create controls
  const $controlsContainer = document.createElement('div');
  $controlsContainer.classList.add('controls-container');
  $controlsContainer.innerHTML = `
    <button name="prev">Prev</button>
    <button name="next">Next</button>
  `;
  $block.prepend($controlsContainer);

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
