const ulidRegex = /^[0-7][0-9A-HJKMNP-TV-Z]{25}$/

const parseIds = (input: string) => {
  const ids = input.split(",")

  if (ids.length === 0) {
    throw new Error("Expected a non-empty array of ids")
  }

  const invalidIds = []
  for (const id of ids) {
    if (!ulidRegex.test(id)) {
      invalidIds.push(id)
    }
  }

  if (invalidIds.length > 0) {
    throw new Error(
      `Expected a non-empty array of ULIDs. The following ids are not ULIDs: ${invalidIds.join(", ")}`
    )
  }

  return ids
}

const program = async () => {
  const rawIds = process.env.IDX

  if (!rawIds) {
    throw new Error(`Expected IDX to exist in the process context`)
  }

  const parsedIds = parseIds(rawIds)
  parsedIds.forEach((id, index) => {
    console.log(`Input[${index}]: ${id}`)
  })
}

program().then(console.log, console.error)