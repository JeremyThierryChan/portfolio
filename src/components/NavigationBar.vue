<template>
  <nav class="NavigationBar">
    <ul class="nav-links">
      <li><router-link to="/">Home</router-link></li>

      <li class="dropdown" @mouseenter="showAboutDropdown" @mouseleave="hideAboutDropdown">
        <router-link to="/about">About</router-link>
        <ul class="dropdown-menu" v-show="isAboutDropdownVisible">
          <li><router-link to="/about">About Me</router-link></li>
          <li><router-link to="/about/timeline">Timeline</router-link></li>
          <li><router-link to="/about/skills">Skills</router-link></li>
        </ul>
      </li>

      <li><router-link to="/projects">Projects</router-link></li>
      <li><router-link to="/blog">Blog</router-link></li>
      <li><router-link to="/contact">Contact</router-link></li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'NavigationBar',
  data() {
    return {
      isAboutDropdownVisible: false,
    };
  },
  methods: {
    showAboutDropdown() {
      this.isAboutDropdownVisible = true;
    },
    hideAboutDropdown() {
      this.isAboutDropdownVisible = false;
    },
  },
};
</script>

<style scoped>
.NavigationBar {
  background-color: #2b2b2b;
  padding: 15px 30px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
  position: sticky;
  top: 0;
  z-index: 100;
  transition: background-color 0.3s ease-in-out;
}

.NavigationBar:hover {
  background-color: #3c3c3c;
}

.nav-links {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 30px;
  justify-content: center;
}

.nav-links li {
  font-size: 12px;
  font-weight: bold;
  position: relative;
}

.nav-links a {
  color: #dcdcdc;
  text-decoration: none;
  padding: 10px 0;
  position: relative;
  transition: color 0.3s ease, transform 0.3s ease;
}

.nav-links a::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 2px;
  background-color: #ffb86c;
  bottom: 5px;
  left: 0;
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.nav-links a:hover {
  color: #ffb86c;
  transform: scale(1.1);
}

.nav-links a:hover::after {
  transform: scaleX(1);
}

.dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 150%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #2b2b2b;
  list-style: none;
  padding: 8px 0;
  margin: 0;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  min-width: 140px;
  z-index: 99;
}

.dropdown-menu li {
  font-size: 12px;
  white-space: nowrap;
}

.dropdown-menu li a {
  display: block;
  padding: 10px 20px;
  color: #dcdcdc;
  text-decoration: none;
  transition: background-color 0.2s ease, color 0.2s ease;
  transform: none;
}

.dropdown-menu li a:hover {
  background-color: #3c3c3c;
  color: #ffb86c;
  transform: none;
}

.dropdown-menu li a::after {
  display: none;
}

@media (max-width: 768px) {
  .nav-links {
    gap: 15px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .dropdown-menu {
    min-width: 120px;
  }
}
</style>
