#!/bin/sh

echo "Waiting for database to be ready..."
sleep 5

echo "Running Prisma migrations..."
npx prisma migrate deploy

echo "Starting application..."
exec tsx src/app.ts
