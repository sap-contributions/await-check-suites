/* eslint-disable prettier/prettier */
/* eslint-disable jest/no-conditional-expect */
/* eslint-disable @typescript-eslint/semi */

import {getOctokit} from '@actions/github'
import {
  CheckSuiteConclusion,
  CheckSuiteStatus,
  RepositoryResult,
  waitForCheckSuites
} from '../src/wait-for-check-suites'

jest.mock('node-fetch')

describe('main', () => {
  it('happy case test', async () => {
    const octokit = getOctokit('123')
    jest.spyOn(octokit, 'graphql').mockImplementation(async () => {
      return new Promise<RepositoryResult>(resolve => {
        resolve({
          repository: {
            ref: {
              target: {
                checkSuites: {
                  nodes: [
                    {
                      id: 'MDEwOkNoZWNrU3VpdGUxODQ0OTc5NA==',
                      app: {
                        slug: 'github-actions'
                      },
                      createdAt: '2023-10-12T13:47:50Z',
                      conclusion: CheckSuiteConclusion.success,
                      status: CheckSuiteStatus.completed
                    }
                  ]
                }
              }
            }
          }
        })
      })
    })

    const conclusion = await waitForCheckSuites({
      client: octokit,
      owner: 'Avenel',
      repo: 'await-check-suite-test',
      ref: '376e38096d7f7ef69af8f4ce7128de82c12269c1',
      checkSuiteID: 1,
      waitForACheckSuite: true,
      intervalSeconds: 2,
      timeoutSeconds: 4,
      appSlugFilter: null,
      onlyFirstCheckSuite: false
    })

    expect(conclusion).toBe(CheckSuiteConclusion.success)
  })

  it('should handle status pending', async () => {
    const octokit = getOctokit('123')
    jest.spyOn(octokit, 'graphql').mockImplementation(async () => {
      return new Promise<RepositoryResult>(resolve => {
        resolve({
          repository: {
            ref: {
              target: {
                checkSuites: {
                  nodes: [
                    {
                      id: 'MDEwOkNoZWNrU3VpdGUxODQ0OTc5NA==',
                      app: {
                        slug: 'github-actions'
                      },
                      createdAt: '2023-10-12T13:47:50Z',
                      conclusion: CheckSuiteConclusion.neutral,
                      status: CheckSuiteStatus.pending
                    }
                  ]
                }
              }
            }
          }
        })
      })
    })

    expect.assertions(1)
    try {
      await waitForCheckSuites({
        client: octokit,
        owner: 'Avenel',
        repo: 'await-check-suite-test',
        ref: '376e38096d7f7ef69af8f4ce7128de82c12269c1',
        checkSuiteID: 1,
        waitForACheckSuite: false,
        intervalSeconds: 1,
        timeoutSeconds: 1,
        appSlugFilter: null,
        onlyFirstCheckSuite: false
      })
    } catch (e) {
      expect(e).toEqual(new Error(`Timeout of 1 seconds reached.`))
    }
  })
})
