const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()
async function main() {
  await p.plan.deleteMany({})
  console.log('Plans cleared')
}
main().catch(e => console.error(e.message)).finally(() => p.$disconnect())
