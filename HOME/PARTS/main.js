document.addEventListener("DOMContentLoaded", function () {
  const navToggle = document.getElementById("nav-toggle");
  const navList = document.getElementById("nav-list");
  const navItems = document.querySelectorAll(".nav-item");

  // Toggle navigation for mobile
  navToggle.addEventListener("click", function () {
      navList.classList.toggle("show");
  });

  // Smooth scrolling and active link highlighting
  navItems.forEach(item => {
      item.addEventListener("click", function () {
          // Remove active class from all items
          navItems.forEach(i => i.classList.remove("active"));
          // Add active class to the clicked item
          this.classList.add("active");
          
          // Scroll to the corresponding section
          const sectionId = `section${this.getAttribute('data-section')}`;
          document.getElementById(sectionId).scrollIntoView({
              behavior: 'smooth'
          });
      });
  });
});
