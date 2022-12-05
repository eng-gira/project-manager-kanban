<template>
    <!-- Board Class Styles -->
    <div class="p-4 bg-teal-500 h-screen overflow-auto">
        <div v-if="board" class="flex items-start">
            <!-- Column Class Styles -->
            <div class="p-2 mr-4 text-left shadow rounded bg-gray-300 min-w-[350px]" v-for="column in board.columns" :key="column.name">
                <div class="flex items-center mb-2 font-bold">
                    {{ column.name }}
                </div>
                <div class="list-reset">
                    <!-- Task Class Styles -->
                    <div 
                        class="flex items-center flex-wrap shadow mb-2 py-2 px-2 rounded bg-white text-gray-900 no-underline cursor-pointer"
                        v-for="task in column.tasks" :key="task.id"
                        >
                        {{ task.name }}
                    </div>
                </div>
            </div>
        </div>
    

    </div>

</template>
<script setup>
import { onBeforeMount, ref } from 'vue'
import defaultBoard from '@/default-board.js'

let board = ref(null)

onBeforeMount(() => {
    board = defaultBoard

    console.log('board', board)
    console.log('columns', board.columns)
    console.log('columns[0].name', board.columns[0].name)
})
</script> 