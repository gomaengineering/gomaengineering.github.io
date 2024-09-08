// show navbar after certain scroll

const navE = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY >= 50) {
        navE.classList.add('navbar-scroll');
    } else if (window.scrollY < 50) {
        navE.classList.remove('navbar-scroll');
    }
});

// click anywhere to close navbar

    document.addEventListener('DOMContentLoaded', function () {
        document.addEventListener('click', function (event) {
            var navbarToggler = document.querySelector('.navbar-toggler');
            var navbarCollapse = document.querySelector('.navbar-collapse');
            var isClickInsideNavbar = navbarCollapse.contains(event.target);
            var isNavbarToggler = navbarToggler.contains(event.target);
            var isDropdownToggle = event.target.classList.contains('dropdown-toggle');
            var isDropdownMenu = event.target.classList.contains('dropdown-menu');

            if (!isClickInsideNavbar && !isNavbarToggler && !isDropdownToggle && !isDropdownMenu && navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
        });
  });





// file not used after this line

// document.addEventListener('DOMContentLoaded', function() {
//     const navbarToggler = document.getElementById('navbar-toggler');
//     const navbarCollapse = document.getElementById('navbarSupportedContent');
//     const navbarIcon = document.getElementById('navbar-icon');
  
//     navbarToggler.addEventListener('click', function() {
//       navbarCollapse.classList.toggle('show');
//       if (navbarCollapse.classList.contains('show')) {
//         navbarIcon.classList.remove('bi-list');
//         navbarIcon.classList.add('bi-x');
//       } else {
//         navbarIcon.classList.remove('bi-x');
//         navbarIcon.classList.add('bi-list');
//       }
//     });
//   });
  