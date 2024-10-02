-- DropForeignKey
ALTER TABLE "project" DROP CONSTRAINT "project_userId_fkey";

-- DropForeignKey
ALTER TABLE "todo" DROP CONSTRAINT "todo_projectId_fkey";

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "todo" ADD CONSTRAINT "todo_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
