import axios from 'axios'


const apiClient = axios.create({
    baseURL: 'http://localhost:8000/api',
    withCredentials: false,
})


export default {
    register(data) {
        return apiClient.post('register', data, { 
            headers: {
                'Content-Type': 'application/json'
            }
         });
    },
    login(data) {
        return apiClient.post('login', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    },
    logout() {
        return apiClient.post('logout', {  }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        });        
    },
    getProjects() {
        return apiClient.get('projects', {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('access_token')
            }
        });
    },
    getSingleProject(id) {
        return apiClient.get('projects/' + id, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('access_token')
            }            
        })
    },
    createProject(data) {
        return apiClient.post('projects', data, { headers: 
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        })
    },
    updateProject(id, data) {
        return apiClient.post('projects/' + id, data, { headers: 
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        }) 
    },

    getColumns(projectId) {
        return apiClient.get('projects/' + projectId + '/columns', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        });
    },
    getSingleColumn(id) {
        return apiClient.get('columns/' + id, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')                
            }
        })
    },
    createColumn(projectId, data) {
        return apiClient.post('projects/' + projectId +'/columns', data, { headers: 
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        })
    },
    updateColumn(id, data) {
        return apiClient.post('columns/' + id, data, { headers: 
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        })        
    },
    changeColsOrder(projectId, data) {
        return apiClient.post('projects/' + projectId + '/columns/changeOrder', data, { headers: 
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        })     
    },
    deleteColumn(id) {
        return apiClient.delete('columns/' + id, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')                
            }
        })         
    },


    getTasks(columnId) {
        return apiClient.get('columns/' + columnId + '/tasks', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        });
    },
    getSingleTask(id) {
        return apiClient.get('tasks/' + id, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        })
    },
    createTask(columnId, data) {
        return apiClient.post('columns/' + columnId +'/tasks', data, { headers: 
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        })
    },
    updateTask(id, data) {
        return apiClient.post('tasks/' + id, data, { headers: 
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        })        
    },
    relocateTask(id, data) {
        return apiClient.post('tasks/' + id + '/relocate', data, { headers: 
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        })        
    },
    deleteTask(id) {
        return apiClient.delete('tasks/' + id, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        })         
    },
    // Members
    getMembers(projectId) {
        // 'projects/{projectId}/getMembers'
        return apiClient.get('projects/', projectId, '/getMembers', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('access_token')
            }
        })
    },
    addMember(projectId, data) {
        // 'projects/{projectId}/addMember'
        return apiClient.post('projects/' + projectId + '/addMember', data, { 
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('access_token')
            }
         })
    },
    removeMember(projectId, data) {
        return apiClient.post('projects/' + projectId + '/removeMember', data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('access_token')
            }
        })
    }
}