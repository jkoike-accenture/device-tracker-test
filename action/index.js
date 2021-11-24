const gh = {
    core: require("@actions/core"),
    api: require("@actions/github")
};

const issue = gh.api.context.payload

console.log(`Action payload: ${issue}`)