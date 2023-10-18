import * as core from '@actions/core'
import {getInput} from './get-input'
import {waitForCheckSuites} from './wait-for-check-suites'
import {CheckSuiteConclusion} from './github-api-interactions'

async function run(): Promise<void> {
  try {
    const {
      client,
      owner,
      repo,
      ref,
      checkSuiteID,
      waitForACheckSuite,
      intervalSeconds,
      timeoutSeconds,
      failStepIfUnsuccessful,
      appSlugFilter,
      onlyFirstCheckSuite
    } = await getInput()

    core.info(`Id of CheckSuiteID: ${checkSuiteID}`)

    const conclusion = await waitForCheckSuites({
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
    })

    core.info(`Conclusion: ${conclusion}`)

    core.setOutput('conclusion', conclusion)

    if (conclusion !== CheckSuiteConclusion.SUCCESS && failStepIfUnsuccessful) {
      core.setFailed('One or more of the check suites were unsuccessful.')
    }
    /* eslint-disable @typescript-eslint/no-explicit-any */
  } catch (error: any) {
    core.setFailed(error.message)
  }
}

run()
