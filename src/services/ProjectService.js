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
        return apiClient.get('projects');
    },
    getSingleProject(id) {
        return apiClient.get('projects/' + id)
    },
    createProject(data) {
        return apiClient.post('projects', data, { headers: 
            {
                'Content-Type': 'application/json'
            }
        })
    },
    updateProject(id, data) {
        return apiClient.post('projects/' + id, data, { headers: 
            {
                'Content-Type': 'application/json'
            }
        }) 
    },

    getColumns(projectId) {
        return apiClient.get('projects/' + projectId + '/columns');
    },
    getSingleColumn(id) {
        return apiClient.get('columns/' + id)
    },
    createColumn(projectId, data) {
        return apiClient.post('projects/' + projectId +'/columns', data, { headers: 
            {
                'Content-Type': 'application/json'
            }
        })
    },
    updateColumn(id, data) {
        return apiClient.post('columns/' + id, data, { headers: 
            {
                'Content-Type': 'application/json'
            }
        })        
    },
    changeColsOrder(projectId, data) {
        return apiClient.post('projects/' + projectId + '/columns/changeOrder', data, { headers: 
            {
                'Content-Type': 'application/json'
            }
        })     
    },
    deleteColumn(id) {
        return apiClient.delete('columns/' + id)         
    },


    getTasks(columnId) {
        return apiClient.get('columns/' + columnId + '/tasks');
    },
    getSingleTask(id) {
        return apiClient.get('tasks/' + id)
    },
    createTask(columnId, data) {
        return apiClient.post('columns/' + columnId +'/tasks', data, { headers: 
            {
                'Content-Type': 'application/json'
            }
        })
    },
    updateTask(id, data) {
        return apiClient.post('tasks/' + id, data, { headers: 
            {
                'Content-Type': 'application/json'
            }
        })        
    },
    relocateTask(id, data) {
        return apiClient.post('tasks/' + id + '/relocate', data, { headers: 
            {
                'Content-Type': 'application/json'
            }
        })        
    },
    deleteTask(id) {
        return apiClient.delete('tasks/' + id)         
    },
}