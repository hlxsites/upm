function getCurrentSlideIndex($block) {
  return [...$block.children].findIndex(($child) => $child.getAttribute('active') === 'true');
}

export default async function decorate($block) {
  const numChildren = $block.children.length;
  $block.children[0].setAttribute('active', true);
  $block.children[numChildren - 1].setAttribute('prev', true);
  $block.children[1].setAttribute('next', true);

  // create controls
  const $controlsContainer = document.createElement('div');
  $controlsContainer.classList.add('controls-container');
  $controlsContainer.innerHTML = `
    <button name="next">Next</button>
    <button name="prev">Prev</button>
  `;
  $block.append($controlsContainer);

  const nextButton = $controlsContainer.querySelector('button[name="next"]');
  const prevButton = $controlsContainer.querySelector('button[name="prev"]');

  nextButton.addEventListener('click', () => {
    const currentIndex = getCurrentSlideIndex($block);
    $block.children[currentIndex].removeAttribute('active');
    $block.children[(currentIndex + 1) % numChildren].setAttribute('active', true);
  });

  prevButton.addEventListener('click', () => {
    const currentIndex = getCurrentSlideIndex($block);
    $block.children[currentIndex].removeAttribute('active');
    $block.children[(((currentIndex - 1) % numChildren) + numChildren) % numChildren].setAttribute('active', true);
  });
}
