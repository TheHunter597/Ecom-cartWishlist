#!/bin/sh

# Run prisma generate and wait for it to finish
npx prisma generate
echo "Prisma generate completed"
npx prisma migrate dev
echo "Prisma migrate completed"
npm run start