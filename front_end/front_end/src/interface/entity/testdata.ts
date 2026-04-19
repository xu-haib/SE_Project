export interface TestdataConfig {
  time_limit: number
  memory_limit: number
  testcase: {
    fileI: string
    fileO: string
  }[]
}
