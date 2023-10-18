import {CheckSuite, CheckSuiteConclusion, CheckSuiteStatus} from './github-api-interactions'

export function getHighestPriorityCheckSuiteStatus(checkSuites: CheckSuite[]): CheckSuiteStatus {
  return checkSuites
    .map(checkSuite => checkSuite.status)
    .reduce((previous, current) => {
      for (const status of Object.keys(CheckSuiteStatus)) {
        if (previous === status) {
          return previous
        } else if (current === status) {
          return current
        }
      }
      return current
    }, CheckSuiteStatus.COMPLETED)
}

export function getHighestPriorityCheckSuiteConclusion(checkSuites: CheckSuite[]): CheckSuiteConclusion {
  return (
    checkSuites
      .map(checkSuite => checkSuite.conclusion)
      .reduce((previous, current) => {
        for (const conclusion of Object.keys(CheckSuiteConclusion)) {
          if (previous === conclusion) {
            return previous
          } else if (current === conclusion) {
            return current
          }
        }
        return current
      }, CheckSuiteConclusion.SUCCESS) ?? CheckSuiteConclusion.SUCCESS
  )
}

export function diagnose(checkSuites: CheckSuite[]): CheckSuite[] {
  return checkSuites
}
