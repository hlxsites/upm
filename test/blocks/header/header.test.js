/* eslint-disable no-unused-expressions */

import { readFile } from '@web/test-runner-commands';

document.body.innerHTML = await readFile({ path: '../../scripts/dummy.html' });

const { buildBlock, decorateBlock, loadBlock } = await import('../../../scripts/scripts.js');

document.body.innerHTML = await readFile({ path: '../../scripts/body.html' });

const sleep = async (time = 1000) => new Promise((resolve) => {
  setTimeout(() => {
    resolve(true);
  }, time);
});

const headerBlock = buildBlock('header', [['Nav', '/test/blocks/header/nav']]);
document.querySelector('header').append(headerBlock);
decorateBlock(headerBlock);
await loadBlock(headerBlock);
await sleep(1000);
