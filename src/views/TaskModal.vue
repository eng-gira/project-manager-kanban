<template>
    <div class="flex bg-white pin mx-auto mt-3 py-4 text-left rounded max-w-[700px]">
        <div class="flex flex-col flex-grow justify-between items-start px-4">
            
            <input
                type="text"
                class="p-2 mr-2 flex-grow text-xl font-bold w-full"
                :value="task.name"
                @change="updateName(task.id, $event)"
            />

            <textarea
                class="mt-5 w-full text-sm p-1 border border-gray-500 h-[100px] resize-none rounded-lg"
                :value=task.description
                placeholder="Description..."
                @change="updateDescription(task.id, $event)"
            />

            <!-- Members -->
            <div class="flex justify-start mt-6">
                <h1 class="text-lg mr-6">Member:</h1>
                <select class="border border-black py-1">
                    <option v-for="member in members" :key="member.id" :value="member.id" :selected="member.id==task.userAssigned">
                        {{ member.name }}
                    </option>
                </select>
            </div>

            <!-- Attachments -->
            <div class="flex justify-start space-x-2 mt-6 items-center">
                <h1 class="text-lg mr-6">Attachments:</h1>
                <div v-for="attachment in attachments" :key="attachment.id" class="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg">
                    {{ attachment.name }}
                </div>
            </div>

            <!-- Comments -->
            <div class="flex flex-col mt-6 w-full">
                <h1 class="text-lg mb-3 font-bold">Comments:</h1>
                <!-- Add a Comment -->
                <div class="flex flex-col bg-slate-100 space-y-2 rounded-lg p-2">
                    <textarea
                        class="resize-none self-center bg-transparent p-2 w-full border border-gray-700 rounded-lg"
                        placeholder="Comment..."
                        v-model="commentBody"/>
                    <div class="flex justify-end space-x-2">
                        <button
                            class="p-1 text-sm rounded-lg bg-blue-300 hover:bg-blue-500 hover:text-white"
                            @click="addComment"
                            >
                            Submit
                        </button>
                        <button
                            class="p-1 text-sm rounded-lg bg-gray-300 hover:bg-gray-500 hover:text-white"
                            @click="emptyCommentField"
                            >
                            Cancel
                        </button>
                    </div>
                </div>

                <!-- List of Comments -->
                <div
                    v-for="comment in comments"
                    :key="comment.id"
                    class="bg-slate-200 rounded-lg flex flex-col space-y-3 mt-3 p-2"
                    >
                    <h1 class="font-bold">{{ comment.author }}</h1>
                    <div>{{ comment.body }}</div>
                </div>
                <h1 class="italic text-lg mx-auto" v-if="comments.length < 1">No Comments Yet</h1>
            </div>
        </div>
    </div>
</template>
<script setup>
import { onBeforeMount, ref } from 'vue';
import defaultBoard from '@/default-board.js'
import { onBeforeRouteUpdate } from 'vue-router';
import { comment } from 'postcss';

const props = defineProps({
    id: [String, Number]
})

let task = ref(null)
// onBeforeRouteUpdate(() => {
//     /**
//      * @todo request the task from the backend after finishing it
//      */
//     for(const column of defaultBoard.columns) {
//         for(const t of column.tasks) {
//             if(t.id == props.id) {
//                 task.value = t
//             }
//         }
//     }
// })
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
    event.target.blur()
}
const updateDescription = (taskId, event) => {
    console.log('task of id', taskId, 'should have its description set to', event.target.value)
    event.target.blur()
}

let members = ref([
    {
        id: 1,
        name: 'Ich'
    },
    {
        id: 2,
        name: 'Bru'
    },
    {
        id: 3,
        name: 'Admin'
    },
    {
        id: 4,
        name: 'Somebody else'
    }
])
let attachments = ref([
    {
        id: 1,
        name: 'File1'
    },
    {
        id: 2,
        name: 'Link1'
    },
    {
        id: 3,
        name: 'Link2'
    },
    {
        id: 4,
        name: 'File3'
    }
])
let commentBody = ref('')
let comments = ref([
    {
        id: 1,
        body: 'I find the task interesting',
        author: 'Admin',
    },
    {
        id: 2,
        body: 'I have to agree',
        author: 'Mod.',
    },
    {
        id: 3,
        body: 'I think I dont have to...',
        author: 'Engineer',
    },
])
const addComment = () => {
    if(commentBody.value.length < 1) return false

    comments.value.push({
        id: comments.value.length + 1,
        body: commentBody.value,
        author: 'Developer'
    })

    commentBody.value = ''
}
const emptyCommentField = () => {
    commentBody.value = ''
}
</script>