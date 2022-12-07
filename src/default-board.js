import { uuid } from './utils'

export default {
  name: 'workshop',
  columns: [
    {
      id: 1,
      name: 'todo',
      tasks: [
        {
          description: 'Description of task-1',
          name: 'first task',
          id: 1,
          userAssigned: null
        },
        {
          description: '',
          name: 'second task',
          id: 2,
          userAssigned: null
        },
        {
          description: 'describing task no. 3',
          name: 'THIRD task',
          id: 3,
          userAssigned: null
        }
      ]
    },
    {
      id: 2,
      name: 'in-progress',
      tasks: [
        {
          description: '',
          name: 'fourth task',
          id: 4,
          userAssigned: null
        }
      ]
    },
    {
      id: 3,
      name: 'done',
      tasks: [
        {
          description: '',
          name: 'fifth task',
          id: 5,
          userAssigned: null
        }
      ]
    }
  ]
}
