<template>
    <div class="flex">
        <!-- Sidebar -->
        <!-- bg-blue-100  -->
        <div class="flex flex-col self-start h-screen overflow-y-auto w-[320px] bg-[#FFFFFF] border-r-[1px] border-r-[#CCCCCC]">
            <div class="flex flex-col mt-6 text-sm px-4">
                <h1 class="font-bold mb-3 self-start">Projects</h1>
                <div v-if="projects.length < 1" class="italic mb-3">Loading...</div>
                <router-link
                    v-else
                    v-for="(project, projectIndex) in projects"
                    :key="projectIndex"
                    class="w-[220px] h-[45px] rounded-md flex flex-col justify-center items-start mb-3"
                    :class="project.id==selectedProjectId ? 
                        'bg-[#0C4689] text-white' :
                        'bg-[#F4F4F4] cursor-pointer hover:bg-[#0C4689] hover:text-white'"
                    :to="{name: 'ProjectView', params: { projectId: project.id }}"
                    >
                    <h1 class="ml-3">{{ project.name }}</h1>
                </router-link>

                <div class="text-sm">
                    <h1 class="italic text-xs" :class="{'text-red-500': errorInCreateProject}" v-if="createProjectStatusMessage"> {{ createProjectStatusMessage }} </h1>
                    <button
                        v-if="!creatingProject"
                        class="bg-[#F4F4F4] hover:underline w-[220px] h-[45px] rounded-md"
                        @click="startCreatingProject"
                        >
                        New Project...
                    </button>
                    <div v-else>
                        <input
                            type="text"
                            placeholder="Project Name..."
                            @keyup.enter="createProject($event)"
                            @keyup.esc="closeProjectCreate"
                            @focusout="closeProjectCreate"
                            class="bg-[#F4F4F4] rounded-md p-2 w-[220px] h-[45px]"
                            />
                    </div>
                </div>
            </div>
            <div class="text-xs flex flex-col mt-6 mb-6" v-if="archivedProjects.length <= 0">
                <h1 class="font-bold uppercase">Archived Projects</h1>
            </div>
            <div class="mt-auto self-center">
                <div
                    @click="logout"
                    class="cursor-pointer text-sm font-bold mb-6 bg-[#F4F4F4] text-red-500 w-[220px] h-[45px] rounded-md hover:bg-gray-300 flex flex-col justify-center">
                    Logout
                </div>
            </div>
        </div>

        <!-- Router View -->
        <router-view />
    </div>
</template>
<script setup>
import ProjectService from '@/services/ProjectService';
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router';


let archivedProjects = ref([])
const route = useRoute()
const router = useRouter()

let projects = ref([])

onMounted(() => {
    ProjectService.getProjects().then((resp) => {
        projects.value = resp.data.data
        // console.log(projects.value)
    })
})


let selectedProjectId = computed(() => {
    if(route.params.projectId)
    {
        for(let i = 0; i < projects.value.length; i++) {
            if(projects.value[i].id == route.params.projectId)
            {
                return projects.value[i].id
            }
        }
    }
})

const logout = () => {
    // Do not need BE confirmation to log out.
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('access_token')
    router.push({ name: 'RegisterView' })
}

let creatingProject = ref(false)
let createProjectStatusMessage = ref('')
let errorInCreateProject = ref(false)
const startCreatingProject = () => {
    creatingProject.value = true
    errorInCreateProject.value = false
    createProjectStatusMessage.value = ''
}
const closeProjectCreate = () => {
    creatingProject.value = false
}
const createProject = (event) => {
    createProjectStatusMessage.value = 'Loading...'
    if(event.target.value.length > 0) {
        ProjectService.createProject(JSON.stringify({ name: event.target.value })).then((resp) => {
            if(resp.data.message == 'failed')
            {
                errorInCreateProject.value = true
                createProjectStatusMessage.value = resp.data.data
                // console.log(resp.data.message)
            }
            else {
                projects.value.push(resp.data.data)
                createProjectStatusMessage.value = ''
                // console.log(resp.data.data)
            }
        })
    } else {
        errorInCreateProject.value = true
        createProjectStatusMessage.value = 'The name field is required'       
    }
    closeProjectCreate()
}

</script>
<style>
.sidebar {
    box-sizing: border-box;

    position: absolute;
    width: 321px;
    height: 982px;
    left: 0px;
    top: 0px;

    background: #FFFFFF;
    border-right: 1px solid #CCCCCC;    
}
.btn-blue {
    position: absolute;
    width: 250px;
    height: 45px;
    left: 35px;
    top: 71px;

    background: #0C4689;
    border-radius: 7px;
}
.btn {
    position: absolute;
    width: 250px;
    height: 45px;
    left: 35px;
    top: 124px;

    background: #F4F4F4;
    border-radius: 7px;
}
</style>