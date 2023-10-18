import * as core from '@actions/core'
import {GitHub} from '@actions/github/lib/utils'
import {CheckSuiteConclusion, CheckSuiteStatus, getCheckSuites} from './github-api-interactions'
import {diagnose, getHighestPriorityCheckSuiteConclusion, getHighestPriorityCheckSuiteStatus} from './helper'

interface WaitForCheckSuitesOptions {
  client: InstanceType<typeof GitHub>
  owner: string
  repo: string
  ref: string
  checkSuiteID: number | null
  waitForACheckSuite: boolean
  intervalSeconds: number
  timeoutSeconds: number | null
  appSlugFilter: string | null
  onlyFirstCheckSuite: boolean
}
interface CheckTheCheckSuitesOptions {
  client: InstanceType<typeof GitHub>
  owner: string
  repo: string
  ref: string
  checkSuiteID: number | null
  waitForACheckSuite: boolean
  appSlugFilter: string | null
  onlyFirstCheckSuite: boolean
}

export async function waitForCheckSuites(options: WaitForCheckSuitesOptions): Promise<CheckSuiteConclusion> {
  const {
    client,
    owner,
    repo,
    ref,
    checkSuiteID,
    waitForACheckSuite,
    intervalSeconds,
    timeoutSeconds,
    appSlugFilter,
    onlyFirstCheckSuite
  } = options

  /* eslint-disable no-async-promise-executor */
  return new Promise(async (resolve, reject) => {
    // Check to see if all of the check suites have already completed
    let response = await checkTheCheckSuites({
      client,
      owner,
      repo,
      ref,
      checkSuiteID,
      waitForACheckSuite,
      appSlugFilter,
      onlyFirstCheckSuite
    })
    if (response === CheckSuiteConclusion.SUCCESS) {
      resolve(CheckSuiteConclusion.SUCCESS)
      return
    } else if (
      response !== CheckSuiteStatus.PENDING &&
      response !== CheckSuiteStatus.QUEUED &&
      response !== CheckSuiteStatus.IN_PROGRESS
    ) {
      resolve(response)
      return
    }

    // Is set by setTimeout after the below setInterval
    /* eslint-disable no-undef */
    let timeoutId: NodeJS.Timeout

    // Continue to check for completion every ${intervalSeconds}
    const intervalId = setInterval(async () => {
      response = await checkTheCheckSuites({
        client,
        owner,
        repo,
        ref,
        checkSuiteID,
        waitForACheckSuite,
        appSlugFilter,
        onlyFirstCheckSuite
      })
      if (response === CheckSuiteConclusion.SUCCESS) {
        if (timeoutId) {
          clearTimeout(timeoutId)
        }
        clearInterval(intervalId)
        resolve(CheckSuiteConclusion.SUCCESS)
        return
      } else if (
        response !== CheckSuiteStatus.PENDING &&
        response !== CheckSuiteStatus.QUEUED &&
        response !== CheckSuiteStatus.IN_PROGRESS
      ) {
        if (timeoutId) {
          clearTimeout(timeoutId)
        }
        clearInterval(intervalId)
        resolve(response)
        return
      }
    }, intervalSeconds * 1000)

    // Fail action if ${timeoutSeconds} is reached
    if (timeoutSeconds) {
      timeoutId = setTimeout(() => {
        clearInterval(intervalId)
        reject(new Error(`Timeout of ${timeoutSeconds} seconds reached.`))
      }, timeoutSeconds * 1000)
    }
  })
}

async function checkTheCheckSuites(
  options: CheckTheCheckSuitesOptions
): Promise<Exclude<CheckSuiteStatus, CheckSuiteStatus.COMPLETED> | CheckSuiteConclusion> {
  const {client, owner, repo, ref, checkSuiteID, waitForACheckSuite, appSlugFilter, onlyFirstCheckSuite} = options

  return new Promise(async resolve => {
    const checkSuitesAndMeta = await getCheckSuites({
      client,
      owner,
      repo,
      ref
    })

    if (checkSuitesAndMeta.totalCount === 0 || checkSuitesAndMeta.checkSuites.length === 0) {
      if (waitForACheckSuite) {
        core.debug(`No check suites exist for this commit. Waiting for one to show up.`)
        resolve(CheckSuiteStatus.QUEUED)
        return
      } else {
        core.info('No check suites exist for this commit.')
        resolve(CheckSuiteConclusion.SUCCESS)
        return
      }
    }

    // Filter for Check Suites that match the app slug
    let checkSuites = appSlugFilter
      ? checkSuitesAndMeta.checkSuites.filter(checkSuite => checkSuite.app?.slug === appSlugFilter)
      : checkSuitesAndMeta.checkSuites

    // Ignore this Check Run's Check Suite
    // TODO: Check if encoded checkSuiteID (which is a number) matches the format of the id of the graphql response
    const encodedChekSuiteID = Buffer.from(`010:CheckSuite${checkSuiteID}`, 'binary').toString('base64')
    checkSuites = checkSuites.filter(checkSuite => encodedChekSuiteID !== checkSuite.id)

    // Check if there are no more Check Suites after the app slug and Check Suite ID filters
    if (checkSuites.length === 0) {
      let message = ''
      if (appSlugFilter && checkSuiteID !== null) {
        message = `No check suites (excluding this one) with the app slug '${appSlugFilter}' exist for this commit.`
      } else if (checkSuiteID !== null) {
        message = `No check suites (excluding this one) exist for this commit.`
      } else if (appSlugFilter) {
        message = `No check suites with the app slug '${appSlugFilter}' exist for this commit.`
      } else {
        throw new Error(
          "A Check Suite should exist, but it doesn't. Please submit an issue on this action's GitHub repo."
        )
      }
      if (waitForACheckSuite) {
        core.debug(`${message} Waiting for one to show up.`)
        resolve(CheckSuiteStatus.QUEUED)
        return
      } else {
        core.info(message)
        resolve(CheckSuiteConclusion.SUCCESS)
        return
      }
    }

    // Only take into account the first Check Suite created that matches the `appSlugFilter`
    if (onlyFirstCheckSuite) {
      // Get the first Check Suite created by reducing the array based on the created_at timestamp
      const firstCheckSuite = checkSuites.reduce((previous, current) => {
        // Cast to any to workaround https://github.com/octokit/plugin-rest-endpoint-methods.js/issues/8
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const previousDateString = previous.createdAt
        const currentDateString = current.createdAt
        /* eslint-enable @typescript-eslint/no-explicit-any */
        if (typeof previousDateString !== 'string' || typeof currentDateString !== 'string') {
          throw new Error(`Expected ChecksListSuitesForRefResponseCheckSuitesItem to have the property 'created_at' with type 'string' but got '
              ${
                typeof previousDateString === typeof currentDateString
                  ? typeof previousDateString
                  : `${typeof previousDateString} and ${typeof currentDateString}`
              }'. Please submit an issue on this action's GitHub repo.`)
        }
        return Date.parse(previousDateString) < Date.parse(currentDateString) ? previous : current
      })

      // Set the array of Check Suites to an array of one containing the first Check Suite created
      checkSuites = [firstCheckSuite]
    }

    const highestPriorityCheckSuiteStatus = getHighestPriorityCheckSuiteStatus(checkSuites)
    if (highestPriorityCheckSuiteStatus === CheckSuiteStatus.COMPLETED) {
      const highestPriorityCheckSuiteConclusion = getHighestPriorityCheckSuiteConclusion(checkSuites)
      if (highestPriorityCheckSuiteConclusion === CheckSuiteConclusion.SUCCESS) {
        resolve(CheckSuiteConclusion.SUCCESS)
      } else {
        core.error('One or more check suites were unsuccessful. Below is some metadata on the check suites.')
        core.error(JSON.stringify(diagnose(checkSuites)))
        resolve(highestPriorityCheckSuiteConclusion)
      }
    } else {
      resolve(highestPriorityCheckSuiteStatus)
    }
  })
}
