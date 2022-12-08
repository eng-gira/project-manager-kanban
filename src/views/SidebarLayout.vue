<template>
    <div class="flex">
        <!-- Sidebar -->
        <!-- bg-blue-100  -->
        <div class="flex flex-col self-start h-screen overflow-y-auto w-[320px] bg-[#FFFFFF] border-r-[1px] border-r-[#CCCCCC]">
            <div class="flex flex-col mt-6 text-sm px-4">
                <h1 class="font-bold uppercase mb-3 self-start">Projects</h1>
                <div
                    v-for="(project, projectIndex) in projects"
                    :key="projectIndex"
                    class="w-[220px] h-[45px] rounded-md flex flex-col justify-center mb-3"
                    :class="project.selected===true ? 
                        'bg-[#0C4689] text-white' :
                        'bg-[#F4F4F4] cursor-pointer hover:bg-[#0C4689] hover:text-white'"
                    >
                    {{ project.name }}
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
import { ref, onMounted } from 'vue'

let archivedProjects = ref([])

let projects = ref([
    {
        id: 1,
        selected: false,
        name: 'Build a project-manager'
    },
    {
        id: 2,
        selected: true,
        name: 'Build a business-manager'
    }
])

onMounted(() => {
    // Sort the projects to make the selected appear first
    for(let i = 0; i < projects.value.length; i++) {
        if(projects.value[i].selected)
        {
            let proj = projects.value.splice(i, 1)[0]
            projects.value.splice(0, 0, proj)
        }
    }
})

const logout = () => {
    alert('log out...')
    console.log('should log out...')
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