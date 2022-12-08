import { uuid } from './utils'

export default {
  name: 'workshop',
  columns: [
    {
      id: 1,
      orderInBoard: 1,
      name: 'todo',
      tasks: [
        {
          description: 'Description of task-1',
          name: 'first task',
          id: 1,
          userAssigned: 2
        },
        {
          description: '',
          name: 'second task',
          id: 2,
          userAssigned: 1
        },
        {
          description: 'describing task no. 3',
          name: 'THIRD task',
          id: 3,
          userAssigned: 3
        }
      ]
    },
    {
      id: 2,
      orderInBoard: 2,
      name: 'in-progress',
      tasks: [
        {
          description: '',
          name: 'fourth task',
          id: 4,
          userAssigned: 3
        }
      ]
    },
    {
      id: 3,
      orderInBoard: 3,
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
