import { random, sample } from 'lodash-es'
import type {
  SubmissionCore,
  Submission,
  SubmissionLite,
  Testcase,
  SubmissionFull,
  Judgement,
} from '../interface'
import { mockProblems } from './problem'
import { mockUsers } from './user'

export const mockSubmissionsCore: SubmissionCore[] = [
  {
    id: 1,
    submittedAt: new Date('2023-07-20T10:30:00'),
    processedAt: new Date('2023-07-20T10:30:05'),
    user: 1,
    problem: 1001,
    time: 42,
    memory: 1024,
    length: 120,
    verdict: 'PD',
    lang: 'cpp',
    score: 100,
  },
  {
    id: 2,
    submittedAt: new Date('2023-07-20T11:15:00'),
    processedAt: new Date('2023-07-20T11:15:10'),
    user: 2,
    problem: 1002,
    time: 1500,
    memory: 256000,
    length: 250,
    verdict: 'TLE',
    lang: 'java',
    score: 0,
  },
  {
    id: 3,
    submittedAt: new Date('2023-07-20T12:45:00'),
    processedAt: new Date('2023-07-20T12:45:03'),
    user: 3,
    problem: 1003,
    time: 85,
    memory: 5120,
    length: 180,
    verdict: 'WA',
    lang: 'python',
    score: 10,
  },
]

export const mockSubmissionsLite: SubmissionLite[] = mockSubmissionsCore.map((sub) => {
  const user = mockUsers.find((u) => u.id === sub.user)!
  const problem = mockProblems.find((p) => p.id === sub.problem)!

  return {
    ...sub,
    user,
    problem,
  }
})

// 生成测试点数据
const generateTestcases = (count: number, verdict: string): Testcase[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    verdict,
    time: Math.floor(Math.random() * 100) + 10,
    memory: Math.floor(Math.random() * 1024) + 128,
    score: verdict === 'AC' ? 100 : 0,
    input: `Sample input for test case ${i + 1}\n${'a'.repeat(200)}`,
    output: `Sample output for test case ${i + 1}\n${'b'.repeat(200)}`,
    checker:
      verdict === 'AC'
        ? 'Check passed: Output matches expected result'
        : 'Check failed: Output differs on line 3',
  }))
}

// 生成 SubmissionDetail 测试数据
export const mockSubmissions: Submission[] = [
  // AC 通过的提交
  {
    ...mockSubmissionsCore[0],
    code: `#include <iostream>
using namespace std;

int main() {
int a, b;
cin >> a >> b;
cout << a + b << endl;
return 0;
}`,
    compile: {
      success: true,
      message: 'g++ -std=c++17 -O2 -Wall -Wextra -Werror\nCompilation finished successfully',
    },
    detail: [...generateTestcases(5, 'PD'), ...generateTestcases(5, 'AC'), ...generateTestcases(2, 'WA')],
  },
  {
    ...mockSubmissionsCore[1],
    code: `public class Main {
public static void main(String[] args) {
  System.out.println("Hello World)
}
}`,
    compile: {
      success: false,
      message: `Main.java:3: error: unclosed string literal
  System.out.println("Hello World)
                      ^
Main.java:3: error: ';' expected
  System.out.println("Hello World)
                                    ^
2 errors`,
    },
    detail: [],
  },
  {
    ...mockSubmissionsCore[2],
    code: `n = int(input())
for i in range(n):
  a, b = map(int, input().split())
  print(a * b)  # 错误：应该是 a + b`,
    compile: {
      success: true,
      message: 'Python 3.8 interpreter\nCompilation finished successfully',
    },
    detail: [...generateTestcases(3, 'AC'), ...generateTestcases(4, 'WA')],
  },
  {
    ...mockSubmissionsCore[0],
    code: `#include <iostream>
using namespace std;

int main() {
int a, b;
cin >> a >> b;
cout << a / b << endl;  // 除零错误
return 0;
}`,
    compile: {
      success: true,
      message: 'g++ -std=c++17 -O2 -Wall -Wextra -Werror\nCompilation finished successfully',
    },
    detail: [
      {
        id: 1,
        verdict: 'RE',
        time: 10,
        memory: 1024,
        score: 0,
        input: '5 0',
        output: '',
        checker: 'Runtime error: division by zero',
      },
      ...generateTestcases(6, 'RE'),
    ],
  },
]

export const mockSubmissionsFull: SubmissionFull[] = mockSubmissions.map((sub) => {
  const user = mockUsers.find((u) => u.id === sub.user)!
  const problem = mockProblems.find((p) => p.id === sub.problem)!

  return {
    ...sub,
    user,
    problem,
  }
})

export const mockJudgements: Judgement[] = (() => {
  const list: Judgement[] = []
  for (let i = 0; i < 100; ++i) {
    const judgement: Judgement = {
      problem: 1000 + i,
      user: 1,
      judge: sample(['correct', 'incorrect', random(0, 100)])!,
      difficulty: 1000,
      stamp: new Date()
    }
    list.push(judgement)
  }
  return list
})()
