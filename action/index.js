const gh = {
    core: require("@actions/core"),
    api: require("@actions/github")
};

const issue = {
    type: gh.core.input("action", {required: true}),
    payload: gh.core.input("issue", {required: true}),
    labels: gh.core.input("labels", {required: true})
}

console.log(`Action payload: ${issue}`)