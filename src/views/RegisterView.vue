<template>
    <form class="flex flex-col w-[300px] lg:w-[400px] border border-gray-500 rounded-md my-6 p-4" @submit.prevent="register">
        <h1 class="self-start text-lg font-bold mb-3">Register</h1>
        <div class="flex flex-col space-y-2 mb-3">
            <label class="self-start uppercase lg:text-xs text-[10px] text-gray-500 font-bold" for="name">Name</label>
            <input id="name" type="text" class="rounded-lg p-2 text-sm lg:text-base font-bold border border-black" v-model="name" />
        </div>
        <div class="flex flex-col space-y-2 mb-3">
            <label class="self-start uppercase lg:text-xs text-[10px] text-gray-500 font-bold" for="email">Email</label>
            <input id="email" type="email" class="rounded-lg p-2 text-sm lg:text-base font-bold border border-black" v-model="email" />
        </div>
        <div class="flex flex-col space-y-2 mb-3">
            <label class="self-start uppercase lg:text-xs text-[10px] text-gray-500 font-bold" for="password">Password</label>
            <input id="password" type="password" class="rounded-lg p-2 text-sm lg:text-base font-bold border border-black" v-model="password"/>
        </div>
        
        <div class="mb-3 flex flex-col self-center items-center">
            <h1 class="text-xs italic mb-3 text-red-500" v-if="err">{{ err }}</h1>
            <button
                class="px-2 py-1 w-[150px] text-sm rounded-lg bg-[#0C4689] text-white"
                :class="{'bg-[#0C4689] text-white': !formLoading, 'bg-gray-300 cursor-none': formLoading}"
                :disabled="formLoading"
                >
                {{ formLoading ? 'Loading...' : 'Register' }}
            </button>
        </div>
        
        <h1 class="">
            Already have an account? <router-link class="underline" :to="{name: 'LoginView', query: { to: route.query.to ?? null }}">Login</router-link> instead.
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
const service = useService()

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

    service.apiService(ProjectService.register, [], { name: name.value, email: email.value, password: password.value }).then((result) => {
        if(result.message == 'failed') {
            err.value = result.data
        }
        else {
            console.log(result.data)
            localStorage.setItem('access_token',  result.data)

            if(route.query.to)
            {
                router.push(route.query.to)
            }
            else {
                router.push({ name: 'HomeView' })
            }
        }        
    })
    .finally(() => { formLoading.value = false })
}

</script>