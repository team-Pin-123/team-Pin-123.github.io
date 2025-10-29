document.addEventListener('DOMContentLoaded', () => {
  // Проверяем, на какой мы странице, по классу <body>
  if (document.body.classList.contains('fullscreen-page')) {
    // --- ЛОГИКА СЛАЙДЕРА (работает только на главной) ---
    const sliderWrapper = document.querySelector('.slider-wrapper')
    const slides = document.querySelectorAll('.slide')
    const navItems = document.querySelectorAll('.nav-item')
    const navIndicator = document.querySelector('.nav-indicator')

    if (!sliderWrapper || !slides.length || !navItems.length || !navIndicator)
      return

    function goToSlide(slideIndex) {
      sliderWrapper.style.transform = `translateX(-${slideIndex * 100}%)`

      navItems.forEach((item) => item.classList.remove('active'))
      navItems[slideIndex].classList.add('active')

      const activeNavItem = navItems[slideIndex]
      const indicatorWidth = activeNavItem.offsetWidth
      const indicatorLeft = activeNavItem.offsetLeft
      navIndicator.style.width = `${indicatorWidth}px`
      navIndicator.style.transform = `translateX(${indicatorLeft}px)`

      slides.forEach((slide) => slide.classList.remove('active'))
      slides[slideIndex].classList.add('active')

      const currentCaption = slides[slideIndex].querySelector('.slide-caption')
      if (currentCaption) {
        anime.timeline({ easing: 'easeOutExpo' }).add({
          targets: currentCaption.children,
          translateY: [20, 0],
          opacity: [0, 1],
          duration: 800,
          delay: anime.stagger(100, { start: 300 }),
        })
      }
    }

    navItems.forEach((item) => {
      item.addEventListener('click', () => {
        const slideIndex = parseInt(item.dataset.slide, 10)
        goToSlide(slideIndex)
      })
    })

    // Небольшая задержка, чтобы браузер успел рассчитать размеры
    setTimeout(() => {
      goToSlide(0)
    }, 100)
  }

  // Другие скрипты для всех страниц можно писать здесь
})
