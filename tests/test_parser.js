// Parser is likely enough to break to be worth testing
const parser = require("../action/parser.js")

const deviceCreate = `
### Device OS

Other

### Device Type

Other

### IMEI/Serial Number

0000

### Manufacturer

test

### Model

test

### Passcode/Pin Code

0000

### Unlocked/Rooted

- [X] Unlocked
- [ ] Rooted

### Any additional comments?

test
`

deviceCheckout = `
### Device ID

test

### Return Date

_No response_
`

console.log(parser.tokenize(deviceCreate))
console.log(parser.tokenize(deviceCheckout))