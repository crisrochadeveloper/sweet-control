<template>
  <q-page class="flex flex-col justify-center items-center gap-4">
    <img
      alt="Sweet Control"
      src="/imgs/logo-2.png"
      style="width: 350px; height: 350px"
    >
    <q-spinner-infinity size="70px" color="pink-6"/>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'IndexPage',
  mounted(){
    setTimeout(() => {
      this.$router.push('/login')
    },3000)
  }
});
</script>
