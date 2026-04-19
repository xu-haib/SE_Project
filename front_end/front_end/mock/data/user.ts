import type { User } from '../interface'

export const mockUsers: User[] = [
  {
    id: 1,
    name: '琪露诺',
    role: 4,
    avatar: 'https://example.com/avatar1.jpg',
    register: new Date('2023-07-20T10:30:00'),
  },
  { id: 2, name: '魔理沙', role: 1, register: new Date('2023-07-20T10:30:00') },
  {
    id: 3,
    name: '大妖精',
    role: 4,
    avatar: 'https://example.com/avatar3.jpg',
    register: new Date('2023-07-20T10:30:00'),
  },
]
