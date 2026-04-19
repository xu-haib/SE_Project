import { defineStore } from 'pinia'

export const useTest = defineStore('testdata', () => {
  function generateMany(source: object[]) {
    const result: object[] = []
    for (let i = 0; i < 500; ++i) {
      result.push(source[Math.floor(Math.random() * source.length)])
    }
    return result
  }

  return {
    generateMany,
  }
})
