<template>
    <form class="flex flex-col w-[600px] border border-gray-500 rounded-md my-6 p-4" @submit.prevent="login">
        <h1 class="self-start text-lg font-bold mb-3">Login</h1>
        <div class="flex flex-col space-y-2 mb-3">
            <label class="self-start uppercase lg:text-xs text-[10px] text-gray-500 font-bold" for="email">Email</label>
            <input id="email" type="email" class="rounded-lg p-2 text-sm lg:text-base font-bold border border-black" v-model="email" />
        </div>
        <div class="flex flex-col space-y-2 mb-3">
            <label class="self-start uppercase lg:text-xs text-[10px] text-gray-500 font-bold" for="password">Password</label>
            <input id="password" type="password" class="rounded-lg p-2 text-sm lg:text-base font-bold border border-black" v-model="password"/>
        </div>
        <div class="mb-3 flex flex-col self-center items-center">
            <h1 class="text-xs italic mb-3 text-red-500" v-if="err"> {{ err }}</h1>
            <button
                class="px-2 py-1 w-[150px] text-sm rounded-lg"
                :class="{'bg-[#0C4689] text-white': !formLoading, 'bg-gray-300 cursor-none': formLoading}"
                :disabled="formLoading"
                >
                {{ formLoading ? 'Loading...' : 'Login' }}
            </button>
        </div>
        
        <h1 class="">
            Do not have an account? <router-link class="underline" :to="{name: 'RegisterView', query: { to: route.query.to ?? null }}">Register</router-link> instead.
        </h1>
    </form>
</template>
<script setup>
import { useService } from '@/components/apiService'
import ProjectService from '@/services/ProjectService'
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
let email = ref('')
let password = ref('')
let err = ref('')
let formLoading = ref(false)
const service = useService()

function login() {
    if(email.value.length < 1 || password.value.length < 1)
    {
        err.value = 'Please fill all of the required fields'
        return false
    }

    formLoading.value = true

    service.apiService(ProjectService.login, [], { email: email.value, password: password.value }).then((result) => {
        if(result.message == 'failed') {
            err.value = result.message
        }
        else {
            console.log('result.data', result.data)
            console.log(result.data)
            localStorage.setItem('access_token', result.data)

            if(route.query.to) {
                router.push(route.query.to)
            }
            else {
        
                router.push({ name: 'HomeView' })
            }
        }
    })
    .catch((err) => { err.value = err })
    .finally(() => { formLoading.value = false })
}

</script>