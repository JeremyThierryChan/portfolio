<template>
  <section class="about">
    <div class="content">
      <h2>About Me</h2>
      <p>Hello! I'm Jeremy Thierry Chan. In this page, you will know more about me.</p>

      <!-- Role Selection -->
      <div class="role-selection">
        <label for="role">Choose my role:</label>
        <select v-model="selectedRole" id="role" class="role-select">
          <option value="developer">Developer</option>
          <option value="designer">Designer</option>
          <option value="manager">Project Manager</option>
          <option value="to be added">golfer</option>
        </select>
      </div>

      <!-- Display content based on selected role -->
      <div class="role-content">
        <!-- Developer Content -->
        <div v-if="selectedRole === 'developer'">
          <h3>Developer</h3>
          <ul>
            <li>Languages: JavaScript, Vue.js, Python</li>
            <li>Skills: Web Development, Software Engineering</li>
            <li>Passionate about building scalable and efficient solutions</li>
          </ul>
        </div>

        <!-- Designer Content -->
        <div v-if="selectedRole === 'designer'">
          <h3>Designer</h3>
          <ul>
            <li>Skills: UI/UX Design, Figma, Photoshop</li>
            <li>Passionate about creating intuitive and aesthetically pleasing designs</li>
            <li>Focused on user-centered design and experience</li>
          </ul>
        </div>

        <!-- Project Manager Content -->
        <div v-if="selectedRole === 'manager'">
          <h3>Project Manager</h3>
          <ul>
            <li>Skills: Project Planning, Team Coordination, Agile Methodology</li>
            <li>Experience in leading cross-functional teams</li>
            <li>Skilled in delivering projects on time and within scope</li>
          </ul>
        </div>

        <!-- To Be Added Content -->
        <div v-if="selectedRole === 'to be added'">
          <h3>To Be Added</h3>
          <ul>
            <li>Maybe I forgot to add Information as this role</li>
            <li>You can wait a bit or just contact me</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'AboutPage',
  data() {
    return {
      selectedRole: 'developer',  // Default role is 'developer'
    };
  },
};
</script>

<style scoped>
.about {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #2b2b2b, #3c3c3c); /* 深色背景渐变 */
  color: white;
  font-family: 'Arial', sans-serif;
}

.content {
  background: rgba(0, 0, 0, 0.7); /* 半透明背景，增强对比度 */
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5); /* 加阴影效果增加层次感 */
  max-width: 800px;
  width: 100%;
  transform: translateY(20px);
  animation: slideUp 1s ease-out forwards;
}

h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 20px;
  letter-spacing: 2px;
  animation: fadeIn 1.5s ease-in-out;
}

p {
  font-size: 1.3rem;
  line-height: 1.8;
  margin-bottom: 20px;
}

ul {
  list-style-type: none;
  padding: 0;
}

ul li {
  font-size: 1.2rem;
  line-height: 1.8;
  margin-bottom: 15px;
}

ul li::before {
  content: '• ';
  color: #ffb86c; /* PyCharm主题的橙色 */
  font-size: 1.5rem;
}

/* Role Selection Styling */
.role-selection {
  margin: 20px 0;
  font-size: 1.2rem;
}

.role-select {
  padding: 10px;
  font-size: 1rem;
  background-color: #444;
  color: white;
  border: none;
  border-radius: 5px;
  margin-left: 10px;
}

/* Add styles for each role section */
.role-content h3 {
  font-size: 1.8rem;
  font-weight: 600;
  margin-top: 20px;
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .about {
    padding: 20px;
  }

  h2 {
    font-size: 2rem;
  }

  p {
    font-size: 1.1rem;
  }

  ul li {
    font-size: 1rem;
  }
}
</style>
