import * as core from '@actions/core'
import {GitHub} from '@actions/github/lib/utils'

export interface GetCheckSuitesOptions {
  client: InstanceType<typeof GitHub>
  owner: string
  repo: string
  ref: string
}

export interface RepositoryResult {
  repository: Repository
}

interface Repository {
  object: Commit
}

interface Commit {
  checkSuites: CheckSuiteEdges
}

interface CheckSuiteEdges {
  nodes: CheckSuite[]
}

export interface CheckSuite {
  id: string
  app: {slug?: string} | null
  createdAt: string

  // The conclusion can be null, e.g. if the status of the CheckSuite is Pending.
  conclusion: CheckSuiteConclusion | undefined

  status: CheckSuiteStatus
}

export interface CheckSuitesForRepositoryResult {
  totalCount: number
  checkSuites: CheckSuite[]
}

// Define these enums to workaround https://github.com/octokit/plugin-rest-endpoint-methods.js/issues/9
// All possible Check Suite statuses in descending order of priority
/* eslint-disable no-shadow */
export enum CheckSuiteStatus {
  PENDING = 'PENDING',
  QUEUED = 'QUEUED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

// All possible Check Suite conclusions in descending order of priority
export enum CheckSuiteConclusion {
  ACTION_REQUIRED = 'ACTION_REQUIRED',
  CANCELLED = 'CANCELLED',
  TIMED_OUT = 'TIMED_OUT',
  FAILURE = 'FAILURE',
  NEUTRAL = 'NEUTRAL',
  SUCCESS = 'SUCCESS'
}

export async function getCheckSuites(options: GetCheckSuitesOptions): Promise<CheckSuitesForRepositoryResult> {
  const {client, owner, repo, ref} = options

  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      const query = `{
        repository(owner: "${owner}", name: "${repo}") {
          name
          object(oid: "${ref}") {
            ... on Commit {
              checkSuites(first: 100) {
                nodes {
                  id,
                  app {
                      slug,
                      name
                  },
                  createdAt,
                  conclusion,
                  status   
                }
              }
            }
          }
        }
      }`

      const response = await client.graphql<RepositoryResult>(query)

      core.info(`CheckSuites: ${JSON.stringify(response.repository.object.checkSuites.nodes)}`)

      resolve({
        totalCount: response.repository.object.checkSuites.nodes.length,
        checkSuites: response.repository.object.checkSuites.nodes
      })
    } catch (e) {
      reject(e)
    }
  })
}
