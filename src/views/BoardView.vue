<template>
    <!-- Board Class Styles -->
    <div class="p-4 bg-teal-500 h-screen overflow-auto">
        <div v-if="board" class="flex items-start">
            <!-- Column Class Styles -->
            <div
                class="p-2 mr-4 text-left shadow rounded bg-gray-300 min-w-[350px]"
                v-for="(column, columnIndex) in board.columns"
                :key="column.name"
      
                @drop="placeTaskOrColumn(column.id, columnIndex, null, $event)"
                @dragover.prevent
                @dragenter.prevent

                draggable="true"
                @dragstart.self="pickupColumn(column.id, columnIndex, $event)"
                >
                <div class="flex items-center mb-2 font-bold">
                    {{ column.name }}
                </div>
                <div class="list-reset">
                    <!-- Task Class Styles -->
                    <!-- @Note you must specify whether draggable = "true" or "false", and not write draggable -->
                    <div 
                        class="flex items-center flex-wrap shadow mb-2 py-2 px-2 rounded bg-white text-gray-900 no-underline"
                        v-for="(task, taskIndex) in column.tasks" :key="task.id"
                        @click="openTask(task.id)"
                        draggable="true"
                        @dragstart="pickupTask(task.id, column.id, columnIndex, taskIndex, $event)"

                        @drop.stop="placeTaskOrColumn(column.id, columnIndex, taskIndex, $event)"
                        @dragover.prevent
                        @dragenter.prevent
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

                    <!-- Disable field if a task modal is open -->
                    <input
                        type="text"
                        class="p-2 block w-full bg-transparent"
                        placeholder="Add a task..."
                        @keyup.enter="addTask($event, column.id, columnIndex)"
                        :disabled="isTaskOpen"
                    />
                </div>
            </div>
            
            <!-- Add Column -->
            <!-- Disable field if a task modal is open -->
            <div class="p-2 mr-4 text-left shadow rounded bg-gray-300 min-w-[350px] flex">
                <input
                    type="text"
                    class="p-2 mr-2 flex-grow bg-transparent"
                    placeholder="Add a Column..."
                    v-model="columnName"
                    @keyup.enter="addColumn"
                    :disabled="isTaskOpen"
                />
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
const addTask = (event, columnId, columnIndex) => {
    // Update the UI
    board.value.columns[columnIndex].tasks.push({
        id: board.value.columns[columnIndex].tasks.length,
        name: event.target.value
    })

    // Send to the backend
    // ...

    // debug
    console.log(event.target.value)

    event.target.value = ''
}

const pickupTask = (taskId, fromColOfId, fromColIndex, fromTaskIndex, event) => {
    // fromColOfId, toColOfId, taskId
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.dropEffect = 'move'

    event.dataTransfer.setData('task-id', taskId)
    event.dataTransfer.setData('from-task-index', fromTaskIndex)
    event.dataTransfer.setData('from-col-of-id', fromColOfId)
    event.dataTransfer.setData('from-col-index', fromColIndex)
    event.dataTransfer.setData('type', 'task')
}
const placeTask = (toColOfId, toColIndex, toTaskIndex, event) => {
    const fromColOfId = event.dataTransfer.getData('from-col-of-id')
    const fromTaskIndex = event.dataTransfer.getData('from-task-index')
    const fromColIndex = event.dataTransfer.getData('from-col-index')
    const movedTaskId = event.dataTransfer.getData('task-id')

    const movedTask = board.value.columns[fromColIndex].tasks.splice(fromTaskIndex, 1)[0]
    console.log('toTaskIndex', toTaskIndex)
    if(toTaskIndex != null) board.value.columns[toColIndex].tasks.splice(toTaskIndex, 0, movedTask)
    else board.value.columns[toColIndex].tasks.push(movedTask)

    // if(toColOfId==fromColOfId)
    // {
        //     // debug
        //     console.log('Aborted: same col transfers')
        //     return
        // }
        
    // // for testing
    // board.value.columns[toColOfId - 1].tasks.push({name: 'dragged-task-for-id-' + event.dataTransfer.getData('task-id'), id: -1})
    
    // debug
    // console.log('Attempted to drag task of id', 
    // event.dataTransfer.getData('task-id'), 
    // 'from col of id', 
    // fromColOfId,
    // 'to col of id',
    // toColOfId)
}
    
const pickupColumn = (fromColOfId, fromColIndex, event) => {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.dropEffect = 'move'
    
    event.dataTransfer.setData('from-col-of-id', fromColOfId)
    event.dataTransfer.setData('from-col-index', fromColIndex)
    event.dataTransfer.setData('type', 'column')
}

const placeTaskOrColumn = (columnId, toColIndex, toTaskIndex, event) => {
    const type = event.dataTransfer.getData('type')
    if(type == 'task') placeTask(columnId, toColIndex, toTaskIndex, event)
    else {
        placeColumn(columnId, toColIndex, event)
    }
}
const placeColumn = (toColOfId, toColIndex, event) => {
    const fromColOfId = event.dataTransfer.getData('from-col-of-id')
    const fromColIndex = event.dataTransfer.getData('from-col-index')
    
    if(fromColIndex==toColIndex) { return }

    // UI Update
    const colToMove = board.value.columns.splice(fromColIndex, 1)[0]
    board.value.columns.splice(toColIndex, 0, colToMove)

    // Backend Upate
    // This section is to determine the columns that were forced to move, and the positions where they were moved.
    if(Math.abs(fromColIndex - toColIndex) <= 1) {
        let indexCounter = 0
        for(const col of board.value.columns) {
            if(col.id == toColOfId)
            {
                console.log('col of id', col.id, 'and name', col.name, 'is now at position', indexCounter)
                
                // Since it is just one position movement, only the two cols were affected. (Proof required)
                break
            }
            indexCounter++
        }
    }
    else {
        // Get the new positions of all cols
        let indexCounter = 0
        for(const col of board.value.columns) {
            console.log('col of id', col.id, ' (name: ', col.name , ') now has the position', indexCounter)
            indexCounter++
        }        
    }
}

let columnName = ref('')

const addColumn = (boardId) => {
    // Update the UI
    board.value.columns.push({
        id: board.value.columns.length + 1,
        name: columnName.value,
        tasks: []
    })
    columnName.value = ''

    // Send to the backend
    // ...
}

</script> 

<style scoped>
.semi-transparent {
    background-color: rgba(0,0,0,0.5);
}
</style>