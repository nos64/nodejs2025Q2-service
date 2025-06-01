-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "version" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artists" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "grammy" BOOLEAN NOT NULL,

    CONSTRAINT "artists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tracks" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "artistId" TEXT,
    "albumId" TEXT,

    CONSTRAINT "tracks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "albums" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "artistId" TEXT,

    CONSTRAINT "albums_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fav-albums" (
    "id" SERIAL NOT NULL,
    "albumId" TEXT NOT NULL,

    CONSTRAINT "fav-albums_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fav-artists" (
    "id" SERIAL NOT NULL,
    "artistId" TEXT NOT NULL,

    CONSTRAINT "fav-artists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fav-tracks" (
    "id" SERIAL NOT NULL,
    "trackId" TEXT NOT NULL,

    CONSTRAINT "fav-tracks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_login_key" ON "users"("login");

-- CreateIndex
CREATE UNIQUE INDEX "fav-albums_albumId_key" ON "fav-albums"("albumId");

-- CreateIndex
CREATE UNIQUE INDEX "fav-artists_artistId_key" ON "fav-artists"("artistId");

-- CreateIndex
CREATE UNIQUE INDEX "fav-tracks_trackId_key" ON "fav-tracks"("trackId");

-- AddForeignKey
ALTER TABLE "tracks" ADD CONSTRAINT "tracks_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tracks" ADD CONSTRAINT "tracks_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "albums"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "albums" ADD CONSTRAINT "albums_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fav-albums" ADD CONSTRAINT "fav-albums_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "albums"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fav-artists" ADD CONSTRAINT "fav-artists_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fav-tracks" ADD CONSTRAINT "fav-tracks_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "tracks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
