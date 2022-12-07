<template>
    <!-- Board Class Styles -->
    <div class="p-4 bg-teal-500 h-screen overflow-auto">
        <div v-if="board" class="flex items-start">
            <!-- Column Class Styles -->
            <div
                class="p-2 mr-4 text-left shadow rounded bg-gray-300 min-w-[350px]"
                v-for="column in board.columns"
                :key="column.name"
      
                @drop="placeTask(column.id, $event)"
                @dragover.prevent
                @dragenter.prevent
                >
                <div class="flex items-center mb-2 font-bold">
                    {{ column.name }}
                </div>
                <div class="list-reset">
                    <!-- Task Class Styles -->
                    <!-- @Note you must specify whether draggable = "true" or "false", and not write draggable -->
                    <div 
                        class="flex items-center flex-wrap shadow mb-2 py-2 px-2 rounded bg-white text-gray-900 no-underline"
                        v-for="task in column.tasks" :key="task.id"
                        @click="openTask(task.id)"
                        draggable="true"
                        @dragstart="pickupTask(task.id, column.id, $event)"
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

/**
 * Drag API (Start)
 */
const pickupTask = (taskId, fromColOfId, event) => {
    // fromColOfId, toColOfId, taskId
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.dropEffect = 'move'


    event.dataTransfer.setData('task-id', taskId)
    event.dataTransfer.setData('from-col-of-id', fromColOfId)
}
const placeTask = (toColOfId, event) => {
    const fromColOfId = event.dataTransfer.getData('from-col-of-id')
    if(toColOfId==fromColOfId)
    {
        console.log('Aborted: same col transfers')
        return
    }
    
    // // for testing
    // board.value.columns[toColOfId - 1].tasks.push({name: 'dragged-task', id: -1})

    console.log('Attempted to drag task of id', 
        event.dataTransfer.getData('task-id'), 
        'from col of id', 
        fromColOfId,
        'to col of id',
        toColOfId)
}
/**
 * Drag API (End)
 */
</script> 

<style scoped>
.semi-transparent {
    background-color: rgba(0,0,0,0.5);
}
</style>