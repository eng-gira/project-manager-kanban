<template>
    <div class="absolute inset-0 bg-[rgba(0,0,0,0.5)] grid h-screen place-items-center overflow-y-auto">
        <div class="flex flex-col bg-white w-[300px] rounded-lg p-2">
            <h1 class="font-bold lg:text-lg mb-6">Team Members</h1>
            <div v-for="(member, memberIndex) in project.members" :key="member.id" class="flex justify-between mb-3">
                <h1 class="lg:text-md text-sm">{{ member.user_email }}</h1>
                <div v-if="isProjectAdmin(project.admin_id) && member.user_id != project.admin_id">
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
                    <v-icon
                        v-else
                        name="io-remove-circle-sharp"
                        class="cursor-pointer lg:w-[20px] w-[15px]"
                        @click="askToConfirmTeamMemberRemoval(member.id, memberIndex)"
                        />
                </div>
            </div>
            <form  @submit.prevent="addMember" class="flex justify-between mt-3" v-if="isProjectAdmin(project.admin_id)">
                <input
                    type="text"
                    class="p-2 mr-2 text-xs flex-grow bg-transparent border border-black rounded-md h-[28px]"
                    placeholder="Member Email"
                    v-model="emailOfMemberToAdd"
                    />
                <button
                    class="rounded-lg px-2 py-1 text-xs bg-[#0C4689] text-white"
                    >
                    Add
                </button>
            </form>
        </div>
    </div>    
</template>
<script setup>
import ProjectService from '@/services/ProjectService'
import { isProjectAdmin } from '@/utils';
import { ref } from 'vue'
import { useService } from './apiService.js'
import { useLoader } from './loadingService.js';

const props = defineProps({
    project: Object
})

const service = useService()
let members = ref(props.project.members)

let emailOfMemberToAdd = ref('')
const addMember = () => {
    if(emailOfMemberToAdd.value.length > 0) {
        useLoader([service.apiService(ProjectService.addMember, [ props.project.id ], { email: emailOfMemberToAdd.value })]).then((results) => {
            if(results[0].message != 'failed') members.value.push(results[0].data)
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
    useLoader([service.apiService(ProjectService.removeMember, [ props.project.id ], { email: memberEmail })]).then((results) => {
        if(results[0].message != 'failed') members.value.splice(memberIndex, 1)[0]
        closeTeamMemberRemovalConfirmation()
    })
}
</script>