import { defineFakeRoute } from 'vite-plugin-fake-server/client'

import { mockUsers } from '../data'
import { UserListRequest, UserListResponse, UserRequest, UserResponse } from '../interface'

export default defineFakeRoute([
  {
    url: '/api/user',
    method: 'post',
    response: (_request: { body: Partial<UserRequest> }) => {
      const response: UserResponse = {
        user: mockUsers[0],
      }
      return response
    },
  },
  {
    url: '/api/user/list',
    method: 'post',
    response: (_request: { body: Partial<UserListRequest> }) => {
      const response: UserListResponse = {
        total: mockUsers.length,
        users: mockUsers,
      }
      return response
    },
  },
])
