<template>
    <div class="grid place-items-center mx-auto h-screen bg-[#F5F5F5] w-screen">
      <h1 v-if="errorType == '4xx'" class="text-2xl font-bold text-red-500">{{ route.params.status + ': ' + 'Unauthorized' }}</h1>
      <div v-if="errorType == '404'">
        <h1 class="text-2xl font-bold">{{ route.params.status + ': ' + 'Not Found'}}</h1>
        <h1 class="">Go to <router-link to="/" class="font-bold hover:underline">Home</router-link> Page?</h1>
      </div>
      <div v-if="errorType == '5xx'">
        <h1 class="text-2xl font-bold">A Problem has occurred.</h1>
        <h1 class="">Go to <router-link to="/" class="font-bold hover:underline">Home</router-link> Page?</h1>
      </div>
    </div>
 </template>
<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()
let status = parseInt(route.params.status)

let errorType = computed(() => {
  if(status < 500) {
    if(status == 404) return '404'
    else return '4xx'
  } else {
    return '5xx'
  }
})
</script>