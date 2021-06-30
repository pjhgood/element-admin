<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { redevicePixe } from '@/utils/universal'
export default {
  name: 'App',
  data() {
    return {
    }
  },
  watch: {
  },
  mounted() {
    redevicePixe()
  },
  methods: {
  }
}
</script>
