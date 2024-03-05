const isNameValid = () => true
const isEmailValid = () => false
const isBirthdayValid = () => false

const program = async () => {
  const errors = []
  if (!isNameValid()) errors.push("Name must not be an empty string")
  if (!isEmailValid()) errors.push("Email must not be an empty string")
  if (!isBirthdayValid()) errors.push("Must be at least 16 years of age")

  if (errors.length > 0) throw errors
}

program().then(console.log, console.error)
/* Output:
[
  'Email must not be an empty string',
  'Must be at least 16 years of age'
]
*/
