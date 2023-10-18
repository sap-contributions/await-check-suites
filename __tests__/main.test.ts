/* eslint-disable prettier/prettier */
/* eslint-disable jest/no-conditional-expect */
/* eslint-disable @typescript-eslint/semi */

import {getOctokit} from '@actions/github'
import * as WaitForCheckSuites from '../src/wait-for-check-suites'
import * as GitHubInteractions from '../src/github-api-interactions'
import * as Helper from '../src/helper'

jest.mock('node-fetch')

describe('main', () => {
  it('happy case test', async () => {
    const octokit = getOctokit('123')
    jest.spyOn(octokit, 'graphql').mockImplementation(async () => {
      return new Promise<GitHubInteractions.RepositoryResult>(resolve => {
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
                      conclusion: GitHubInteractions.CheckSuiteConclusion.SUCCESS,
                      status: GitHubInteractions.CheckSuiteStatus.COMPLETED
                    }
                  ]
                }
              }
            }
          }
        })
      })
    })

    const conclusion = await WaitForCheckSuites.waitForCheckSuites({
      client: octokit,
      owner: 'Avenel',
      repo: 'await-check-suite-test',
      ref: '376e38096d7f7ef69af8f4ce7128de82c12269c1',
      checkSuiteID: null,
      waitForACheckSuite: true,
      intervalSeconds: 2,
      timeoutSeconds: 4,
      appSlugFilter: null,
      onlyFirstCheckSuite: false
    })

    expect(conclusion).toBe(GitHubInteractions.CheckSuiteConclusion.SUCCESS)
  })

  it('should handle status pending', async () => {
    const octokit = getOctokit('123')
    jest.spyOn(octokit, 'graphql').mockImplementation(async () => {
      return new Promise<GitHubInteractions.RepositoryResult>(resolve => {
        resolve({
          repository: {
            ref: {
              target: {
                checkSuites: {
                  nodes: [
                    {
                      id: 'MDEwOkNoZWNrU3VpdGUxODQ0OTc5NQ==',
                      app: {
                        slug: 'github-actions'
                      },
                      createdAt: '2023-10-12T13:37:50Z',
                      conclusion: GitHubInteractions.CheckSuiteConclusion.SUCCESS,
                      status: GitHubInteractions.CheckSuiteStatus.COMPLETED
                    },
                    {
                      id: 'MDEwOkNoZWNrU3VpdGUxODQ0OTc5NA==',
                      app: {
                        slug: 'github-actions'
                      },
                      createdAt: '2023-10-12T13:47:50Z',
                      conclusion: GitHubInteractions.CheckSuiteConclusion.NEUTRAL,
                      status: GitHubInteractions.CheckSuiteStatus.PENDING
                    }
                  ]
                }
              }
            }
          }
        })
      })
    })

    try {
      await WaitForCheckSuites.waitForCheckSuites({
        client: octokit,
        owner: 'Avenel',
        repo: 'await-check-suite-test',
        ref: '376e38096d7f7ef69af8f4ce7128de82c12269c1',
        checkSuiteID: null,
        waitForACheckSuite: true,
        intervalSeconds: 1,
        timeoutSeconds: 1,
        appSlugFilter: null,
        onlyFirstCheckSuite: false
      })
    } catch (e) {
      expect(e).toEqual(new Error(`Timeout of 1 seconds reached.`))
    }

    expect.assertions(1)
  })
})

describe('get highest priority', () => {

  it('should detect highest priority status pending', async () => {
    const highestPriority = Helper.getHighestPriorityCheckSuiteStatus([
      {
        id: 'MDEwOkNoZWNrU3VpdGUxODQ0OTc5NA==',
        app: {
          slug: 'github-actions'
        },
        createdAt: '2023-10-12T13:47:50Z',
        conclusion: GitHubInteractions.CheckSuiteConclusion.NEUTRAL,
        status: GitHubInteractions.CheckSuiteStatus.PENDING
      },
      {
        id: 'MDEwOkNoZWNrU3VpdGUxODQ0OTc5NQ==',
        app: {
          slug: 'github-actions'
        },
        createdAt: '2023-10-12T13:37:50Z',
        conclusion: GitHubInteractions.CheckSuiteConclusion.SUCCESS,
        status: GitHubInteractions.CheckSuiteStatus.COMPLETED
      }
    ]);
    expect(highestPriority).toBe(GitHubInteractions.CheckSuiteStatus.PENDING);
  })

  it('should detect highest priority conclusion failure', async () => {
    const highestPriority = Helper.getHighestPriorityCheckSuiteConclusion([
      {
        id: 'MDEwOkNoZWNrU3VpdGUxODQ0OTc5NA==',
        app: {
          slug: 'github-actions'
        },
        createdAt: '2023-10-12T13:47:50Z',
        conclusion: GitHubInteractions.CheckSuiteConclusion.SUCCESS,
        status: GitHubInteractions.CheckSuiteStatus.COMPLETED
      },
      {
        id: 'MDEwOkNoZWNrU3VpdGUxODQ0OTc5NQ==',
        app: {
          slug: 'github-actions'
        },
        createdAt: '2023-10-12T13:37:50Z',
        conclusion: GitHubInteractions.CheckSuiteConclusion.FAILURE,
        status: GitHubInteractions.CheckSuiteStatus.COMPLETED
      }
    ]);
    expect(highestPriority).toBe(GitHubInteractions.CheckSuiteConclusion.FAILURE);
  })

  it('should not call getting highest conclusion if checksuite status is not completed.', async () => {
    const checkSuites = [
      {
        id: 'MDEwOkNoZWNrU3VpdGUxODQ0OTc5NQ==',
        app: {
          slug: 'github-actions'
        },
        createdAt: '2023-10-12T13:37:50Z',
        conclusion: undefined,
        status: GitHubInteractions.CheckSuiteStatus.IN_PROGRESS
      }
    ];

    const getHighestPriorityCheckSuiteStatusSpy = jest.spyOn(Helper, 'getHighestPriorityCheckSuiteStatus');
    const getHighestPriorityCheckSuiteConclusionSpy = jest.spyOn(Helper, 'getHighestPriorityCheckSuiteConclusion');

    const octokit = getOctokit('123')
    jest.spyOn(octokit, 'graphql').mockImplementation(async () => {
      return new Promise<GitHubInteractions.RepositoryResult>(resolve => {
        resolve({
          repository: {
            ref: {
              target: { 
                checkSuites: {
                  nodes: checkSuites
                }
              }
            }
          }
        })
      })
    })

    try {
      await WaitForCheckSuites.waitForCheckSuites({
        client: octokit,
        owner: 'Avenel',
        repo: 'await-check-suite-test',
        ref: '376e38096d7f7ef69af8f4ce7128de82c12269c1',
        checkSuiteID: null,
        waitForACheckSuite: true,
        intervalSeconds: 1,
        timeoutSeconds: 1,
        appSlugFilter: null,
        onlyFirstCheckSuite: false
      })
    } catch (e) {
      expect(e).toEqual(new Error(`Timeout of 1 seconds reached.`))
    }

    expect(getHighestPriorityCheckSuiteConclusionSpy).toHaveBeenCalledTimes(0);

    // should be called twice, once for the first check and second check during interval.
    expect(getHighestPriorityCheckSuiteStatusSpy).toHaveBeenCalledTimes(2);

    expect.assertions(3)
  })

})
