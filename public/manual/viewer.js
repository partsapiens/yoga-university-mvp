async function init() {
  const manifest = await fetch('manifest.json').then(res => res.json());
  const pages = manifest.pages;
  let index = 0;

  const contentEl = document.getElementById('content');
  const pageLabel = document.getElementById('page-label');
  const input = document.getElementById('page-input');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');

  input.min = 1;
  input.max = pages.length;

  function render() {
    fetch(pages[index])
      .then(res => res.text())
      .then(html => {
        contentEl.innerHTML = html;
        pageLabel.textContent = `Page ${index + 1} / ${pages.length}`;
        input.value = index + 1;
      });
  }

  prevBtn.addEventListener('click', () => {
    if (index > 0) {
      index--;
      render();
    }
  });

  nextBtn.addEventListener('click', () => {
    if (index < pages.length - 1) {
      index++;
      render();
    }
  });

  input.addEventListener('change', () => {
    const val = parseInt(input.value, 10);
    if (!isNaN(val) && val >= 1 && val <= pages.length) {
      index = val - 1;
      render();
    }
  });

  render();
}

init();
