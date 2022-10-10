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
    <button name="prev">Prev</button>
    <button name="next">Next</button>
  `;
  $block.prepend($controlsContainer);

  const nextButton = $controlsContainer.querySelector('button[name="next"]');
  const prevButton = $controlsContainer.querySelector('button[name="prev"]');

  nextButton.addEventListener('click', () => {
    const currentIndex = getCurrentSlideIndex($block);
    const neg1 = (((currentIndex - 1) % numChildren) + numChildren) % numChildren;
    const add1 = (currentIndex + 1) % numChildren;
    const add2 = (currentIndex + 2) % numChildren;

    $block.children[neg1].removeAttribute('prev');
    $block.children[currentIndex].removeAttribute('active');
    $block.children[currentIndex].setAttribute('prev', true);
    $block.children[add1].setAttribute('active', true);
    $block.children[add1].removeAttribute('next');
    $block.children[add2].setAttribute('next', true);
  });

  prevButton.addEventListener('click', () => {
    const currentIndex = getCurrentSlideIndex($block);
    const neg2 = (((currentIndex - 2) % numChildren) + numChildren) % numChildren;
    const neg1 = (((currentIndex - 1) % numChildren) + numChildren) % numChildren;
    const add1 = (currentIndex + 1) % numChildren;

    $block.children[add1].removeAttribute('next');
    $block.children[currentIndex].removeAttribute('active');
    $block.children[currentIndex].setAttribute('next', true);
    $block.children[neg1].setAttribute('active', true);
    $block.children[neg1].removeAttribute('prev');
    $block.children[neg2].setAttribute('prev', true);
  });
}
