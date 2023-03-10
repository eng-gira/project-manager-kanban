<template>
    <div class="h-screen w-screen p-4 bg-[#F5F5F5] overflow-auto">
        <div class="flex flex-col ml-6" v-if="project">
            <div class="flex space-x-8 items-center mb-6">
                <!-- <div class="w-full flex justify-start items-center"> space-x-3 -->
                    <div class="flex items-center">
                        <h1 v-if="!editingProjectName" class="font-bold text-sm lg:text-xl">{{ project.name }}</h1>
                        <input
                            v-else
                            class="p-2 text-sm lg:text-xl bg-transparent h-[28px] rounded-md border border-black"
                            v-model="updatedProjectName"
                            @focusout="stopEditingProjectName"
                            @keyup.enter="updateProjectName"
                            @keyup.esc="stopEditingProjectName"
                            ref="projectNameRef"
                            />
                        
                        <v-icon
                            name="md-edit" 
                            v-if="isProjectAdmin(project.admin_id) && !editingProjectName"
                            class="cursor-pointer ml-3 lg:w-[20px] w-[15px]"
                            @click="startEditingProjectName"
                        />

                        <div class="rounded-md py-1 px-2 text-xs lg:text-sm bg-[#EAEAEA] cursor-pointer ml-6" @click="openTeamModal">Team</div>
                    </div>
                    <div v-if="isProjectAdmin(project.admin_id) && !editingProjectName">
                        <button
                            v-if="project.archived == 0"
                            class="bg-red-300 hover:bg-red-500 hover:text-white text-xs lg:text-sm px-2 py-1 rounded-lg ml-8"
                            @click="addToArchive"
                            >
                            Archive
                        </button>
                        <button
                            v-else
                            class="bg-gray-300 hover:bg-gray-500 hover:text-white text-xs lg:text-sm px-2 py-1 rounded-lg ml-8"
                            @click="unarchive"
                            >
                            Unarchive
                        </button>
                    </div>
                <!-- </div> -->
            </div>
            <!-- Project Class Styles -->
            <div class="">
                <div v-if="project" class="flex items-start">
                    <!-- Column Class Styles -->
                    <div
                        class="p-3 mr-4 text-left shadow rounded bg-[#D9D9D9] min-w-[200px] lg:min-w-[300px] lg:w-[300px] flex flex-col"
                        v-for="(column, columnIndex) in project.columns"
                        :key="column.name"
              
                        @drop="placeTaskOrColumn(column.id, columnIndex, null, $event)"
                        @dragover.prevent
                        @dragenter.prevent
        
                        draggable="true"
                        @dragstart.self="pickupColumn(column.id, columnIndex, $event)"
                        >
        
                        <div class="flex items-center mb-2 font-bold justify-between w-full">
                            <input
                                v-if="editingColName===true && editingColOfId == column.id"
                                type="text"
                                :value="column.name"
                                class="p-2 mr-2 w-[50px] lg:w-[100px] flex-grow bg-transparent border border-black rounded-md h-[28px] lg:text-md text-sm"
                                @change="updateColName(column.id, columnIndex, $event)"
                                @keyup.esc="disableEditingColName(columnIndex, $event)"
                                @focusout="disableEditingColName(columnIndex, $event)"
                                :id="'colNameField_' + column.id"
                                />
                            <h1 v-else class="lg:text-md text-sm">
                                {{ column.name}}
                            </h1>
                            <div class="">
                                <v-icon
                                    name="md-edit"
                                    class="mr-2 cursor-pointer lg:w-[20px] w-[15px]"
                                    @click="enableEditingColName(column.id)"
                                    :disabled="isModalOpen"
                                    />
                                
                                <v-icon
                                    name="io-remove-circle-sharp"
                                    class="cursor-pointer lg:w-[20px] w-[15px]"
                                    @click="openColDeletionConfirmationModal(column.id, columnIndex)"
                                    :disabled="isModalOpen"
                                    />
                            </div>
                        </div>
                        <div class="list-reset">
                            <!-- Task Class Styles -->
                            <div 
                                class="w-full shadow mb-2 py-2 px-2 rounded bg-white text-gray-900 no-underline cursor-pointer"
                                v-for="(task, taskIndex) in column.tasks" :key="task.id"
                                @click="openTask(task.id, taskIndex, columnIndex)"
                                draggable="true"
                                @dragstart="pickupTask(task.id, column.id, columnIndex, taskIndex, $event)"
        
                                @drop.stop="placeTaskOrColumn(column.id, columnIndex, taskIndex, $event)"
                                @dragover.prevent
                                @dragenter.prevent
                                >
                                <div class="flex-col">
                                    <div class="lg:text-md text-sm flex justify-between"> 
                                        <span class="font-bold">{{ task.name }}</span>
                                    </div>
                                    <p 
                                        v-if="task.description"
                                        class="w-full flex-no-shrink text-xs lg:text-sm mt-1">
                                        {{ task.description }}
                                    </p>
                                </div>
                            </div>
        
                            <input
                                type="text"
                                class="p-2 block w-full bg-transparent h-[28px] lg:text-md text-sm"
                                placeholder="Add a task..."
                                @keyup.enter="addTask($event, column.id, columnIndex)"
                                @keyup.esc="$event.target.value = ''"
                                :disabled="isModalOpen"
                            />
                        </div>
                    </div>
                    
                    <!-- Add Column -->
                    <div class="p-2 mr-4 text-left shadow rounded bg-gray-300 min-w-[200px] lg:min-w-[300px] h-[30px] lg:h-[45px] flex lg:text-md text-sm">
                        <input
                            type="text"
                            class="p-2 bg-transparent max-w-full w-full"
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
            class="absolute inset-0 bg-[rgba(0,0,0,0.5)] overflow-y-auto"
            v-if="isTaskOpen"
            >
            <router-view @close-task="closeTask"/>
        </div>
    
        <!-- Col Deletion Confirmation Modal -->
        <div 
            class="absolute inset-0 bg-[rgba(0,0,0,0.5)] grid h-screen place-items-center"
            v-if="confirmColDeletionModalVisible"
            @click.self="closeColDeletionConfirmationModal"
            @focusout="closeColDeletionConfirmationModal"
            >
            <div class="bg-white w-[300px] flex flex-col p-3 rounded-lg space-y-4">
                <h1 class="font-bold text-sm lg:text-lg">Are you sure you want to delete this column and all of its tasks?</h1>
                <div class="flex justify-around">
                    <button class="bg-red-300 hover:bg-red-500 py-1 px-2 rounded-lg text-white text-xs lg:text-sm" @click="deleteCol">
                        Confirm
                    </button>
                    <button
                        class="bg-gray-300 hover:bg-gray-500 py-1 px-2 rounded-lg text-white text-xs lg:text-sm"
                        @click="closeColDeletionConfirmationModal">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
        <!-- Team Modal -->
        <TeamModal :project="project" v-if="teamModalVisible" @click.self="closeTeamModal"/>
    </div>
</template>
<script setup>
import { computed, nextTick, onBeforeMount, onMounted, ref, watchEffect } from 'vue'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
import ProjectService from '@/services/ProjectService';
import { expiryData, nearlyExpired, isProjectAdmin } from '@/utils';
import { useService } from '@/components/apiService.js'
import TeamModal from '@/components/TeamModal.vue'

const props = defineProps({
    projectId: [String, Number]
})

let project = ref(null)
const route = useRoute()
const router = useRouter()
const service = useService()

onMounted(() => {
    watchEffect(() => {
        service.apiService(ProjectService.getSingleProject, [ parseInt(props.projectId) ], null)
            .then((result) => {
                if(result.message != 'failed') project.value = result.data
            })
    })
    expiryData(localStorage.getItem('access_token'))
    // console.log(nearlyExpired(localStorage.getItem('access_token')) ? 'access exp' : 'access not exp')
})
let isTaskOpen = computed(() => {
    return route.name === 'TaskModal'
})
let isModalOpen = ref(false)
const openTask = (taskId, taskIndex, columnIndex) => {
    isModalOpen.value = true
    router.push({ name: 'TaskModal', params: { projectId: project.value.id, id: taskId, taskIndex: parseInt(taskIndex), 
        columnIndex: parseInt(columnIndex) } })
}
const closeTask = (taskId, taskIndexInCol, colIndexInProj, e) => {
    refreshTask(taskId, taskIndexInCol, colIndexInProj, e)
    isModalOpen.value = false
    router.push({ name: 'ProjectView', params: { projectId: project.value.id  } })
}
const refreshTask = (taskId, taskIndexInCol, colIndexInProj, e) => {
    if(e == 'deleted') {
        project.value.columns[colIndexInProj].tasks.splice(taskIndexInCol, 1)
        return
    }
    service.apiService(ProjectService.getSingleTask, [ parseInt(taskId) ], null).then((result) => {
        if(result.message != 'failed') project.value.columns[colIndexInProj].tasks[taskIndexInCol] = result.data
    })
}
const addTask = (event, columnId, columnIndex) => {
    if(event.target.value.length < 1) 
    {
        return false
    }
    service.apiService(ProjectService.createTask, [ parseInt(columnId) ], { name: event.target.value }).then((result) => {
        if(result.message != 'failed')  project.value.columns[columnIndex].tasks.push(result.data)
    })
    event.target.value = ''
}

const pickupTask = (taskId, fromColOfId, fromColIndex, fromTaskIndex, event) => {
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

            }
            else {
            }
        }).catch(() => {
                // replace the task as it was before
                const reMovedTask = project.value.columns[toColIndex].tasks.splice(toTaskIndex, 1)[0]
                project.value.columns[fromColIndex].tasks.splice(fromTaskIndex, 0, reMovedTask)

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

            }
            else {
            }
        }).catch(() => {
            const reMovedTask = project.value.columns[toColIndex].tasks.pop()
                project.value.columns[fromColIndex].tasks.splice(fromTaskIndex, 0, reMovedTask)

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

    const colToMove = project.value.columns.splice(fromColIndex, 1)[0]
    project.value.columns.splice(toColIndex, 0, colToMove)

    ProjectService.changeColsOrder(project.value.id, { 
        orderedCols: project.value.columns.map((col) => { return col.id })
     }).then((resp) => {
        if(resp.data.message == 'fail') {
            const reMovedCol = project.value.columns.splice(toColIndex, 1)[0]
            project.value.columns.splice(fromColIndex, 0, reMovedCol)

        }
        else {
        }
    }).catch((resp) => {
        const reMovedCol = project.value.columns.splice(toColIndex, 1)[0]
        project.value.columns.splice(fromColIndex, 0, reMovedCol)

    });

    // This section is to determine the columns that were forced to move, and the positions where they were moved.
    if(Math.abs(fromColIndex - toColIndex) <= 1) {
        let indexCounter = 0
        for(const col of project.value.columns) {
            if(col.id == toColOfId)
            {
                // console.log('col of id', col.id, 'and name', col.name, 'is now at position', indexCounter)
                
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
            // console.log('col of id', col.id, ' (name: ', col.name , ') now has the position', indexCounter)
            indexCounter++
        }        
    }
}

let columnName = ref('')

const addColumn = () => {
    if(columnName.value.length < 1) return false

    service.apiService(ProjectService.createColumn, [ project.value.id ], { name: columnName.value })
        .then((result) => {
            if(result.message != 'failed') project.value.columns.push(result.data)
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
    // const deletedCol = project.value.columns.splice(colIndex, 1)[0]

    closeColDeletionConfirmationModal()

    // Send to the backend
    service.apiService(ProjectService.deleteColumn, [ colId ], null).then((result) => {
        if(result.message != 'failed') project.value.columns.splice(colIndex, 1)[0]
        // project.value.columns.splice(colIndex, 0, deletedCol)
    })
}

let editingColName = ref(false)
let editingColOfId = ref(-1)
const enableEditingColName = (colId) => {
    editingColName.value = true
    editingColOfId.value = colId
    nextTick(() => {
        document.getElementById('colNameField_' + colId).focus()
    })
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
    service.apiService(ProjectService.updateColumn, [ colId ], { name: event.target.value })
        .then((result) => {
            if(result.message == 'failed') project.value.columns[colIndex].name = oldName
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
}
let updatedProjectName = ref('')
let editingProjectName = ref(false)
let projectNameRef = ref(null)
const stopEditingProjectName = () => {
    editingProjectName.value = false
}
const startEditingProjectName = () => {
    editingProjectName.value = true
    updatedProjectName.value = project.value.name
    nextTick(() => {
        projectNameRef.value.focus()
    })
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

    service.apiService(ProjectService.updateProject, [ project.value.id ], { name: updatedProjectName.value })
        .then((result) => {
            if(result.message == 'failed') project.value.name = oldProjectName
        })
    updatedProjectName.value = ''
}

const addToArchive = () => {
    service.apiService(ProjectService.addToArchive, [ project.value.id ], null).then((result) => {
        if(result.message != 'failed') window.location = (process.env.NODE_ENV === 'production' ? '/project-manager/' : '/') + project.value.id
    })
}
const unarchive = () => {
    service.apiService(ProjectService.removeFromArchive, [ project.value.id ], null).then((result) => {
        if(result.message != 'failed') window.location = (process.env.NODE_ENV === 'production' ? '/project-manager/' : '/') + project.value.id
    })
}
</script>