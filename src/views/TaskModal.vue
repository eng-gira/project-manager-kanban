<template>
    <div class="flex bg-white pin mx-auto mt-3 py-4 px-6 text-left rounded max-w-[700px]" v-if="task">
        <div class="flex flex-col flex-grow justify-between items-start">
            
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

            <!-- Assignee -->
            <div class="flex justify-start mt-6">
                <h1 class="text-lg mr-6">Assignee:</h1>
                <select class="border border-black py-1" v-model="assignee" @change="askToConfirmNewUserAssignment">
                    <option v-for="member in members" :key="member.id" :value="member.id" :selected="member.id==assignee">
                        {{ member.name }}
                    </option>
                </select>
                <div v-if="confirmingNewUserAssignment" class="flex ml-3">
                    <button
                            class="py-1 px-2 text-xs rounded-lg bg-gray-700 hover:bg-gray-900 text-white mr-1"
                            @click="assignNewUser"                        
                        >
                            Confirm
                        </button>
                        <button
                            class="py-1 px-2 text-xs rounded-lg bg-gray-300 hover:bg-gray-500 hover:text-white"
                            @click="cancelNewUserAssignment"                            
                        >
                            Cancel
                        </button>                    
                </div>
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
import { onMounted, ref } from 'vue';
import projectsData from '@/projectsData.js'
import { useRoute } from 'vue-router';
import { comment } from 'postcss';

const props = defineProps({
    id: [String, Number]
})

let task = ref(null)
let assignee = ref(null)
let members = ref([])
const route = useRoute()

onMounted(() => {
    /**
     * @todo request the task from the backend after finishing it
     */
    for(const proj of projectsData.projects) {
        if(proj.id != route.params.projectId) continue
        for(const col of proj.columns)
        {
            for(const t of col.tasks) {
                if(t.id == props.id) {
                    task.value = t
                    assignee = t.userAssigned
                }
            }
        }
        members.value = proj.members
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

let attachments = ref([
    {
        id: 1,
        name: 'File1'
    },
    {
        id: 2,
        name: 'Link1'
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


let confirmingNewUserAssignment = ref(false)
const askToConfirmNewUserAssignment = () => {
    confirmingNewUserAssignment.value = true
}
const cancelNewUserAssignment = () => {
    confirmingNewUserAssignment.value = false
    assignee = task.value.userAssigned
}
const closeConfirmationOfNewUserAssignment = () => {
    confirmingNewUserAssignment.value = false
}
const assignNewUser = () => {
    task.value.userAssigned = assignee
    closeConfirmationOfNewUserAssignment()
}

</script>