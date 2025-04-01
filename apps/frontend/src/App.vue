<template>
  <div id="app-wrapper">
    <div id="app">
      <img src="./assets/chrono.png" alt="Chronotruck Logo" />
      <h3>Add a new truck</h3>
      <TruckForm />
      <TruckList />
    </div>
  </div>
</template>

<script setup lang="ts">
import TruckForm from "./views/TruckForm.vue";
import TruckList from "./views/TruckList.vue";
</script>

<style scoped>
body {
  margin: 0;
  font-family: "Segoe UI", sans-serif;
  background-color: #e5e7eb;
}

#app-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 91vh;
  overflow: hidden;
}

#app-wrapper::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("./assets/background.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0.9;
  z-index: 0;
}

#app {
  position: relative;
  z-index: 1;
  padding: 2rem;
  background: white;
  border-radius: 10px;
  max-width: 960px;
  width: 100%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

img {
  display: block;
  margin: 0 auto 1.5rem;
  max-width: 200px;
}

h3 {
  margin-bottom: 1rem;
  text-align: center;
  color: #1f2937;
}
</style>
