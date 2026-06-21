-- CreateTable
CREATE TABLE "Notebook" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "brand" TEXT NOT NULL,
    "lineName" TEXT,
    "fullModel" TEXT NOT NULL,
    "manufactureYear" INTEGER NOT NULL,
    "conditionGrade" TEXT NOT NULL,
    "functionalityPercent" INTEGER NOT NULL,
    "conditionDescription" TEXT,
    "batteryDesignMWh" INTEGER,
    "batteryCurrentMWh" INTEGER,
    "autonomyMinHours" REAL,
    "autonomyMaxHours" REAL,
    "autonomyNote" TEXT,
    "osName" TEXT,
    "osLicense" TEXT,
    "coverageMonths" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "categoryId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Processor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "brand" TEXT,
    "model" TEXT NOT NULL,
    "cores" INTEGER,
    "threads" INTEGER,
    "baseClockGhz" REAL,
    "maxClockGhz" REAL,
    "notebookId" TEXT NOT NULL,
    CONSTRAINT "Processor_notebookId_fkey" FOREIGN KEY ("notebookId") REFERENCES "Notebook" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RamSummary" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "totalGb" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "currentFrequencyMhz" INTEGER,
    "maxCapacityGb" INTEGER,
    "notebookId" TEXT NOT NULL,
    CONSTRAINT "RamSummary_notebookId_fkey" FOREIGN KEY ("notebookId") REFERENCES "Notebook" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RamModule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slotLabel" TEXT NOT NULL,
    "capacityGb" INTEGER,
    "isEmpty" BOOLEAN NOT NULL DEFAULT false,
    "notebookId" TEXT NOT NULL,
    CONSTRAINT "RamModule_notebookId_fkey" FOREIGN KEY ("notebookId") REFERENCES "Notebook" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StorageDevice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slotLabel" TEXT NOT NULL,
    "type" TEXT,
    "capacityGb" INTEGER,
    "isEmpty" BOOLEAN NOT NULL DEFAULT false,
    "notebookId" TEXT NOT NULL,
    CONSTRAINT "StorageDevice_notebookId_fkey" FOREIGN KEY ("notebookId") REFERENCES "Notebook" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GraphicsCard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "model" TEXT NOT NULL,
    "vramGb" INTEGER,
    "isDedicated" BOOLEAN NOT NULL DEFAULT true,
    "notebookId" TEXT NOT NULL,
    CONSTRAINT "GraphicsCard_notebookId_fkey" FOREIGN KEY ("notebookId") REFERENCES "Notebook" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Display" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sizeInches" REAL NOT NULL,
    "resolutionWidth" INTEGER NOT NULL,
    "resolutionHeight" INTEGER NOT NULL,
    "panelType" TEXT,
    "refreshRateHz" INTEGER,
    "antiGlare" BOOLEAN NOT NULL DEFAULT false,
    "notebookId" TEXT NOT NULL,
    CONSTRAINT "Display_notebookId_fkey" FOREIGN KEY ("notebookId") REFERENCES "Notebook" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Connectivity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "wifiStandard" TEXT,
    "wifiBandGhz" TEXT,
    "webcamResolution" TEXT,
    "notebookId" TEXT NOT NULL,
    CONSTRAINT "Connectivity_notebookId_fkey" FOREIGN KEY ("notebookId") REFERENCES "Notebook" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Port" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "notebookId" TEXT NOT NULL,
    CONSTRAINT "Port_notebookId_fkey" FOREIGN KEY ("notebookId") REFERENCES "Notebook" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Extra" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "notebookId" TEXT NOT NULL,
    CONSTRAINT "Extra_notebookId_fkey" FOREIGN KEY ("notebookId") REFERENCES "Notebook" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Processor_notebookId_key" ON "Processor"("notebookId");

-- CreateIndex
CREATE UNIQUE INDEX "RamSummary_notebookId_key" ON "RamSummary"("notebookId");

-- CreateIndex
CREATE UNIQUE INDEX "GraphicsCard_notebookId_key" ON "GraphicsCard"("notebookId");

-- CreateIndex
CREATE UNIQUE INDEX "Display_notebookId_key" ON "Display"("notebookId");

-- CreateIndex
CREATE UNIQUE INDEX "Connectivity_notebookId_key" ON "Connectivity"("notebookId");
