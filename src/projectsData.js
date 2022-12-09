export default {
  users: [
    {
      id: 1,
      name: 'user1',
      emai: 'user1@pm.com'
    },
    {
      id: 2,
      name: 'user2',
      emai: 'user2@pm.com'      
    },
    {
      id: 3,
      name: 'user3',
      emai: 'user3@pm.com'      
    },
    {
      id: 4,
      name: 'user4',
      emai: 'user4@pm.com'      
    },
  ],
  projects: [
    {
      id: 1, 
      name: 'project-one',
      adminId: 3,
      members: [
        {
          id: 3,
          name: 'user3',
          emai: 'user3@pm.com'      
        },
        {
          id: 4,
          name: 'user4',
          emai: 'user4@pm.com'      
        },        
      ],
      columns: [
        {
          id: 1,
          name: 'todo',
          tasks: [
            {
              description: 'Description of task-1',
              name: 'first task',
              id: 1,
              userAssigned: 3
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
              userAssigned: 4
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
              userAssigned: 4
            }
          ]
        }
      ]      
    },
    {
      id: 2, 
      name: 'project-two',
      adminId: 2,
      members: [
        {
          id: 1,
          name: 'user1',
          emai: 'user1@pm.com'
        },
        {
          id: 2,
          name: 'user2',
          emai: 'user2@pm.com'      
        },        
      ],

      columns: [
        {
          id: 4,
          name: 'Tasks',
          tasks: [
            {
              description: '',
              name: 'Set a to-do list',
              id: 6,
              userAssigned: 1

            },
            {
              description: 'Find members, add them',
              name: 'Add members',
              id: 7,
              userAssigned: 2

            },
          ]
        },
        {
          id: 5,
          name: 'Issues',
          tasks: [
            {
              description: 'Determine what the bug in the thing is and solve it',
              name: 'The bug in the thing',
              id: 8,
              userAssigned: 1

            }
          ]
        },
        {
          id: 6,
          name: 'Objectives',
          tasks: [
            {
              description: 'Satisfy the client and get paid well',
              name: 'Complete the requirements',
              id: 9,
              userAssigned: null

            }
          ]
        }
      ]      
    }

  ],
}
