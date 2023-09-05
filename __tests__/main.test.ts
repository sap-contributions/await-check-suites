/* eslint-disable jest/no-conditional-expect */
// import {wait} from '../src/wait'
// import * as process from 'process'
// import * as cp from 'child_process'
// import * as path from 'path'
import {getOctokit} from '@actions/github'
import {CheckSuiteConclusion, waitForCheckSuites} from '../src/wait-for-check-suites'

/* eslint-disable @typescript-eslint/promise-function-async */

import fetch, {Response} from 'node-fetch'
jest.mock('node-fetch')

describe('main', () => {
  it('happy case test', async () => {
    // eslint-disable-next-line prettier/prettier
    // const response = new Response('{}', {headers: []});

    // eslint-disable-next-line prettier/prettier
    ;(fetch as jest.MockedFunction<typeof fetch>).mockReturnValue(
      new Promise<Response>(resolve => {
        const headers = new Headers()
        headers.append('content-type', 'application/json')
        resolve({
          headers,
          status: 200,
          url: 'https://api.github.com/repos/Avenel/await-check-suite-test/commits/376e38096d7f7ef69af8f4ce7128de82c12269c1/check-suites',
          json: () => {
            return {
              total_count: 1,
              check_suites: [
                {
                  id: 15681762661,
                  node_id: 'CS_kwDOKNtdoc8AAAADprS1ZQ',
                  head_branch: 'main',
                  head_sha: '376e38096d7f7ef69af8f4ce7128de82c12269c1',
                  status: 'completed',
                  conclusion: 'success',
                  url: 'https://api.github.com/repos/Avenel/await-check-suite-test/check-suites/15681762661',
                  before: '64cd19ba8ec9d77522deefb482100ad27511e8c7',
                  after: '376e38096d7f7ef69af8f4ce7128de82c12269c1',
                  pull_requests: [],
                  app: {
                    id: 15368,
                    slug: 'github-actions',
                    node_id: 'MDM6QXBwMTUzNjg=',
                    owner: {
                      login: 'github',
                      id: 9919,
                      node_id: 'MDEyOk9yZ2FuaXphdGlvbjk5MTk=',
                      avatar_url: 'https://avatars.githubusercontent.com/u/9919?v=4',
                      gravatar_id: '',
                      url: 'https://api.github.com/users/github',
                      html_url: 'https://github.com/github',
                      followers_url: 'https://api.github.com/users/github/followers',
                      following_url: 'https://api.github.com/users/github/following{/other_user}',
                      gists_url: 'https://api.github.com/users/github/gists{/gist_id}',
                      starred_url: 'https://api.github.com/users/github/starred{/owner}{/repo}',
                      subscriptions_url: 'https://api.github.com/users/github/subscriptions',
                      organizations_url: 'https://api.github.com/users/github/orgs',
                      repos_url: 'https://api.github.com/users/github/repos',
                      events_url: 'https://api.github.com/users/github/events{/privacy}',
                      received_events_url: 'https://api.github.com/users/github/received_events',
                      type: 'Organization',
                      site_admin: false
                    },
                    name: 'GitHub Actions',
                    description: 'Automate your workflow from idea to production',
                    external_url: 'https://help.github.com/en/actions',
                    html_url: 'https://github.com/apps/github-actions',
                    created_at: '2018-07-30T09:30:17Z',
                    updated_at: '2019-12-10T19:04:12Z',
                    permissions: {
                      actions: 'write',
                      administration: 'read',
                      checks: 'write',
                      contents: 'write',
                      deployments: 'write',
                      discussions: 'write',
                      issues: 'write',
                      merge_queues: 'write',
                      metadata: 'read',
                      packages: 'write',
                      pages: 'write',
                      pull_requests: 'write',
                      repository_hooks: 'write',
                      repository_projects: 'write',
                      security_events: 'write',
                      statuses: 'write',
                      vulnerability_alerts: 'read'
                    },
                    events: [
                      'branch_protection_rule',
                      'check_run',
                      'check_suite',
                      'create',
                      'delete',
                      'deployment',
                      'deployment_status',
                      'discussion',
                      'discussion_comment',
                      'fork',
                      'gollum',
                      'issues',
                      'issue_comment',
                      'label',
                      'merge_group',
                      'milestone',
                      'page_build',
                      'project',
                      'project_card',
                      'project_column',
                      'public',
                      'pull_request',
                      'pull_request_review',
                      'pull_request_review_comment',
                      'push',
                      'registry_package',
                      'release',
                      'repository',
                      'repository_dispatch',
                      'status',
                      'watch',
                      'workflow_dispatch',
                      'workflow_run'
                    ]
                  },
                  created_at: '2023-08-31T09:47:00Z',
                  updated_at: '2023-08-31T09:52:23Z',
                  rerequestable: true,
                  runs_rerequestable: false,
                  latest_check_runs_count: 1,
                  check_runs_url:
                    'https://api.github.com/repos/Avenel/await-check-suite-test/check-suites/15681762661/check-runs',
                  head_commit: {
                    id: '376e38096d7f7ef69af8f4ce7128de82c12269c1',
                    tree_id: 'd654312863d721750356fc184742d719628b6548',
                    message: 'Update blank.yml',
                    timestamp: '2023-08-31T09:40:58Z',
                    author: {
                      name: 'Martin',
                      email: 'martin.briewig@googlemail.com'
                    },
                    committer: {
                      name: 'GitHub',
                      email: 'noreply@github.com'
                    }
                  },
                  repository: {
                    id: 685464993,
                    node_id: 'R_kgDOKNtdoQ',
                    name: 'await-check-suite-test',
                    full_name: 'Avenel/await-check-suite-test',
                    private: false,
                    owner: {
                      login: 'Avenel',
                      id: 467119,
                      node_id: 'MDQ6VXNlcjQ2NzExOQ==',
                      avatar_url: 'https://avatars.githubusercontent.com/u/467119?v=4',
                      gravatar_id: '',
                      url: 'https://api.github.com/users/Avenel',
                      html_url: 'https://github.com/Avenel',
                      followers_url: 'https://api.github.com/users/Avenel/followers',
                      following_url: 'https://api.github.com/users/Avenel/following{/other_user}',
                      gists_url: 'https://api.github.com/users/Avenel/gists{/gist_id}',
                      starred_url: 'https://api.github.com/users/Avenel/starred{/owner}{/repo}',
                      subscriptions_url: 'https://api.github.com/users/Avenel/subscriptions',
                      organizations_url: 'https://api.github.com/users/Avenel/orgs',
                      repos_url: 'https://api.github.com/users/Avenel/repos',
                      events_url: 'https://api.github.com/users/Avenel/events{/privacy}',
                      received_events_url: 'https://api.github.com/users/Avenel/received_events',
                      type: 'User',
                      site_admin: false
                    },
                    html_url: 'https://github.com/Avenel/await-check-suite-test',
                    description: null,
                    fork: false,
                    url: 'https://api.github.com/repos/Avenel/await-check-suite-test',
                    forks_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/forks',
                    keys_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/keys{/key_id}',
                    collaborators_url:
                      'https://api.github.com/repos/Avenel/await-check-suite-test/collaborators{/collaborator}',
                    teams_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/teams',
                    hooks_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/hooks',
                    issue_events_url:
                      'https://api.github.com/repos/Avenel/await-check-suite-test/issues/events{/number}',
                    events_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/events',
                    assignees_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/assignees{/user}',
                    branches_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/branches{/branch}',
                    tags_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/tags',
                    blobs_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/git/blobs{/sha}',
                    git_tags_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/git/tags{/sha}',
                    git_refs_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/git/refs{/sha}',
                    trees_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/git/trees{/sha}',
                    statuses_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/statuses/{sha}',
                    languages_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/languages',
                    stargazers_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/stargazers',
                    contributors_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/contributors',
                    subscribers_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/subscribers',
                    subscription_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/subscription',
                    commits_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/commits{/sha}',
                    git_commits_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/git/commits{/sha}',
                    comments_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/comments{/number}',
                    issue_comment_url:
                      'https://api.github.com/repos/Avenel/await-check-suite-test/issues/comments{/number}',
                    contents_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/contents/{+path}',
                    compare_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/compare/{base}...{head}',
                    merges_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/merges',
                    archive_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/{archive_format}{/ref}',
                    downloads_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/downloads',
                    issues_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/issues{/number}',
                    pulls_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/pulls{/number}',
                    milestones_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/milestones{/number}',
                    notifications_url:
                      'https://api.github.com/repos/Avenel/await-check-suite-test/notifications{?since,all,participating}',
                    labels_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/labels{/name}',
                    releases_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/releases{/id}',
                    deployments_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/deployments'
                  }
                }
              ]
            }
          }
        } as any)
      })
    )

    const conclusion = await waitForCheckSuites({
      client: getOctokit('123'),
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
    // eslint-disable-next-line prettier/prettier
    // const response = new Response('{}', {headers: []});

    // eslint-disable-next-line prettier/prettier
    ;(fetch as jest.MockedFunction<typeof fetch>).mockReturnValue(
      new Promise<Response>(resolve => {
        const headers = new Headers()
        headers.append('content-type', 'application/json')
        resolve({
          headers,
          status: 200,
          url: 'https://api.github.com/repos/Avenel/await-check-suite-test/commits/376e38096d7f7ef69af8f4ce7128de82c12269c1/check-suites',
          json: () => {
            return {
              total_count: 1,
              check_suites: [
                {
                  id: 15681762661,
                  node_id: 'CS_kwDOKNtdoc8AAAADprS1ZQ',
                  head_branch: 'main',
                  head_sha: '376e38096d7f7ef69af8f4ce7128de82c12269c1',
                  status: 'pending',
                  conclusion: 'neutral',
                  url: 'https://api.github.com/repos/Avenel/await-check-suite-test/check-suites/15681762661',
                  before: '64cd19ba8ec9d77522deefb482100ad27511e8c7',
                  after: '376e38096d7f7ef69af8f4ce7128de82c12269c1',
                  pull_requests: [],
                  app: {
                    id: 15368,
                    slug: 'github-actions',
                    node_id: 'MDM6QXBwMTUzNjg=',
                    owner: {
                      login: 'github',
                      id: 9919,
                      node_id: 'MDEyOk9yZ2FuaXphdGlvbjk5MTk=',
                      avatar_url: 'https://avatars.githubusercontent.com/u/9919?v=4',
                      gravatar_id: '',
                      url: 'https://api.github.com/users/github',
                      html_url: 'https://github.com/github',
                      followers_url: 'https://api.github.com/users/github/followers',
                      following_url: 'https://api.github.com/users/github/following{/other_user}',
                      gists_url: 'https://api.github.com/users/github/gists{/gist_id}',
                      starred_url: 'https://api.github.com/users/github/starred{/owner}{/repo}',
                      subscriptions_url: 'https://api.github.com/users/github/subscriptions',
                      organizations_url: 'https://api.github.com/users/github/orgs',
                      repos_url: 'https://api.github.com/users/github/repos',
                      events_url: 'https://api.github.com/users/github/events{/privacy}',
                      received_events_url: 'https://api.github.com/users/github/received_events',
                      type: 'Organization',
                      site_admin: false
                    },
                    name: 'GitHub Actions',
                    description: 'Automate your workflow from idea to production',
                    external_url: 'https://help.github.com/en/actions',
                    html_url: 'https://github.com/apps/github-actions',
                    created_at: '2018-07-30T09:30:17Z',
                    updated_at: '2019-12-10T19:04:12Z',
                    permissions: {
                      actions: 'write',
                      administration: 'read',
                      checks: 'write',
                      contents: 'write',
                      deployments: 'write',
                      discussions: 'write',
                      issues: 'write',
                      merge_queues: 'write',
                      metadata: 'read',
                      packages: 'write',
                      pages: 'write',
                      pull_requests: 'write',
                      repository_hooks: 'write',
                      repository_projects: 'write',
                      security_events: 'write',
                      statuses: 'write',
                      vulnerability_alerts: 'read'
                    },
                    events: [
                      'branch_protection_rule',
                      'check_run',
                      'check_suite',
                      'create',
                      'delete',
                      'deployment',
                      'deployment_status',
                      'discussion',
                      'discussion_comment',
                      'fork',
                      'gollum',
                      'issues',
                      'issue_comment',
                      'label',
                      'merge_group',
                      'milestone',
                      'page_build',
                      'project',
                      'project_card',
                      'project_column',
                      'public',
                      'pull_request',
                      'pull_request_review',
                      'pull_request_review_comment',
                      'push',
                      'registry_package',
                      'release',
                      'repository',
                      'repository_dispatch',
                      'status',
                      'watch',
                      'workflow_dispatch',
                      'workflow_run'
                    ]
                  },
                  created_at: '2023-08-31T09:47:00Z',
                  updated_at: '2023-08-31T09:52:23Z',
                  rerequestable: true,
                  runs_rerequestable: false,
                  latest_check_runs_count: 1,
                  check_runs_url:
                    'https://api.github.com/repos/Avenel/await-check-suite-test/check-suites/15681762661/check-runs',
                  head_commit: {
                    id: '376e38096d7f7ef69af8f4ce7128de82c12269c1',
                    tree_id: 'd654312863d721750356fc184742d719628b6548',
                    message: 'Update blank.yml',
                    timestamp: '2023-08-31T09:40:58Z',
                    author: {
                      name: 'Martin',
                      email: 'martin.briewig@googlemail.com'
                    },
                    committer: {
                      name: 'GitHub',
                      email: 'noreply@github.com'
                    }
                  },
                  repository: {
                    id: 685464993,
                    node_id: 'R_kgDOKNtdoQ',
                    name: 'await-check-suite-test',
                    full_name: 'Avenel/await-check-suite-test',
                    private: false,
                    owner: {
                      login: 'Avenel',
                      id: 467119,
                      node_id: 'MDQ6VXNlcjQ2NzExOQ==',
                      avatar_url: 'https://avatars.githubusercontent.com/u/467119?v=4',
                      gravatar_id: '',
                      url: 'https://api.github.com/users/Avenel',
                      html_url: 'https://github.com/Avenel',
                      followers_url: 'https://api.github.com/users/Avenel/followers',
                      following_url: 'https://api.github.com/users/Avenel/following{/other_user}',
                      gists_url: 'https://api.github.com/users/Avenel/gists{/gist_id}',
                      starred_url: 'https://api.github.com/users/Avenel/starred{/owner}{/repo}',
                      subscriptions_url: 'https://api.github.com/users/Avenel/subscriptions',
                      organizations_url: 'https://api.github.com/users/Avenel/orgs',
                      repos_url: 'https://api.github.com/users/Avenel/repos',
                      events_url: 'https://api.github.com/users/Avenel/events{/privacy}',
                      received_events_url: 'https://api.github.com/users/Avenel/received_events',
                      type: 'User',
                      site_admin: false
                    },
                    html_url: 'https://github.com/Avenel/await-check-suite-test',
                    description: null,
                    fork: false,
                    url: 'https://api.github.com/repos/Avenel/await-check-suite-test',
                    forks_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/forks',
                    keys_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/keys{/key_id}',
                    collaborators_url:
                      'https://api.github.com/repos/Avenel/await-check-suite-test/collaborators{/collaborator}',
                    teams_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/teams',
                    hooks_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/hooks',
                    issue_events_url:
                      'https://api.github.com/repos/Avenel/await-check-suite-test/issues/events{/number}',
                    events_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/events',
                    assignees_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/assignees{/user}',
                    branches_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/branches{/branch}',
                    tags_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/tags',
                    blobs_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/git/blobs{/sha}',
                    git_tags_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/git/tags{/sha}',
                    git_refs_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/git/refs{/sha}',
                    trees_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/git/trees{/sha}',
                    statuses_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/statuses/{sha}',
                    languages_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/languages',
                    stargazers_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/stargazers',
                    contributors_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/contributors',
                    subscribers_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/subscribers',
                    subscription_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/subscription',
                    commits_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/commits{/sha}',
                    git_commits_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/git/commits{/sha}',
                    comments_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/comments{/number}',
                    issue_comment_url:
                      'https://api.github.com/repos/Avenel/await-check-suite-test/issues/comments{/number}',
                    contents_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/contents/{+path}',
                    compare_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/compare/{base}...{head}',
                    merges_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/merges',
                    archive_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/{archive_format}{/ref}',
                    downloads_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/downloads',
                    issues_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/issues{/number}',
                    pulls_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/pulls{/number}',
                    milestones_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/milestones{/number}',
                    notifications_url:
                      'https://api.github.com/repos/Avenel/await-check-suite-test/notifications{?since,all,participating}',
                    labels_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/labels{/name}',
                    releases_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/releases{/id}',
                    deployments_url: 'https://api.github.com/repos/Avenel/await-check-suite-test/deployments'
                  }
                }
              ]
            }
          }
        } as any)
      })
    )

    expect.assertions(1)
    try {
      await waitForCheckSuites({
        client: getOctokit('123'),
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
