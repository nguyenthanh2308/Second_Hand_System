using Xunit;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Moq;
using Second_hand_System.Controllers;
using Second_hand_System.DTOs;
using Second_hand_System.Entities;
using Second_hand_System.Services;
using Second_hand_System.Repositories;

namespace Second_hand_System.Tests
{
    public class ProductControllerTests
    {
        [Fact]
        public async Task GetProducts_ReturnsOkWithProducts()
        {
            // Arrange
            var mockProductService = new Mock<IProductService>();
            var mockRepository = new Mock<IRepository<Product>>();
            var mockFileStorageService = new Mock<IFileStorageService>();

            var controller = new ProductController(mockProductService.Object, mockRepository.Object, mockFileStorageService.Object);
            
            var products = new List<Product>
            {
                new Product { Id = 1, Name = "Laptop", Price = 500, Status = ProductStatus.Available },
                new Product { Id = 2, Name = "Phone", Price = 200, Status = ProductStatus.Available }
            };

            mockProductService.Setup(s => s.GetProductsAsync(It.IsAny<ProductFilterDto>()))
                .ReturnsAsync(products);

            // Act
            var result = await controller.GetProducts(new ProductFilterDto());

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(okResult.Value);
        }

        [Fact]
        public async Task GetProducts_WithFilter_ReturnsFilteredProducts()
        {
            // Arrange
            var mockProductService = new Mock<IProductService>();
            var mockRepository = new Mock<IRepository<Product>>();
            var mockFileStorageService = new Mock<IFileStorageService>();

            var controller = new ProductController(mockProductService.Object, mockRepository.Object, mockFileStorageService.Object);
            
            var filteredProducts = new List<Product>
            {
                new Product { Id = 1, Name = "Laptop", Price = 500, Status = ProductStatus.Available }
            };

            mockProductService.Setup(s => s.GetProductsAsync(It.IsAny<ProductFilterDto>()))
                .ReturnsAsync(filteredProducts);

            var filter = new ProductFilterDto { MinPrice = 400 };

            // Act
            var result = await controller.GetProducts(filter);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(okResult.Value);
        }

        [Fact]
        public async Task CreateProduct_WithValidData_ReturnsOk()
        {
            // Arrange
            var mockProductService = new Mock<IProductService>();
            var mockRepository = new Mock<IRepository<Product>>();
            var mockFileStorageService = new Mock<IFileStorageService>();

            var controller = new ProductController(mockProductService.Object, mockRepository.Object, mockFileStorageService.Object);
            
            var mockFile = new Mock<IFormFile>();
            mockFile.Setup(f => f.FileName).Returns("test.jpg");
            mockFile.Setup(f => f.Length).Returns(1000);

            var createProductDto = new CreateProductDto
            {
                Name = "New Laptop",
                Price = 600,
                OriginalPrice = 900,
                Condition = "Like New",
                Description = "Great condition",
                CategoryId = 1,
                ImageFile = mockFile.Object
            };

            mockFileStorageService.Setup(s => s.SaveFileAsync(It.IsAny<IFormFile>(), "products"))
                .ReturnsAsync("products/test.jpg");

            mockRepository.Setup(r => r.AddAsync(It.IsAny<Product>()))
                .Returns(Task.CompletedTask);

            mockRepository.Setup(r => r.SaveChangesAsync())
                .Returns(Task.CompletedTask);

            // Add authorization context
            var claims = new System.Security.Claims.Claim[] { };
            var identity = new System.Security.Claims.ClaimsIdentity(claims, "TestAuth");
            identity.AddClaim(new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Role, "Admin"));
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = new System.Security.Claims.ClaimsPrincipal(identity) }
            };

            // Act
            var result = await controller.CreateProduct(createProductDto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(okResult.Value);
        }

        [Fact]
        public async Task CreateProduct_WithoutImage_ReturnsOk()
        {
            // Arrange
            var mockProductService = new Mock<IProductService>();
            var mockRepository = new Mock<IRepository<Product>>();
            var mockFileStorageService = new Mock<IFileStorageService>();

            var controller = new ProductController(mockProductService.Object, mockRepository.Object, mockFileStorageService.Object);
            
            var createProductDto = new CreateProductDto
            {
                Name = "New Laptop",
                Price = 600,
                OriginalPrice = 900,
                Condition = "Like New",
                Description = "Great condition",
                CategoryId = 1,
                ImageFile = null
            };

            mockRepository.Setup(r => r.AddAsync(It.IsAny<Product>()))
                .Returns(Task.CompletedTask);

            mockRepository.Setup(r => r.SaveChangesAsync())
                .Returns(Task.CompletedTask);

            // Add authorization context
            var claims = new System.Security.Claims.Claim[] { };
            var identity = new System.Security.Claims.ClaimsIdentity(claims, "TestAuth");
            identity.AddClaim(new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Role, "Admin"));
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = new System.Security.Claims.ClaimsPrincipal(identity) }
            };

            // Act
            var result = await controller.CreateProduct(createProductDto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(okResult.Value);
        }

        [Fact]
        public async Task CreateProduct_SavesProductWithCorrectStatus()
        {
            // Arrange
            var mockProductService = new Mock<IProductService>();
            var mockRepository = new Mock<IRepository<Product>>();
            var mockFileStorageService = new Mock<IFileStorageService>();

            var controller = new ProductController(mockProductService.Object, mockRepository.Object, mockFileStorageService.Object);
            
            var createProductDto = new CreateProductDto
            {
                Name = "Test Product",
                Price = 100,
                OriginalPrice = 150,
                CategoryId = 1
            };

            Product? savedProduct = null;
            mockRepository.Setup(r => r.AddAsync(It.IsAny<Product>()))
                .Callback<Product>(p => savedProduct = p)
                .Returns(Task.CompletedTask);

            mockRepository.Setup(r => r.SaveChangesAsync())
                .Returns(Task.CompletedTask);

            // Add authorization context
            var claims = new System.Security.Claims.Claim[] { };
            var identity = new System.Security.Claims.ClaimsIdentity(claims, "TestAuth");
            identity.AddClaim(new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Role, "Admin"));
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = new System.Security.Claims.ClaimsPrincipal(identity) }
            };

            // Act
            await controller.CreateProduct(createProductDto);

            // Assert
            Assert.NotNull(savedProduct);
            Assert.Equal(ProductStatus.Available, savedProduct.Status);
        }

        [Fact]
        public async Task GetProducts_VerifiesServiceIsCalled()
        {
            // Arrange
            var mockProductService = new Mock<IProductService>();
            var mockRepository = new Mock<IRepository<Product>>();
            var mockFileStorageService = new Mock<IFileStorageService>();

            var controller = new ProductController(mockProductService.Object, mockRepository.Object, mockFileStorageService.Object);
            
            mockProductService.Setup(s => s.GetProductsAsync(It.IsAny<ProductFilterDto>()))
                .ReturnsAsync(new List<Product>());

            var filter = new ProductFilterDto();

            // Act
            await controller.GetProducts(filter);

            // Assert
            mockProductService.Verify(s => s.GetProductsAsync(It.Is<ProductFilterDto>(f => 
                f.Keyword == filter.Keyword &&
                f.MinPrice == filter.MinPrice &&
                f.MaxPrice == filter.MaxPrice &&
                f.CategoryId == filter.CategoryId &&
                f.Condition == filter.Condition)), Times.Once);
        }
    }
}
