document.addEventListener('DOMContentLoaded', () => {
  if (document.body.classList.contains('fullscreen-page')) {
    const sliderContainer = document.querySelector('.slider-container')
    const sliderWrapper = document.querySelector('.slider-wrapper')
    const slides = document.querySelectorAll('.slide')

    // --- НОВАЯ ЛОГИКА ---
    const sliderNav = document.querySelector('.slider-nav') // Получаем родительский контейнер
    const navItems = document.querySelectorAll('.nav-item')
    // --- КОНЕЦ НОВОЙ ЛОГИКИ ---

    const mobileNavContainer = document.querySelector('.slider-nav-mobile')
    let navDots = []

    if (!sliderWrapper || !slides.length) return

    let currentSlide = 0
    const totalSlides = slides.length

    function init() {
      for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button')
        dot.classList.add('nav-dot')
        dot.dataset.slide = i
        mobileNavContainer.appendChild(dot)
        navDots.push(dot)
      }

      navItems.forEach((item) => {
        item.addEventListener('click', () => goToSlide(parseInt(item.dataset.slide, 10)))
      })
      navDots.forEach((dot) => {
        dot.addEventListener('click', () => goToSlide(parseInt(dot.dataset.slide, 10)))
      })

      initSwipe()
      // Небольшая задержка, чтобы браузер успел рассчитать размеры элементов
      setTimeout(() => goToSlide(0), 100)
    }

    function goToSlide(slideIndex) {
      if (slideIndex < 0 || slideIndex >= totalSlides) return;

      sliderWrapper.style.transform = `translateX(-${slideIndex * 100}%)`

      // --- НОВАЯ ЛОГИКА ДЛЯ ИНДИКАТОРА ---
      if (navItems.length && sliderNav) {
        navItems.forEach((item) => item.classList.remove('active'))
        const activeNavItem = navItems[slideIndex]
        activeNavItem.classList.add('active')

        const indicatorWidth = activeNavItem.offsetWidth
        const indicatorOffset = activeNavItem.offsetLeft

        // Обновляем CSS-переменные
        sliderNav.style.setProperty('--indicator-width', `${indicatorWidth}px`)
        sliderNav.style.setProperty('--indicator-offset', `${indicatorOffset}px`)
      }
      // --- КОНЕЦ НОВОЙ ЛОГИКИ ---

      if (navDots.length) {
        navDots.forEach((dot) => dot.classList.remove('active'))
        navDots[slideIndex].classList.add('active')
      }

      slides.forEach((slide) => slide.classList.remove('active'))
      slides[slideIndex].classList.add('active')
      const currentCaption = slides[slideIndex].querySelector('.slide-caption')
      if (currentCaption) {
        anime({
          targets: currentCaption.children,
          translateY: [20, 0],
          opacity: [0, 1],
          duration: 800,
          delay: anime.stagger(100, {start: 300}),
          easing: 'easeOutExpo',
        })
      }
      currentSlide = slideIndex
    }

    function initSwipe() {
      let startX = 0, diffX = 0, isSwiping = false
      sliderContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX
        isSwiping = true
        sliderWrapper.style.transition = 'none'
      })
      sliderContainer.addEventListener('touchmove', (e) => {
        if (!isSwiping) return
        diffX = e.touches[0].clientX - startX
        sliderWrapper.style.transform = `translateX(calc(-${currentSlide * 100}% + ${diffX}px))`
      })
      sliderContainer.addEventListener('touchend', () => {
        if (!isSwiping) return
        isSwiping = false
        sliderWrapper.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)'
        if (diffX < -50 && currentSlide < totalSlides - 1) {
          goToSlide(currentSlide + 1)
        } else if (diffX > 50 && currentSlide > 0) {
          goToSlide(currentSlide - 1)
        } else {
          goToSlide(currentSlide)
        }
        diffX = 0
      })
    }

    init()
  }
})