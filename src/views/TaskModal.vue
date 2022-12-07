<template>
    <div class="relative flex flex-row bg-white pin mx-auto m-32 py-4 text-left rounded max-w-[700px] shadow">
        <div class="flex flex-col flex-grow justify-between items-start px-4">
            
            <input
                type="text"
                class="p-2 mr-2 flex-grow text-xl font-bold w-full"
                :value="task.name"
                @change="updateName(task.id, $event)"
            />

            <textarea
                class="mt-6 w-full text-sm p-1"
                :value=task.description
                @change="updateDescription(task.id, $event)"
            />
        </div>
    </div>
</template>
<script setup>
import { onBeforeMount, ref } from 'vue';
import defaultBoard from '@/default-board.js'
import { onBeforeRouteUpdate } from 'vue-router';

const props = defineProps({
    id: [String, Number]
})

let task = ref(null)
onBeforeRouteUpdate(() => {
    /**
     * @todo request the task from the backend after finishing it
     */
    for(const column of defaultBoard.columns) {
        for(const t of column.tasks) {
            if(t.id == props.id) {
                task.value = t
            }
        }
    }
})
onBeforeMount(() => {
    /**
     * @todo request the task from the backend after finishing it
     */
    for(const column of defaultBoard.columns) {
        for(const t of column.tasks) {
            if(t.id == props.id) {
                task.value = t
            }
        }
    }
})

const updateName = (taskId, event) => {
    console.log('task of id', taskId, 'should have name set to', event.target.value)
}
const updateDescription = (taskId, event) => {
    console.log('task of id', taskId, 'should have its description set to', event.target.value)
}

</script>