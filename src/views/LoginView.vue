<template>
    <div class="flex flex-col w-[600px] border border-gray-500 rounded-md my-6 p-4">
        <h1 class="self-start text-lg font-bold mb-3">Login</h1>
        <div class="mb-3 flex flex-col w-[400px] self-center">
            <label class="font-bold self-start" for="email">Email</label>
            <input v-model="email" type="email" id="email" placeholder="Email" class="p-2 text-sm border border-black rounded-md flex-grow bg-transparent"/>
            <!-- <h1 class="text-sm italic mt-3"></h1> -->
        </div>
        <div class="mb-3 flex flex-col w-[400px] self-center">
            <label class="font-bold self-start" for="password">Password</label>
            <input v-model="password" type="password" id="password" placeholder="Password" class="p-2 text-sm border border-black rounded-md flex-grow bg-transparent"/>
            <!-- <h1 class="text-sm italic mt-3"></h1> -->
        </div>
        <div class="mb-3 flex flex-col self-center items-center">
            <h1 class="text-xs italic mb-3 text-red-500" v-if="err"> {{ err }}</h1>
            <button
                class="px-2 py-1 w-[150px] text-sm rounded-lg bg-blue-300 hover:bg-blue-500 hover:text-white"
                @click="login"
                >
                Login
            </button>
        </div>
        
        <h1 class="">
            Do not have an account? <router-link class="underline" :to="{name: 'RegisterView', query: { to: this.$route.query.to ?? null }}">Register</router-link> instead.
        </h1>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
let email = ref('')
let password = ref('')
let err = ref('')

function login() {
    if(email.value.length < 1 || password.value.length < 1)
    {
        err.value = 'Please fill all of the required fields'
        return false
    }

    localStorage.setItem('auth', 'no specific val required')
    if(route.query.to) {
        router.push(route.query.to)
    }
    else {

        router.push({ name: 'HomeView' })
    }
}

</script>