<template>
    <footer class="footer">
      <div class="container">
        <p>{{ $t('footer.rights') }}</p>
        <div class="social-links">
          <a href="https://www.instagram.com/jeremy.thierry.chan/" target="_blank" aria-label="Instagram">
            <img src="@/assets/icons/instagram-icon.png" alt="Instagram" />
          </a>
          <a href="https://github.com/JeremyThierryChan" target="_blank" aria-label="GitHub">
            <img src="@/assets/icons/github-icon.png" alt="GitHub" />
          </a>
        </div>
      </div>
    </footer>
  </template>
  
  <script>
  export default {
    name: 'PageFooter',
  };
  </script>
  
  <style scoped>
  .footer {
    background-color: var(--bg-footer);
    color: var(--text-footer);
    padding: 20px 0;
    text-align: center;
    font-size: 14px;
    transition: background-color 0.3s ease, color 0.3s ease;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  .social-links {
    margin-top: 10px;
  }
  
  .social-links a {
    margin: 0 10px;
    display: inline-block;
  }
  
  .social-links img {
    width: 30px;
    height: 30px;
    transition: transform 0.3s ease;
  }
  
  .social-links img:hover {
    transform: scale(1.1);
  }
  </style>
  