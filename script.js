const track = document.querySelector(".track");
const maxScroll = document.body.scrollHeight - innerHeight;

function animate() {
  const scrollY = window.scrollY;
  const progress = scrollY / maxScroll;

  const translateX = progress * (track.scrollWidth - innerWidth);

  track.style.transform = `translateX(-${translateX}px)`;

  requestAnimationFrame(animate);
}

animate();
