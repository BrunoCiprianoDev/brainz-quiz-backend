import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const superAdmin = await prisma.user.upsert({
    where: { email: 'superAdmin@email.com' },
    update: {},
    create: {
      email: 'superAdmin@email.com',
      password: '$2a$08$myLrYujfVwSTYTPSXh.feeDNTUBmHacb12g/L9589V/rUaPZdz0zm', //-> p@ssw0rd
      role: 'ADMIN'
    }
  })
  console.warn(`SEED CREATED: 
  \n email: ${superAdmin.email}
  \n password: p@ssw0rd ()
  \n role: ${superAdmin.role}
  \n \x1b[33m⚠ Warning: Please update the password after system deployment. This password should only be used for the first time access
  `
  );
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })