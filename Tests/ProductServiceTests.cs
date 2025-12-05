using Moq;
using Xunit;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Second_hand_System.Data;
using Second_hand_System.DTOs;
using Second_hand_System.Entities;
using Second_hand_System.Services;
using Second_hand_System.Repositories;

namespace Second_hand_System.Tests
{
    public class ProductServiceTests
    {
        private AppDbContext CreateInMemoryContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .ConfigureWarnings(w => w.Ignore(CoreEventId.DetachedLazyLoadingWarning, InMemoryEventId.TransactionIgnoredWarning))
                .Options;

            return new AppDbContext(options);
        }

        [Fact]
        public async Task GetProductsAsync_ReturnsAllAvailableProducts()
        {
            // Arrange
            var context = CreateInMemoryContext();
            var category = new Category { Id = 1, Name = "Electronics" };
            var product1 = new Product
            {
                Id = 1,
                Name = "Laptop",
                Price = 500,
                OriginalPrice = 800,
                Condition = "Like New",
                Status = ProductStatus.Available,
                CategoryId = 1,
                Category = category
            };
            var product2 = new Product
            {
                Id = 2,
                Name = "Phone",
                Price = 200,
                OriginalPrice = 400,
                Condition = "Good",
                Status = ProductStatus.Available,
                CategoryId = 1,
                Category = category
            };

            context.Categories.Add(category);
            context.Products.AddRange(product1, product2);
            await context.SaveChangesAsync();

            var mockRepository = new Mock<IProductRepository>();
            mockRepository.Setup(r => r.GetProductsAsync(null, null, null, null, null))
                .ReturnsAsync(new[] { product1, product2 });

            var productService = new ProductService(mockRepository.Object);

            // Act
            var filter = new ProductFilterDto();
            var products = await productService.GetProductsAsync(filter);

            // Assert
            Assert.NotNull(products);
            Assert.Equal(2, products.Count());
        }

        [Fact]
        public async Task GetProductsAsync_WithPriceFilter_ReturnsFilteredProducts()
        {
            // Arrange
            var context = CreateInMemoryContext();
            var category = new Category { Id = 1, Name = "Electronics" };
            var product1 = new Product
            {
                Id = 1,
                Name = "Expensive Laptop",
                Price = 500,
                Status = ProductStatus.Available,
                CategoryId = 1
            };
            var product2 = new Product
            {
                Id = 2,
                Name = "Cheap Phone",
                Price = 100,
                Status = ProductStatus.Available,
                CategoryId = 1
            };

            context.Categories.Add(category);
            context.Products.AddRange(product1, product2);
            await context.SaveChangesAsync();

            var mockRepository = new Mock<IProductRepository>();
            mockRepository.Setup(r => r.GetProductsAsync(null, 200, null, null, null))
                .ReturnsAsync(new[] { product1 });

            var productService = new ProductService(mockRepository.Object);

            // Act
            var filter = new ProductFilterDto { MinPrice = 200 };
            var products = await productService.GetProductsAsync(filter);

            // Assert
            Assert.Single(products);
            Assert.Equal("Expensive Laptop", products.First().Name);
        }

        [Fact]
        public async Task GetProductsAsync_WithKeywordFilter_ReturnsMatchingProducts()
        {
            // Arrange
            var mockRepository = new Mock<IProductRepository>();
            var expectedProducts = new[]
            {
                new Product { Id = 1, Name = "Samsung Laptop", Price = 500, Status = ProductStatus.Available }
            };

            mockRepository.Setup(r => r.GetProductsAsync("Samsung", null, null, null, null))
                .ReturnsAsync(expectedProducts);

            var productService = new ProductService(mockRepository.Object);

            // Act
            var filter = new ProductFilterDto { Keyword = "Samsung" };
            var products = await productService.GetProductsAsync(filter);

            // Assert
            Assert.Single(products);
            Assert.Equal("Samsung Laptop", products.First().Name);
        }

        [Fact]
        public async Task GetProductByIdAsync_WithValidId_ReturnsProduct()
        {
            // Arrange
            var expectedProduct = new Product
            {
                Id = 1,
                Name = "Test Product",
                Price = 100,
                Status = ProductStatus.Available
            };

            var mockRepository = new Mock<IProductRepository>();
            mockRepository.Setup(r => r.GetByIdAsync(1))
                .ReturnsAsync(expectedProduct);

            var productService = new ProductService(mockRepository.Object);

            // Act
            var product = await productService.GetProductByIdAsync(1);

            // Assert
            Assert.NotNull(product);
            Assert.Equal("Test Product", product.Name);
            Assert.Equal(100, product.Price);
        }

        [Fact]
        public async Task GetProductByIdAsync_WithInvalidId_ReturnsNull()
        {
            // Arrange
            var mockRepository = new Mock<IProductRepository>();
            mockRepository.Setup(r => r.GetByIdAsync(It.IsAny<int>()))
                .ReturnsAsync((Product?)null);

            var productService = new ProductService(mockRepository.Object);

            // Act
            var product = await productService.GetProductByIdAsync(999);

            // Assert
            Assert.Null(product);
        }

        [Fact]
        public async Task GetProductsAsync_WithCategoryFilter_ReturnsProductsFromCategory()
        {
            // Arrange
            var mockRepository = new Mock<IProductRepository>();
            var expectedProducts = new[]
            {
                new Product { Id = 1, Name = "Laptop", Price = 500, Status = ProductStatus.Available, CategoryId = 1 },
                new Product { Id = 2, Name = "Desktop", Price = 700, Status = ProductStatus.Available, CategoryId = 1 }
            };

            mockRepository.Setup(r => r.GetProductsAsync(null, null, null, 1, null))
                .ReturnsAsync(expectedProducts);

            var productService = new ProductService(mockRepository.Object);

            // Act
            var filter = new ProductFilterDto { CategoryId = 1 };
            var products = await productService.GetProductsAsync(filter);

            // Assert
            Assert.Equal(2, products.Count());
        }

        [Fact]
        public async Task GetProductsAsync_WithConditionFilter_ReturnsProductsWithCondition()
        {
            // Arrange
            var mockRepository = new Mock<IProductRepository>();
            var expectedProducts = new[]
            {
                new Product { Id = 1, Name = "Like New Phone", Price = 300, Status = ProductStatus.Available, Condition = "Like New" }
            };

            mockRepository.Setup(r => r.GetProductsAsync(null, null, null, null, "Like New"))
                .ReturnsAsync(expectedProducts);

            var productService = new ProductService(mockRepository.Object);

            // Act
            var filter = new ProductFilterDto { Condition = "Like New" };
            var products = await productService.GetProductsAsync(filter);

            // Assert
            Assert.Single(products);
            Assert.Equal("Like New Phone", products.First().Name);
        }
    }
}
