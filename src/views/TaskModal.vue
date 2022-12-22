<template>
    <div @click.self="emitCloseTask">
        <div class="flex bg-white pin mx-auto mt-3 lg:py-4 lg:px-6 py-2 px-3 text-left rounded w-[300px] lg:w-[700px] overflow-y-auto" v-if="task">
            <div class="flex flex-col flex-grow justify-between items-start w-full">
                <div class="flex justify-between w-full">
                    <input
                        type="text"
                        class="p-2 mr-2 flex-grow text-sm lg:text-xl font-bold md:w-[120px]"
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
                    class="mt-5 w-full text-xs lg:text-sm p-1 border border-gray-500 min-h-[100px] resize-none rounded-lg"
                    :value=task.description
                    placeholder="Description..."
                    @change="updateDescription($event)"
                />


                <!-- Assignee -->
                <div class="flex justify-start mt-6 text-sm lg:text-lg items-center" v-if="members && members.length > 0">
                    <h1 class="mr-6" :class="{'lg:block hidden': confirmingNewUserAssignment}">Assignee:</h1>
                    <select class="border border-black lg:text-md text-xs" v-model="assigneeId" @change="askToConfirmNewUserAssignment">
                        <option v-for="member in members" :key="member.user_id" :value="member.user_id" :selected="member.user_id==assigneeId">
                            {{ member.user_email }}
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
                <div v-if="attachments && attachments.length > 0" class="flex justify-start space-x-2 mt-6 items-center">
                    <h1 class="text-lg mr-6">Attachments:</h1>
                    <div v-for="attachment in attachments" :key="attachment.id" class="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg">
                        {{ attachment.name }}
                    </div>
                </div>

                <!-- Comments -->
                <div class="flex flex-col mt-6 w-full">
                    <h1 class="text-sm lg:text-lg mb-3 font-bold">Comments:</h1>
                    <!-- Add a Comment -->
                    <div class="flex flex-col bg-slate-100 space-y-2 rounded-lg p-2">
                        <textarea
                            class="lg:text-md text-sm resize-none self-center bg-transparent p-2 w-full border-b border-gray-700"
                            placeholder="Comment..."
                            v-model="commentBody"/>
                        <div class="flex justify-end space-x-2">
                            <button
                                class="p-1 text-xs lg:text-sm rounded-lg bg-[#0C4689] text-white"
                                @click="addComment"
                                >
                                Submit
                            </button>
                            <button
                                class="p-1 text-xs lg:text-sm rounded-lg bg-gray-300 hover:bg-gray-500 hover:text-white"
                                @click="emptyCommentField"
                                >
                                Cancel
                            </button>
                        </div>
                    </div>

                    <!-- List of Comments -->
                    <div
                        v-for="(comment, commentIndex) in task.comments"
                        :key="comment.id"
                        class="bg-slate-200 rounded-lg flex flex-col space-y-3 mt-3 p-2"
                        >
                        <div class="flex justify-between">
                            <h1 class="font-bold lg:text-md text-sm">{{ memberIdNameMapper[comment.author_id] }}</h1>

                            <!-- Controls -->
                            <div v-if="comment.author_id == authUser.id">
                                
                                <button v-if="editingCommentOfId != comment.id" @click="startEditingComment(comment.id, comment.body)"
                                    class="text-xs hover:underline font-bold mr-3">
                                    Edit
                                </button>
                                <div v-else>
                                    <button class="text-xs bg-[#0C4689] px-2 py-1 rounded-lg mr-3" @click="updateComment(comment.id, commentIndex)">Save</button>
                                    <button class="text-xs bg-gray-300 hover:bg-gray-500 px-2 py-1 rounded-lg" @click="stopEditingComment">Cancel</button>
                                </div>

                                <button v-if="editingCommentOfId != comment.id" @mousedown="deleteComment(comment.id, commentIndex)" class="text-xs hover:underline font-bold">
                                    Delete
                                </button>
                            </div>
                        </div>
                        <div v-if="editingCommentOfId != comment.id" class="lg:text-md text-xs">{{ comment.body }}</div>
                        <textarea v-else placeholder="{{comment.body}}" class="bg-transparent border border-black p-2 lg:text-md text-xs" v-model="commentBodyBeingEdited[comment.id]"/>
                    </div>
                    <h1 class="italic mx-auto mt-3 lg:text-md text-xs" v-if="task.comments.length < 1">No Comments Yet</h1>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { onMounted, ref, defineEmits, computed } from 'vue';
import { useRoute } from 'vue-router';
import ProjectService from '@/services/ProjectService';
import jwt_decode from "jwt-decode";

const props = defineProps({
    id: [String, Number],
    taskIndex: [String, Number],
    columnIndex: [String, Number],
})
const emit = defineEmits(['close-task', 'task-deleted'])

let task = ref(null)
let assigneeId = ref(null)
let members = ref([])
const route = useRoute()
let authUser = ref(null)
const attachments = ref(null)
let memberIdNameMapper = ref({})
onMounted(() => {
    console.log(props.columnIndex)
    
    ProjectService.getSingleTask(props.id).then((resp) => {
        if(resp.data.message == 'failed') {
            console.log('failed:', resp.data.data)
        } else {
            task.value = resp.data.data
            assigneeId.value = task.value.assignee_id
        }
    }).catch((resp) => {
        console.log('failed:', resp.data)
    })

    ProjectService.getMembers(route.params.projectId).then((resp) => {
        if (resp.data.message != 'failed')
        { 
            members.value = resp.data.data
            for(let i = 0; i < members.value.length; i++) {
                memberIdNameMapper.value[members.value[i].user_id] = members.value[i].user_data.name
            }       
        }
    }).catch((resp) => {
        console.log('failed to get members:', resp)
    })

    // Get the user data from token
    const token = localStorage.getItem('access_token')
    let decoded = jwt_decode(token)
    authUser.value = decoded.user
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
        emit('close-task', task.value.id, props.taskIndex, props.columnIndex, e)
}

let commentBody = ref('')
const addComment = () => {
    if(commentBody.value.length < 1) return false

    ProjectService.createComment(task.value.id, JSON.stringify({ body: commentBody.value })).then((resp) => {
        if(resp.data.message != 'failed') {

            task.value.comments.push(resp.data.data)
        }
        console.log(resp.data.data)
    })

    commentBody.value = ''
}
const emptyCommentField = () => {
    commentBody.value = ''
}

let editingCommentOfId = ref(-1)
let commentBodyBeingEdited = ref({})
const startEditingComment = (id, currentCommentBody) => {
    // Only edit one comment at a time
    if(editingCommentOfId.value == -1) {
        editingCommentOfId.value = id
        commentBodyBeingEdited.value[id] = currentCommentBody
    }
}
const stopEditingComment = () => {
    editingCommentOfId.value = -1
}
const updateComment = (id, commentIndex) => {
    const newBody = commentBodyBeingEdited.value[id]
    commentBodyBeingEdited.value[id] = ''
    stopEditingComment()

    ProjectService.updateComment(id, JSON.stringify({ body: newBody })).then((resp) => {
        if(resp.data.message != 'failed')
        {
            task.value.comments[commentIndex].body = resp.data.data.body
        }
    })
}

const deleteComment = (id, commentIndex) => {
    ProjectService.deleteComment(id).then((resp) => {
        if(resp.data.message != 'failed')
        {
            task.value.comments.splice(commentIndex, 1)[0]
        }
    })
}


let confirmingNewUserAssignment = ref(false)
const askToConfirmNewUserAssignment = () => {
    confirmingNewUserAssignment.value = true
}
const cancelNewUserAssignment = () => {
    confirmingNewUserAssignment.value = false
    assigneeId.value = task.value.assignee_id
}
const closeConfirmationOfNewUserAssignment = () => {
    confirmingNewUserAssignment.value = false
}
const assignNewUser = () => {
    ProjectService.updateTask(task.value.id, JSON.stringify({ name: task.value.name, assignee_id: assigneeId.value })).then((resp) => {
        if(resp.data.message == 'failed')
        {
            assigneeId.value = task.value.assignee_id
            console.log('failed:', resp.data.data)
        } else 
        {
            task.value.assignee_id = resp.data.data.assignee_id // assigning task.assignee_id to the new task is assignee id returned from backend
            assigneeId.value = task.value.assignee_id // storing the new assignee_id in the ref assigneeId
            console.log(resp.data.data)
        }

    })
    closeConfirmationOfNewUserAssignment()
}
</script>