-- Fix for Unique Index on OrderDetails.ProductId
-- This script properly handles foreign key constraints

-- Step 1: Drop the foreign key constraint first
ALTER TABLE OrderDetails 
DROP FOREIGN KEY FK_OrderDetails_Products_ProductId;

-- Step 2: Drop the unique index
DROP INDEX IX_OrderDetails_ProductId ON OrderDetails;

-- Step 3: Recreate as NON-UNIQUE index
CREATE INDEX IX_OrderDetails_ProductId ON OrderDetails(ProductId);

-- Step 4: Recreate the foreign key constraint
ALTER TABLE OrderDetails
ADD CONSTRAINT FK_OrderDetails_Products_ProductId
FOREIGN KEY (ProductId) REFERENCES Products(Id)
ON DELETE CASCADE;

-- Step 5: Verify the fix
SELECT 
    INDEX_NAME,
    NON_UNIQUE,
    COLUMN_NAME
FROM 
    INFORMATION_SCHEMA.STATISTICS
WHERE 
    TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'OrderDetails'
    AND INDEX_NAME = 'IX_OrderDetails_ProductId';

-- Expected result: NON_UNIQUE should be 1 (true)
