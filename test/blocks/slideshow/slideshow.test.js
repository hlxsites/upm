/* eslint-disable no-unused-expressions */
/* global describe it */

import { readFile } from '@web/test-runner-commands';
import chaiAsPromised from '@esm-bundle/chai-as-promised';
import chai from '@esm-bundle/chai';

chai.use(chaiAsPromised);
const { expect } = chai;

document.body.innerHTML = await readFile({ path: './slideshow.plain.html' });

await import('../../../scripts/scripts.js');
const decorate = (await import('../../../blocks/slideshow/slideshow.js')).default;
await decorate(document.querySelector('.slideshow'));

describe('Slideshow block is built', () => {
  it('Displays slideshow sections', async () => {
    const slides = document.querySelector('.slideshow');
    expect(slides).to.exist;
    const controls = document.querySelector('.controls-container');
    expect(controls).to.exist;
    const tabBar = document.querySelector('.tab-bar-container');
    expect(tabBar).to.exist;
    const socialLinks = document.querySelector('.social-links');
    expect(socialLinks).to.exist;
  });

  it('Updates the slide on next button click', async () => {
    const nextButton = document.querySelector('.controls-container > button[name="next"]');
    const slidesContainer = document.querySelector('.slides-container');

    expect(slidesContainer.children[0].getAttribute('active')).to.equal('true');
    expect(slidesContainer.children[1].getAttribute('active')).to.be.null;
    nextButton.click();
    expect(slidesContainer.children[0].getAttribute('active')).to.be.null;
    expect(slidesContainer.children[1].getAttribute('active')).to.equal('true');
    expect(slidesContainer.getAttribute('style')).to.equal('transform: translateX(-100vw);');
  });
});
