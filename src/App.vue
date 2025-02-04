<template>
  <div>
    <header class="container d-flex align-items-center my-2">
      <img src="@/assets/aiwsop-logo.svg" width="40" height="40" class="me-2" alt="AI Worldwide Simulation Online Poker 全球AI模拟在线扑克" />
      <div>
        <h1 class="fw-bold"><span class="text-primary">AI</span><span class="text-secondary">WSOP</span></h1>
        <div>AI Worldwide Simulation Online Poker</div>
      </div>
    </header>
    <NavBar />
    <RouterView />
  </div>
</template>
<script>
import NavBar from '@/components/NavBar.vue'
export default {
  name: 'App',
  components: {
    NavBar
  }
}
</script>
<style scoped>
h1 {
  font-size: 1rem;
  margin: 0;
}
h1 + div {
  font-size: 0.8rem;
  color: #6c757d;
}
</style>

