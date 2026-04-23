import bcrypt from 'bcryptjs'

const value = process.argv[2]

if (value === undefined) {
  console.error('Usage: pnpm hash <string>')
  process.exit(1)
}

const hash = bcrypt.hashSync(value, 12)
console.log(hash)
