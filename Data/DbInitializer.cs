using System.Security.Cryptography;
using System.Text;
using Second_hand_System.Entities;

namespace Second_hand_System.Data
{
    public static class DbInitializer
    {
        public static void Seed(AppDbContext context)
        {
            // Ensure database is created
            context.Database.EnsureCreated();

            // Check if users already exist
            if (context.Users.Any())
            {
                return; // DB has been seeded
            }

            // 1. Seed Users
            var admin = new User
            {
                Username = "admin",
                PasswordHash = HashPassword("Admin@123"),
                Email = "admin@example.com",
                Address = "Admin HQ",
                Role = UserRole.Admin
            };

            var customer = new User
            {
                Username = "customer",
                PasswordHash = HashPassword("Customer@123"),
                Email = "customer@example.com",
                Address = "123 Main St",
                Role = UserRole.Customer
            };

            context.Users.AddRange(admin, customer);
            context.SaveChanges();

            // 2. Seed Categories
            var cat1 = new Category { Name = "Áo thun", Description = "Các loại áo thun nam nữ" };
            var cat2 = new Category { Name = "Quần Jean", Description = "Quần Jean thời trang" };

            context.Categories.AddRange(cat1, cat2);
            context.SaveChanges();

            // 3. Seed Products
            var products = new List<Product>
            {
                new Product
                {
                    Name = "Áo thun trắng Basic",
                    Price = 50000,
                    OriginalPrice = 120000,
                    Condition = "95%",
                    Description = "Áo ít mặc, còn trắng tinh.",
                    Status = ProductStatus.Available,
                    CreatedDate = DateTime.UtcNow,
                    CategoryId = cat1.Id
                },
                new Product
                {
                    Name = "Áo thun đen Graphic",
                    Price = 75000,
                    OriginalPrice = 180000,
                    Condition = "90%",
                    Description = "Hình in còn đẹp, không bong tróc.",
                    Status = ProductStatus.Available,
                    CreatedDate = DateTime.UtcNow,
                    CategoryId = cat1.Id
                },
                new Product
                {
                    Name = "Quần Jean Levi's cũ",
                    Price = 250000,
                    OriginalPrice = 1200000,
                    Condition = "85%",
                    Description = "Hàng chính hãng, size 32.",
                    Status = ProductStatus.Available,
                    CreatedDate = DateTime.UtcNow,
                    CategoryId = cat2.Id
                },
                new Product
                {
                    Name = "Áo thun Polo (Đã bán)",
                    Price = 60000,
                    OriginalPrice = 150000,
                    Condition = "98%",
                    Description = "Mới mặc 1 lần.",
                    Status = ProductStatus.Sold,
                    CreatedDate = DateTime.UtcNow.AddDays(-5),
                    CategoryId = cat1.Id
                },
                new Product
                {
                    Name = "Quần Short Jean",
                    Price = 80000,
                    OriginalPrice = 200000,
                    Condition = "90%",
                    Description = "Thích hợp đi biển.",
                    Status = ProductStatus.Available,
                    CreatedDate = DateTime.UtcNow,
                    CategoryId = cat2.Id
                }
            };

            context.Products.AddRange(products);
            context.SaveChanges();
        }

        private static string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }
    }
}
