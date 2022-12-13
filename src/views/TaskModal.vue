<template>
    <div  @click.self="emitCloseTask">
        <div class="flex bg-white pin mx-auto mt-3 py-4 px-6 text-left rounded max-w-[700px]" v-if="task">
            <div class="flex flex-col flex-grow justify-between items-start">
                <div class="flex justify-between w-full">
                    <input
                        type="text"
                        class="p-2 mr-2 flex-grow text-xl font-bold"
                        :value="task.name"
                        @change="updateName($event)"
                    />
                    <button
                        class="bg-red-300 hover:bg-red-500 hover:text-white py-0 px-1 text-xs rounded-full"
                        @mousedown="deleteTask"
                        :class="{'italic': deletingTask}">
                        {{ deletingTask ? 'Loading...' : 'Delete'}} 
                    </button>
                </div>

                <textarea
                    class="mt-5 w-full text-sm p-1 border border-gray-500 h-[100px] resize-none rounded-lg"
                    :value=task.description
                    placeholder="Description..."
                    @change="updateDescription($event)"
                />


                <!-- Assignee -->
                <div class="flex justify-start mt-6">
                    <h1 class="text-lg mr-6">Assignee:</h1>
                    <select class="border border-black py-1" v-model="assigneeId" @change="askToConfirmNewUserAssignment">
                        <option v-for="member in members" :key="member.id" :value="member.id" :selected="member.id==assigneeId">
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
    </div>
</template>
<script setup>
import { onMounted, ref, defineEmits } from 'vue';
import { useRoute } from 'vue-router';
import ProjectService from '@/services/ProjectService';

const props = defineProps({
    id: [String, Number]
})
const emit = defineEmits(['close-task', 'task-deleted'])

let task = ref(null)
let taskIndexInCol = ref(-1)
let colIndexInProj = ref(-1)
let assigneeId = ref(null)
let members = ref([])
const route = useRoute()

onMounted(() => {
    ProjectService.getSingleTask(props.id).then((resp) => {
        if(resp.data.message == 'failed') {
            console.log('failed:', resp.data.data)
        } else {
            task.value = resp.data.data
            assigneeId.value = resp.data.data.assignee_id
        }
    }).catch((resp) => {
        console.log('failed:', resp.data)
    })

    ProjectService.getSingleProject(route.params.projectId).then((resp) => {
        if (resp.data.message != 'failed')
        { 
            members.value = resp.data.data.members
            const cols = resp.data.data.columns
            for(let i = 0; i < cols.length; i++) {
                if(cols[i].id == task.value.column_id) {
                    colIndexInProj.value = i

                    for(let j = 0; j < cols[i].tasks.length; j++) {
                        if(cols[i].tasks[j].id == task.value.id) {
                            taskIndexInCol.value = j
                        }
                    }
                }
            }
        }
    }).catch((resp) => {
        console.log('failed to get single project:', resp.data)
    })
})


let waitingForBE = ref(false)

const updateName = (event) => {
    const oldTaskName = task.value.name
    const newTaskName = event.target.value
    if(newTaskName.length > 0 && oldTaskName != newTaskName ) {
        waitingForBE.value = true

        task.value.name = newTaskName 
        event.target.blur()

        ProjectService.updateTask(task.value.id, { name: newTaskName  }).then((resp) => {
            if(resp.data.message == 'failed') {
                task.value.name = oldTaskName
                console.log('failed', resp.data.data)
            }
            else {
                console.log(resp.data.data)
                // emit('task-updated')
            }
            waitingForBE.value = false
        }).catch((resp) => {
            task.value.name = oldTaskName
            console.log('caught', resp.data)
            waitingForBE.value = false
        })
    }
}
const updateDescription = (event) => {
    const oldDescription = task.value.description
    const newDescription = event.target.value
    if(newDescription.length > 0 && oldDescription != newDescription ) {
        waitingForBE.value = true

        task.value.description = newDescription 
        event.target.blur()

        ProjectService.updateTask(task.value.id, { name: task.value.name, description: newDescription  }).then((resp) => {
            if(resp.data.message == 'failed') {
                task.value.description = oldDescription
                console.log('failed', resp.data.data)
            }
            else {
                console.log(resp.data.data)
            }
            waitingForBE.value = false
        }).catch((resp) => {
            task.value.description = oldDescription
            console.log('caught', resp.data)
            waitingForBE.value = false
        })
    }
}
let deletingTask = ref(false)
const deleteTask = () => {
    waitingForBE.value= true
    deletingTask.value = true
    ProjectService.deleteTask(task.value.id).then((resp) => {
        waitingForBE.value = false
        deletingTask.value = false

        if(resp.data.message == 'failed') {
            console.log('failed:', resp.data.data)
        } else {
            console.log(resp.data.data)
            emitCloseTask('deleted')
        }
        waitingForBE.value = false
    }).catch((resp) => {
        waitingForBE.value = false
    
        deletingTask.value = false
        console.log('failed:', resp.data)
    })
}

const emitCloseTask = (e = null) => {
    if(waitingForBE.value === false)
        emit('close-task', task.value.id, taskIndexInCol.value, colIndexInProj.value, e)
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
    assigneeId.value = task.value.assigneeId
}
const closeConfirmationOfNewUserAssignment = () => {
    confirmingNewUserAssignment.value = false
}
const assignNewUser = () => {
    task.value.assigneeId = assigneeId.value
    closeConfirmationOfNewUserAssignment()
}

</script>