const gh = require("@actions/github");
const core = require("@actions/core")
const token = core.getInput("auth_token", {required: true});
const octokit = gh.getOctokit(token)
const api = octokit.rest;

const context = gh.context.payload;
async function run() {
    const issue = await api.issues.get({
        ...context.issue,
        issue_number: context.issue.number
    });

    console.log(`Issue #${context.issue.number}: ${JSON.stringify(issue.data)}`)
};
run()