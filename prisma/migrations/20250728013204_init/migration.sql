-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rating" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "url" TEXT,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
