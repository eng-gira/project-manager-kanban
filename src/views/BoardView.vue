<template>
    <!-- Board Class Styles -->
    <div class="p-4 bg-teal-500 h-screen overflow-auto">
        <div v-if="board" class="flex items-start">
            <!-- Column Class Styles -->
            <div class="p-2 mr-4 text-left shadow rounded bg-gray-300 min-w-[350px]" v-for="column in board.columns" 
                :key="column.name">
                <div class="flex items-center mb-2 font-bold">
                    {{ column.name }}
                </div>
                <div class="list-reset">
                    <!-- Task Class Styles -->
                    <div 
                        class="flex items-center flex-wrap shadow mb-2 py-2 px-2 rounded bg-white text-gray-900 no-underline"
                        v-for="task in column.tasks" :key="task.id"
                        @click="openTask(task.id)"
                        >
                        <!-- Idk if flex-no-shrink would work or I must use flex-shrink-0 -->
                        <span class="w-full font-bold flex-no-shrink"> 
                            {{ task.name }}
                        </span>
                        <p 
                            v-if="task.description"
                            class="w-full flex-no-shrink text-sm mt-1">
                            {{ task.description }}
                        </p>
                    </div>

                    <input
                        type="text"
                        class="p-2 block w-full bg-transparent"
                        placeholder="Add a task..."
                        @keyup.enter="addTask($event, column.tasks)"
                    />
                </div>
            </div>
        </div>
        
    </div>
    <!-- Task Modal -->
    <!-- class="bg-gray-300 absolute pin" -->
    <div 
        class="bg-transparent absolute inset-0 semi-transparent"
        v-if="isTaskOpen"
        @click.self="closeTask"
    >
        <router-view />
    </div>

</template>
<script setup>
import { computed, onBeforeMount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import defaultBoard from '@/default-board.js'

let board = ref(null)
const route = useRoute()
const router = useRouter()

onBeforeMount(() => {
    board.value = defaultBoard

    console.log('board', board.value)
    console.log('columns', board.value.columns)
    console.log('columns[0].name', board.value.columns[0].name)
})

let isTaskOpen = computed(() => {
    return route.name === 'TaskModal'
})

const openTask = (id) => {
    router.push({ name: 'TaskModal', params: { id: id } })
}
const closeTask = () => {
    router.push({ name: 'BoardView' })
}
const addTask = (event, tasks) => {
    console.log(event.target.value)
    event.target.value = ''
}

</script> 

<style scoped>
.semi-transparent {
    background-color: rgba(0,0,0,0.5);
}
</style>