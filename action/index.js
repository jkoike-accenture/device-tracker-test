const gh = require("@actions/github");
const core = require("@actions/core")
const token = core.getInput("auth_token", {required: true});
const octokit = gh.getOctokit(token)
const api = octokit.rest;

const context = gh.context.payload;

const issue = api.issues.get({
    ...context.issue
});

console.log(`Issue: ${JSON.stringify(issue)}`)