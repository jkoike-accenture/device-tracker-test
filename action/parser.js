// Hacky af MD parser. No judge pls.

const INIT   = 0;
const HEADER = 1;
const LIST   = 2;
const CHECK  = 3;

// Create a new blank state (I'm too lazy to make real Classes)
function newState() {
    return {
        state: INIT, // Current parser state
        nl: true,    // First (non-whitespace) character in the line
        queue: [],   // Stage queue for current "token" (these are larger than tokens, I know)
        val: null,   // Any additional type-specific info
        output: []   // Parsed output
    }
}

// Output a parsed "token"
function outputStage(token_type, value) {
    return {
        token_type,
        value
    }
}

function parseStep(state, token) {
    isWhitespace = /\s/.test(token) // Multiple states want to know if this token is whitespace, worth pre-computing
    if(!state.nl && token != "\n") { // If this isn't the start of a new line or the end of a line, we always want to push the token
        state.queue.push(token)
    }
    switch(state.state){
        case INIT:
            if(token == "\n") { // If this is a newline
                state.state = INIT // Reset state
                state.nl = true // At the beginning of the line
                state.val = null // Make sure we're not saving anything needless
                state.output.push(outputStage("BLOCK", state.queue.join(""))) // Push output contents
                state.queue = [] // Clear staging queue
                return state;
            }
            if(isWhitespace && state.nl) { // If token is whitespace and we're at the start of a line
                break; // Skip whitespace token
            } else if(state.nl) { // If start of the line, but not whitespace
                switch (token) {
                    case "#":
                        state.state = HEADER;
                        state.nl = true; // We're in the header tag, aka at the "start of the line"
                        state.val = 1; // Level 1 header (aka H1)
                        break;
                    case "-":
                        state.state = LIST;
                        state.nl = true; // Still trying to figure out if this is a check item or a list item
                        break;
                    default:
                        state.nl = false; // No longer at the start of the line
                        state.queue.push(token)
                }
            }
            break;
        case HEADER:
            if(token == "\n") { // If this is a newline
                state.state = INIT // Reset state
                state.nl = true // At the beginning of the line
                state.output.push(outputStage(`H${state.val}`, state.queue.join(""))) // Push output contents
                state.val = null // Make sure we're not saving anything needless
                state.queue = [] // Clear staging queue
                return state;
            }
            if(state.nl) {
                if (token == "#") {
                    state.val += 1; // Increment header val by 1
                } else if (!isWhitespace) {
                    state.queue.push(token)
                    state.nl = false; // No longer at the start of a new line
                }
            }
            break;
        case LIST:
            if(token == "\n") { // If this is a newline
                state.state = INIT // Reset state
                state.nl = true // At the beginning of the line
                state.output.push(outputStage(`LIST`, state.queue.join(""))) // Push output contents
                state.val = null // Make sure we're not saving anything needless
                state.queue = [] // Clear staging queue
                return state;
            }
            if(state.nl) {
                if(token == "[") {
                    state.state = CHECK
                    state.val = false // Begin assuming checkbox is empty
                } else if (!isWhitespace) {
                    state.queue.push(token)
                    state.nl = false // No longer at the start of the line
                }
            }
            break;
        case CHECK:
            if(token == "\n") { // If this is a newline
                state.state = INIT // Reset state
                state.nl = true // At the beginning of the line
                state.output.push(outputStage(`CHECK_${state.val}`, state.queue.join("").trim())) // Push output contents
                state.val = null // Make sure we're not saving anything needless
                state.queue = [] // Clear staging queue
                return state;
            }
            if(state.nl) {
                if(token == "]") {
                    state.nl = false
                } else if (!isWhitespace) {
                    state.val = true
                }
            }
            break;
    }
    return state
}

module.exports = {
    tokenize: (stream) => {
        var output = stream.split("").reduce(parseStep, newState())
        return output.output;
    }
}
