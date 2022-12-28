import axios from 'axios'
import router from '@/router'
import { hasExpired } from '@/utils'

// const apiClient = axios.create({
//     baseURL: 'http://localhost:8000/api',
//     withCredentials: false,
// })
/**
 * Used for requests to protected endpoints.
 */
const protectedEPClient = axios.create({
    baseURL: 'https://pm-kanban-back.onrender.com/api',
    withCredentials: false,
})
/**
 * Used for refreshing the token.
 */
const refreshClient = axios.create({
    baseURL: 'https://pm-kanban-back.onrender.com/api/refresh',
    withCredentials: false, 
})

// Add a request interceptor
protectedEPClient.interceptors.request.use(async function (config) {
    // console.log('req. interceptor - config:', config)
    // console.log('req. interceptor - config.headers.Authorization:', config.headers.Authorization)

    // Do something before request is sent
    if(hasExpired(localStorage.getItem('access_token')))
    {
        console.log('access_token HAS expired')

        // Request a new access token
        try {
            let resp = await refreshClient.post('', {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                }
            })
            // console.log('refresh token request resp:', resp.status)
            if(resp.data.data) {
                // console.log('refreshed access_token', resp.data.access_token)
                localStorage.setItem('access_token', resp.data.data)
                config.headers.Authorization = 'Bearer ' + resp.data.data
                // console.log('the sent authorization header after rfr4:', config.headers.Authorization)
                return config
            } else 
            {
                console.log('no access token refreshed, must login also, resp:', resp)
                localStorage.removeItem('access_token')
                
                window.location = '/auth/login'
                return Promise.reject();
            }
        }
        catch(e) {
            console.log('error at refreshing...')
            localStorage.removeItem('access_token')

            window.location = '/auth/login'

            return Promise.reject()
        }
        
    } else {
        return config
    }
}, function (error) {
    // Do something with request error
    return Promise.reject('REQUEST ERROR: ' + error);
});

protectedEPClient.interceptors.response.use(function (response) {

    return response;
  }, function (error) {
    // Do something with response error
    console.log('error:', error)
    console.log('error.response:', error.response)
    console.log('error.response.status:', error.response.status)
    console.log('error.response.message:', error.response.message)
    console.log('error.response.data.message:', error.response.data.message)
    console.log('error.response.config.baseURL + / + error.response.config.url:', error.response.config.baseURL + '/' + error.response.config.url)

    if(localStorage.getItem('access_token') && error.response.data.message == 'Unauthenticated.') {
        console.log('lagged refresh... pushing to', router.currentRoute.value.fullPath)
        router.push(router.currentRoute.value.fullPath)
    } else {
        router.push({name: 'ErrorDisplayView', params: { status: error.response.status }})
    }

    return Promise.reject(error);
})

export default {
    register(data) {
        return axios.post('https://pm-kanban-back.onrender.com/api/register', data, { 
            headers: {
                'Content-Type': 'application/json'
            }
         });
    },
    login(data) {
        return axios.post('https://pm-kanban-back.onrender.com/api/login', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    },
    getProjects() {
        return protectedEPClient.get('projects', {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('access_token')
            }
        });
    },
    getSingleProject(id) {
        return protectedEPClient.get('projects/' + id, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('access_token')
            }            
        })
    },
    createProject(data) {
        return protectedEPClient.post('projects', data, { headers: 
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        })
    },
    updateProject(id, data) {
        return protectedEPClient.post('projects/' + id, data, { headers: 
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        }) 
    },
    addToArchive(id) {
        return protectedEPClient.post('projects/addToArchive/' + id, {}, { headers: 
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        })     
    },
    removeFromArchive(id) {
        return protectedEPClient.post('projects/removeFromArchive/' + id, {}, { headers: 
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        })     
    },
    getArchivedProjects() {
        return protectedEPClient.get('archive/projects', {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('access_token')
            }            
        })        
    },
    getColumns(projectId) {
        return protectedEPClient.get('projects/' + projectId + '/columns', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        });
    },
    getSingleColumn(id) {
        return protectedEPClient.get('columns/' + id, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')                
            }
        })
    },
    createColumn(projectId, data) {
        return protectedEPClient.post('projects/' + projectId +'/columns', data, { headers: 
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        })
    },
    updateColumn(id, data) {
        return protectedEPClient.post('columns/' + id, data, { headers: 
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        })        
    },
    changeColsOrder(projectId, data) {
        return protectedEPClient.post('projects/' + projectId + '/columns/changeOrder', data, { headers: 
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        })     
    },
    deleteColumn(id) {
        return protectedEPClient.delete('columns/' + id, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')                
            }
        })         
    },


    getTasks(columnId) {
        return protectedEPClient.get('columns/' + columnId + '/tasks', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        });
    },
    getSingleTask(id) {
        return protectedEPClient.get('tasks/' + id, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        })
    },
    createTask(columnId, data) {
        return protectedEPClient.post('columns/' + columnId +'/tasks', data, { headers: 
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        })
    },
    updateTask(id, data) {
        return protectedEPClient.post('tasks/' + id, data, { headers: 
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        })        
    },
    relocateTask(id, data) {
        return protectedEPClient.post('tasks/' + id + '/relocate', data, { headers: 
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        })        
    },
    deleteTask(id) {
        return protectedEPClient.delete('tasks/' + id, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        })         
    },
    // Members
    getMembers(projectId) {
        return protectedEPClient.get('projects/' + projectId + '/getMembers', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        })
    },
    addMember(projectId, data) {
        // 'projects/{projectId}/addMember'
        return protectedEPClient.post('projects/' + projectId + '/addMember', data, { 
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('access_token')
            }
         })
    },
    removeMember(projectId, data) {
        return protectedEPClient.post('projects/' + projectId + '/removeMember', data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('access_token')
            }
        })
    },
    // Comments
    getComments(taskId) {
        return protectedEPClient.get('tasks/', taskId, '/comments', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('access_token')
            }
        })      
    },
    getSingleComment(id) {
        return protectedEPClient.get('comments/' + id, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        })
    },
    createComment(taskId, data) {
        return protectedEPClient.post('tasks/' + taskId +'/comments', data, { headers: 
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        })    
    },
    updateComment(id, data) {
        return protectedEPClient.post('comments/' + id, data, { headers: 
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        })    
    },
    deleteComment(id) {
        return protectedEPClient.delete('comments/' + id, { headers: 
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        })    
    },    
}