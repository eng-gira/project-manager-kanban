<template>
    <form class="flex flex-col w-[600px] border border-gray-500 rounded-md my-6 p-4" @submit.prevent="register">
        <h1 class="self-start text-lg font-bold mb-3">Register</h1>
        <div class="mb-3 flex flex-col w-[400px] self-center">
            <label class="font-bold self-start" for="name">Name</label>
            <input v-model="name" type="text" id="name" placeholder="Name" class="p-2 text-sm border border-black rounded-md flex-grow bg-transparent"/>
            <!-- <h1 class="text-sm italic mt-3"></h1> -->
        </div>
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
            <h1 class="text-xs italic mb-3 text-red-500" v-if="err">{{ err }}</h1>
            <button
                class="px-2 py-1 w-[150px] text-sm rounded-lg bg-blue-300 hover:bg-blue-500 hover:text-white"
                :class="{'bg-blue-300 hover:bg-blue-500 hover:text-white': !formLoading, 'bg-gray-300 cursor-none': formLoading}"
                :disabled="formLoading"
                >
                {{ formLoading ? 'Loading...' : 'Register' }}
            </button>
        </div>
        
        <h1 class="">
            Already have an account? <router-link class="underline" :to="{name: 'LoginView', query: { to: this.$route.query.to ?? null }}">Login</router-link> instead.
        </h1>
    </form>
</template>
<script setup>
import ProjectService from '@/services/ProjectService'
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

let name = ref('')
let email = ref('')
let password = ref('')
let err = ref('')
let formLoading = ref(false)

function register() {
    if(name.value.length < 1 || email.value.length < 1 || password.value.length < 1)
    {
        err.value = 'Please fill all of the required fields'
        return false
    }

    formLoading.value = true

    ProjectService.register(JSON.stringify({ name: name.value, email: email.value, password: password.value })).then((resp) => {
        if(resp.data.message == 'failed') {
            err.value = resp.data.data
        }
        else {
            console.log(resp.data.access_token)
            localStorage.setItem('access_token', resp.data.access_token)
            localStorage.setItem('refresh_token', resp.data.refresh_token)

            if(route.query.to)
            {
                router.push(route.query.to)
            }
            else {
                router.push({ name: 'HomeView' })
            }
        }
    }).finally(() => {
        formLoading.value = false
    })

    // localStorage.setItem('auth', 'no specific val required')
}

</script>