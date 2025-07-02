const galleries = [
  {
    containerId: 'galeri-proyek',
    imagePrefix: 'galeri-proyek-',
    imageCount: 50,
  },
  {
    containerId: 'galeri-sosial',
    imagePrefix: 'galeri-sosial-',
    imageCount: 40,
  },
  {
    containerId: 'galeri-penghargaan',
    imagePrefix: 'galeri-penghargaan-',
    imageCount: 17,
  },
];

document.addEventListener('DOMContentLoaded', () => {
  galleries.forEach(({ containerId, imagePrefix, imageCount }) => {
    const container = document.querySelector(`#${containerId} .gallery-track`);
    if (!container) return;

    // Clear existing content
    container.innerHTML = '';

    // Generate images and duplicates for infinite scroll
    for (let i = 1; i <= imageCount; i++) {
      const img = createImageElement(imagePrefix, i);
      container.appendChild(img);
    }
    for (let i = 1; i <= imageCount; i++) {
      const img = createImageElement(imagePrefix, i);
      container.appendChild(img);
    }

    setupSlider(container.parentElement, container);
  });
});

function createImageElement(prefix, index) {
  const img = document.createElement('img');
  img.src = `assets/${prefix}${index}.jpg`;
  img.alt = `${prefix.replace(/-/g, ' ')} ${index}`;
  img.className = 'rounded-lg w-48 aspect-[4/3] object-cover shadow cursor-grab';
  img.draggable = false;
  return img;
}

function setupSlider(container, track) {
  let isHover = false;
  let isDragging = false;
  let startX = 0;
  let scrollLeft = 0;
  let animationId;
  let speed = 1; // px per frame
  let pos = 0;

  function getSliderWidth() {
    return track.scrollWidth / 2;
  }

  function animate() {
    if (!isHover && !isDragging) {
      pos -= speed;
      if (Math.abs(pos) >= getSliderWidth()) {
        pos = 0;
      }
      track.style.transform = `translateX(${pos}px)`;
    }
    animationId = requestAnimationFrame(animate);
  }

  container.addEventListener('mouseenter', () => { isHover = true; });
  container.addEventListener('mouseleave', () => { isHover = false; });

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX - track.offsetLeft;
    scrollLeft = pos;
    container.classList.add('cursor-grabbing');
  });
  container.addEventListener('mouseleave', () => {
    isDragging = false;
    container.classList.remove('cursor-grabbing');
  });
  container.addEventListener('mouseup', () => {
    isDragging = false;
    container.classList.remove('cursor-grabbing');
  });
  container.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = x - startX;
    pos = scrollLeft + walk;
    if (Math.abs(pos) >= getSliderWidth()) {
      pos = 0;
    }
    track.style.transform = `translateX(${pos}px)`;
  });

  container.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].pageX - track.offsetLeft;
    scrollLeft = pos;
  });
  container.addEventListener('touchend', () => {
    isDragging = false;
  });
  container.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - track.offsetLeft;
    const walk = x - startX;
    pos = scrollLeft + walk;
    if (Math.abs(pos) >= getSliderWidth()) {
      pos = 0;
    }
    track.style.transform = `translateX(${pos}px)`;
  });

  animate();
}
