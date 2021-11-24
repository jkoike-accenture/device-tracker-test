const g = require("@actions/github");
const gh = {
    core: require("@actions/core"),
    api: g.getOctokit(g.context.github.token).rest
};

const context = g.context;

const issue = gh.api.issues.get({
    owner: context.payload.repository.owner.login,
    repo: context.payload.repository.name,
    issue_number: context.payload.issue.number
});

console.log(`Issue: ${JSON.stringify(issue)}`)