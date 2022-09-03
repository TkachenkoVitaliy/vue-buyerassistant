<template>
  <div class="main_container">
    <router-view />
    <StatusMessageDialog />
  </div>
</template>

<script>
import StatusMessageDialog from '@/components/other/StatusMessageDialog'

export default {
  components: {StatusMessageDialog},
}
</script>

<style>
  .main_container {
    width: 100%;
    background-color: white;
    padding: 20px 40px;
    top: 0;
    left: 0;
    min-height: 100%;
  }
</style>