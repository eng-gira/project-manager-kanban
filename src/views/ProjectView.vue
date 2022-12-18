<template>
    <div class="h-screen w-screen p-4 bg-[#F5F5F5] overflow-auto">
        <div class="flex flex-col ml-6" v-if="project">
            <div class="flex space-x-8 items-center mb-6">
                <div class="w-full flex justify-between items-center"> <!-- space-x-3 -->
                    <div class="flex items-center">
                        <h1 v-if="!editingProjectName" class="font-bold text-xl">{{ project.name }}</h1>
                        <input
                            v-else
                            class="p-2 text-xl bg-transparent h-[28px] rounded-md border border-black"
                            v-model="updatedProjectName"
                            @focusout="stopEditingProjectName"
                            @keyup.enter="updateProjectName"
                            @keyup.esc="stopEditingProjectName"
                            />
                        <button
                            v-if="!editingProjectName"
                            class="text-xs ml-3"
                            @click="startEditingProjectName"
                            >(E)
                        </button>
                        <div class="rounded-md py-1 px-2 text-sm bg-[#EAEAEA] cursor-pointer ml-6" @click="openTeamModal">Team</div>
                    </div>
                    <div v-if="isProjectAdmin">
                        <button
                            v-if="project.archived == 0"
                            class="bg-red-300 hover:bg-red-500 hover:text-white text-sm px-2 py-1 rounded-lg"
                            @click="addToArchive"
                            >
                            Archive
                        </button>
                        <button
                            v-else
                            class="bg-gray-300 hover:bg-gray-500 hover:text-white text-sm px-2 py-1 rounded-lg"
                            @click="unarchive"
                            >
                            Unarchive
                        </button>
                    </div>
                </div>
            </div>
            <!-- Project Class Styles -->
            <div class="">
                <div v-if="project" class="flex items-start">
                    <!-- Column Class Styles -->
                    <div
                        class="p-3 mr-4 text-left shadow rounded bg-[#D9D9D9] min-w-[300px] w-[300px] flex flex-col"
                        v-for="(column, columnIndex) in project.columns"
                        :key="column.name"
              
                        @drop="placeTaskOrColumn(column.id, columnIndex, null, $event)"
                        @dragover.prevent
                        @dragenter.prevent
        
                        draggable="true"
                        @dragstart.self="pickupColumn(column.id, columnIndex, $event)"
                        >
        
                        <div class="flex items-center mb-2 font-bold justify-between">
                            <input
                                v-if="editingColName===true && editingColOfId == column.id"
                                type="text"
                                :value="column.name"
                                class="p-2 mr-2 flex-grow bg-transparent border border-black rounded-md h-[28px]"
                                @change="updateColName(column.id, columnIndex, $event)"
                                @keyup.esc="disableEditingColName(columnIndex, $event)"
                                />
                            <h1 v-else>
                                {{ column.name}}
                            </h1>
                            <div class="">
                                <button class="mr-2" @click="enableEditingColName(column.id)" :disabled="isModalOpen">E</button>
                                <button @click="openColDeletionConfirmationModal(column.id, columnIndex)" :disabled="isModalOpen">D</button>
                            </div>
                        </div>
                        <div class="list-reset">
                            <!-- Task Class Styles -->
                            <div 
                                class="w-full shadow mb-2 py-2 px-2 rounded bg-white text-gray-900 no-underline cursor-pointer"
                                v-for="(task, taskIndex) in column.tasks" :key="task.id"
                                @click="openTask(task.id)"
                                draggable="true"
                                @dragstart="pickupTask(task.id, column.id, columnIndex, taskIndex, $event)"
        
                                @drop.stop="placeTaskOrColumn(column.id, columnIndex, taskIndex, $event)"
                                @dragover.prevent
                                @dragenter.prevent
                                >
                                <div class="flex-col">
                                    <div class="flex justify-between"> 
                                        <span class="font-bold">{{ task.name + '(' + task.id + ')' }}</span>
                                    </div>
                                    <p 
                                        v-if="task.description"
                                        class="w-full flex-no-shrink text-sm mt-1">
                                        {{ task.description }}
                                    </p>
                                </div>
                            </div>
        
                            <input
                                type="text"
                                class="p-2 block w-full bg-transparent h-[28px]"
                                placeholder="Add a task..."
                                @keyup.enter="addTask($event, column.id, columnIndex)"
                                @keyup.esc="$event.target.value = ''"
                                :disabled="isModalOpen"
                            />
                        </div>
                    </div>
                    
                    <!-- Add Column -->
                    <div class="p-2 mr-4 text-left shadow rounded bg-gray-300 min-w-[300px] h-[45px] flex">
                        <input
                            type="text"
                            class="p-2 mr-2 flex-grow bg-transparent"
                            placeholder="Add a Column..."
                            v-model="columnName"
                            @keyup.enter="addColumn"
                            @keyup.esc="columnName = ''"
                            :disabled="isModalOpen"
                        />
                    </div>
                </div>
                
            </div>
        </div>
        <!-- Task Modal -->
        <div 
            class="bg-transparent absolute inset-0 semi-transparent overflow-y-auto"
            v-if="isTaskOpen"
            >
            <router-view @close-task="closeTask"/>
        </div>
    
        <!-- Col Deletion Confirmation Modal -->
        <div 
            class="bg-transparent absolute inset-0 semi-transparent grid h-screen place-items-center"
            v-if="confirmColDeletionModalVisible"
            @click.self="closeColDeletionConfirmationModal"
            @focusout="closeColDeletionConfirmationModal"
            >
            <div class="bg-white w-[300px] flex flex-col p-3 rounded-lg space-y-4">
                <h1 class="font-bold text-lg">Are you sure you want to delete this column and all of its tasks?</h1>
                <div class="flex justify-around">
                    <button class="bg-red-300 hover:bg-red-500 py-1 px-2 rounded-lg text-white text-sm" @click="deleteCol">
                        Confirm
                    </button>
                    <button
                        class="bg-gray-300 hover:bg-gray-500 py-1 px-2 rounded-lg text-white text-sm"
                        @click="closeColDeletionConfirmationModal">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
        <!-- Team Modal -->
        <div 
            class="bg-transparent absolute inset-0 semi-transparent grid h-screen place-items-center overflow-y-auto"
            v-if="teamModalVisible"
            @click.self="closeTeamModal"
            >
            <div class="flex flex-col bg-white w-[300px] rounded-lg p-2">
                <h1 class="font-bold text-lg mb-6">Team Members</h1>
                <div v-for="(member, memberIndex) in project.members" :key="member.id" class="flex justify-between mb-3">
                    <h1>{{ member.user_email }}</h1>
                    <div v-if="isProjectAdmin && member.user_id != project.admin_id">
                        <div
                            v-if="confirmingTeamMemberRemoval === true && confirmingRemovalOfTeamMemberOfIndex == memberIndex"
                            >
                            <button
                                class="py-1 px-2 text-xs rounded-lg bg-red-300 hover:bg-red-500 hover:text-white mr-3"
                                @click="removeTeamMember(member.user_email, memberIndex)"                        
                            >
                                Confirm
                            </button>
                            <button
                                class="py-1 px-2 text-xs rounded-lg bg-gray-300 hover:bg-gray-500 hover:text-white"
                                @click="closeTeamMemberRemovalConfirmation"                            
                            >
                                Cancel
                            </button>
                        </div>
                        <button
                            v-else
                            class="py-1 px-2 text-xs rounded-lg bg-yellow-300 hover:bg-yellow-500"
                            @click="askToConfirmTeamMemberRemoval(member.id, memberIndex)"
                            >
                            Remove Member
                        </button>
                    </div>
                </div>
                <div class="flex justify-between mt-3" v-if="isProjectAdmin">
                    <input
                        type="text"
                        class="p-2 mr-2 text-xs flex-grow bg-transparent border border-black rounded-md h-[28px]"
                        placeholder="Member Email"
                        v-model="emailOfMemberToAdd"
                        />
                    <button
                        class="rounded-lg px-2 py-1 text-xs bg-blue-300 hover:bg-blue-500 hover:text-white"
                        @click="addMember"
                        >
                        Add
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { computed, onBeforeMount, onMounted, ref, watchEffect } from 'vue'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
import ProjectService from '@/services/ProjectService';
import jwt_decode from "jwt-decode";
import { expiryData, hasExpired } from '@/utils';

const props = defineProps({
    projectId: [String, Number]
})

let project = ref(null)
const route = useRoute()
const router = useRouter()

onMounted(() => {
    watchEffect(() => {
        // let projects =  projectsData.projects
        // for(const p of projects)
        // {
        //     if(p.id == props.projectId) {
        //         project.value = p
        //     }
        // }
        ProjectService.getSingleProject(parseInt(props.projectId)).then((resp) => {
            project.value = resp.data.data
            console.log(resp.data)
        })
        // console.log('project', project.value, 'since projectId was', props.projectId)
    })
    expiryData(localStorage.getItem('access_token'))
    console.log(hasExpired(localStorage.getItem('access_token')) ? 'access exp' : 'access not exp')
})

let isProjectAdmin = computed(() => {
    const token = localStorage.getItem('access_token')
    let decoded = jwt_decode(token)

    return project.value == null ? false : (decoded.user.id == project.value.admin_id)
})

let isTaskOpen = computed(() => {
    return route.name === 'TaskModal'
})

let isModalOpen = ref(false)

const openTask = (taskId) => {
    isModalOpen.value = true
    router.push({ name: 'TaskModal', params: { projectId: project.value.id, id: taskId } })
}
const closeTask = (taskId, taskIndexInCol, colIndexInProj, e) => {
    refreshTask(taskId, taskIndexInCol, colIndexInProj, e)
    isModalOpen.value = false
    router.push({ name: 'ProjectView', params: { projectId: project.value.id  } })
}
const refreshTask = (taskId, taskIndexInCol, colIndexInProj, e) => {
    // // validation
    // if( !!project.value.columns[colIndexInProj].tasks[taskIndexInCol] &&
    //     project.value.columns[colIndexInProj].tasks[taskIndexInCol].id != taskId
    //     )
    // {
    //     console.log('Attempted to update the wrong id!')
    //     return false
    // }
    if(e == 'deleted') {

        project.value.columns[colIndexInProj].tasks.splice(taskIndexInCol, 1)
        return
    }

    ProjectService.getSingleTask(taskId).then((resp) => {
        if(resp.data.message != 'failed' && resp.data.data)
        {
            console.log('must edit', colIndexInProj, taskIndexInCol)
            project.value.columns[colIndexInProj].tasks[taskIndexInCol] = resp.data.data
        } 
        console.log('from refreshTask', resp.data)
    }).catch((err) => {
        console.log('caught:', err)
    }) 
}
const addTask = (event, columnId, columnIndex) => {
    if(event.target.value.length < 1) 
    {
        return false
    }

    ProjectService.createTask(columnId, JSON.stringify({ name: event.target.value })).then((resp) => {
        if(resp.data.message != 'failed') {
            project.value.columns[columnIndex].tasks.push(resp.data.data)
        }
        console.log('resp returned from back', resp.data.data)
    })

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

    const movedTask = project.value.columns[fromColIndex].tasks.splice(fromTaskIndex, 1)[0]

    if(toTaskIndex != null) {
        project.value.columns[toColIndex].tasks.splice(toTaskIndex, 0, movedTask)

        ProjectService.relocateTask(movedTaskId, {
            targetColId: toColOfId,
            tasksOrderInTargetCol: project.value.columns[toColIndex].tasks.map((t) => { return t.id })
        }).then((resp) => {
            if(resp.data.message == 'failed') {
                // replace the task as it was before
                const reMovedTask = project.value.columns[toColIndex].tasks.splice(toTaskIndex, 1)[0]
                project.value.columns[fromColIndex].tasks.splice(fromTaskIndex, 0, reMovedTask)

                console.log('failed', resp.data.data)
            }
            else {
                console.log(resp.data.data)
            }
        }).catch(() => {
                // replace the task as it was before
                const reMovedTask = project.value.columns[toColIndex].tasks.splice(toTaskIndex, 1)[0]
                project.value.columns[fromColIndex].tasks.splice(fromTaskIndex, 0, reMovedTask)

                console.log('caught', resp.data.data)            
        })
    }
    else {
        project.value.columns[toColIndex].tasks.push(movedTask)

        ProjectService.relocateTask(movedTaskId, {
            targetColId: toColOfId,
            tasksOrderInTargetCol: project.value.columns[toColIndex].tasks.map(($t) => { return $t.id })
        }).then((resp) => {
            if(resp.data.message == 'failed') {
                // replace the task as it was before
                const reMovedTask = project.value.columns[toColIndex].tasks.pop()
                project.value.columns[fromColIndex].tasks.splice(fromTaskIndex, 0, reMovedTask)

                console.log('failed', resp.data.data)
            }
            else {
                console.log(resp.data.data)
            }
        }).catch(() => {
            const reMovedTask = project.value.columns[toColIndex].tasks.pop()
                project.value.columns[fromColIndex].tasks.splice(fromTaskIndex, 0, reMovedTask)

                console.log('caught', resp.data.data)            
        })
    }
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
    const colToMove = project.value.columns.splice(fromColIndex, 1)[0]
    project.value.columns.splice(toColIndex, 0, colToMove)

    ProjectService.changeColsOrder(project.value.id, { 
        orderedCols: project.value.columns.map((col) => { return col.id })
     }).then((resp) => {
        if(resp.data.message == 'fail') {
            const reMovedCol = project.value.columns.splice(toColIndex, 1)[0]
            project.value.columns.splice(fromColIndex, 0, reMovedCol)

            console.log('failed:', resp.data.data)
        }
        else {
            console.log(resp.data.data)
        }
    }).catch((resp) => {
        const reMovedCol = project.value.columns.splice(toColIndex, 1)[0]
        project.value.columns.splice(fromColIndex, 0, reMovedCol)

        console.log('failed:', resp.data)
    });

    // Backend Upate
    // This section is to determine the columns that were forced to move, and the positions where they were moved.
    if(Math.abs(fromColIndex - toColIndex) <= 1) {
        let indexCounter = 0
        for(const col of project.value.columns) {
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
        for(const col of project.value.columns) {
            console.log('col of id', col.id, ' (name: ', col.name , ') now has the position', indexCounter)
            indexCounter++
        }        
    }
}

let columnName = ref('')

const addColumn = () => {
    if(columnName.value.length < 1) return false
    
    ProjectService.createColumn(project.value.id, JSON.stringify({ name: columnName.value })).then((resp) => {
        if(resp.data.message != 'failed') {
            project.value.columns.push(resp.data.data)
        }
        console.log('resp returned from backend', resp.data.data)
    })
    columnName.value = ''
}

let confirmColDeletionModalVisible = ref(false)
let columnIndexWhoseDeletionBeingConfirmed = ref(-1)
let IdOfColumnWhoseDeletionBeingConfirmed = ref(-1)

const openColDeletionConfirmationModal = (colId, colIndex) => {
    confirmColDeletionModalVisible.value = true
    columnIndexWhoseDeletionBeingConfirmed.value = colIndex
    IdOfColumnWhoseDeletionBeingConfirmed.value = colId
    isModalOpen.value = true
}
const closeColDeletionConfirmationModal = () => {
    confirmColDeletionModalVisible.value = false
    columnIndexWhoseDeletionBeingConfirmed.value = -1
    isModalOpen.value = false
}
const deleteCol = () => {
    const colId = IdOfColumnWhoseDeletionBeingConfirmed.value
    const colIndex = columnIndexWhoseDeletionBeingConfirmed.value

    if(colIndex == -1 || colId == -1) return false

    // Update the UI
    const deletedCol = project.value.columns.splice(colIndex, 1)[0]

    closeColDeletionConfirmationModal()

    // Send to the backend
    ProjectService.deleteColumn(colId).then((resp) => {
        if(resp.data.message == 'failed') {
            project.value.columns.splice(colIndex, 0, deletedCol)
            console.log('failed:', resp.data.data)
        } else {
            console.log(resp.data.data)
        }
    }).catch((resp) => {
        project.value.columns.splice(colIndex, 0, deletedCol)
        console.log('failed:', resp.data)
    })

}

let editingColName = ref(false)
let editingColOfId = ref(-1)
const enableEditingColName = (colId) => {
    editingColName.value = true
    editingColOfId.value = colId
}
const updateColName = (colId, colIndex, event) => {
    if(event.target.value.length < 1 || event.target.value == project.value.columns[colIndex].name) {
        editingColName.value = false
        editingColOfId.value = -1        
        return false
    }

    // Update the UI
    let oldName = project.value.columns[colIndex].name
    project.value.columns[colIndex].name = event.target.value
    editingColName.value = false
    editingColOfId.value = -1
    
    // Send to the backend
    ProjectService.updateColumn(colId, { name: event.target.value }).then((resp) => {
        if(resp.data.message == 'failed') {
            project.value.columns[colIndex].name = oldName
            console.log('failed:', resp.data.data)
        } else {
            console.log(resp.data.data)
        }
        
    }).catch((resp) => {
        project.value.columns[colIndex].name = oldName
        console.log('failed:', resp.data)
    })
}
const disableEditingColName = (colIndex, event) => {
    event.target.value = project.value.columns[colIndex].name
    editingColName.value = false
    editingColOfId.value = -1
}

let teamModalVisible = ref(false)
const openTeamModal = () => {
    teamModalVisible.value = true
    isModalOpen.value = true
}
const closeTeamModal = () => {
    teamModalVisible.value = false
    isModalOpen.value = false
    closeTeamMemberRemovalConfirmation()
}
let emailOfMemberToAdd = ref('')
const addMember = () => {
    if(emailOfMemberToAdd.value.length > 0) {
        ProjectService.addMember(
            project.value.id, 
            JSON.stringify( {email: emailOfMemberToAdd.value } )
        ).then((resp) => {
                if(resp.data.message != 'failed')
                {
                    console.log('returned member', resp.data.data)
                    project.value.members.push(resp.data.data)
                }
                else {
                    console.log('failed:', resp.data.data)
                }
        }).catch((err) => {
                console.log('caught', err)
        })
        
        emailOfMemberToAdd.value = ''
    }
}

let confirmingTeamMemberRemoval = ref(false)
let confirmingRemovalOfTeamMemberOfIndex = ref(-1)
const askToConfirmTeamMemberRemoval = (memberId, memberIndex) => {
    confirmingTeamMemberRemoval.value = true
    confirmingRemovalOfTeamMemberOfIndex.value = memberIndex
}
const closeTeamMemberRemovalConfirmation = () => {
    confirmingTeamMemberRemoval.value = false
    confirmingRemovalOfTeamMemberOfIndex.value = -1
}
const removeTeamMember = (memberEmail, memberIndex) => {

    ProjectService.removeMember(project.value.id, JSON.stringify({ email: memberEmail })).then((resp) => {
        if(resp.data.message != 'failed') {
            project.value.members.splice(memberIndex, 1)[0]
            closeTeamMemberRemovalConfirmation()
        }
    })


    // Send to the backend...
}

let updatedProjectName = ref('')
let editingProjectName = ref(false)

const stopEditingProjectName = () => {
    editingProjectName.value = false
}
const startEditingProjectName = () => {
    editingProjectName.value = true
}
const updateProjectName = () => {
    let oldProjectName = project.value.name
    stopEditingProjectName()

    if(updatedProjectName.value.length < 0 || updatedProjectName.value == oldProjectName) {
        project.value.name = oldProjectName
        updatedProjectName.value = ''
        return false
    }
    
    project.value.name = updatedProjectName.value

    ProjectService.updateProject(project.value.id, { name: updatedProjectName.value }).then((resp) => {
        if(resp.data.message == 'failed') {
            project.value.name = oldProjectName
            console.log('failed:', resp.data.data)
        } else {
            console.log(resp.data.data)
        }
    }).catch((resp) => {
        project.value.name = oldProjectName
        console.log('failed:', resp.data)
    })

    updatedProjectName.value = ''
}

const addToArchive = () => {
    ProjectService.addToArchive(project.value.id).then((resp) => {
        if(resp.data.message != 'failed') {
            // to refresh sidebar too
            window.location = '/' + project.value.id
        }
    })
}
const unarchive = () => {
    ProjectService.removeFromArchive(project.value.id).then((resp) => {
        if(resp.data.message != 'failed') {
            // to refresh sidebar too
            window.location = '/' + project.value.id
        }
    })
}
</script> 

<style scoped>
.semi-transparent {
    background-color: rgba(0,0,0,0.5);
}
</style>