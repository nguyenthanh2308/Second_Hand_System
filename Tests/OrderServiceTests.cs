using Moq;
using Xunit;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Second_hand_System.Data;
using Second_hand_System.DTOs;
using Second_hand_System.Entities;
using Second_hand_System.Services;
using Second_hand_System.Repositories;
using Second_hand_System.Exceptions;

namespace Second_hand_System.Tests
{
    public class OrderServiceTests
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
        public async Task CheckoutAsync_WithValidProducts_CreatesOrderSuccessfully()
        {
            // Arrange
            var context = CreateInMemoryContext();
            var category = new Category { Id = 1, Name = "Electronics" };
            var product = new Product
            {
                Id = 1,
                Name = "Test Laptop",
                Price = 500,
                Status = ProductStatus.Available,
                CategoryId = 1,
                Category = category
            };

            context.Categories.Add(category);
            context.Products.Add(product);
            await context.SaveChangesAsync();

            var orderRepository = new Mock<IOrderRepository>();
            var productRepository = new Mock<IProductRepository>();

            productRepository.Setup(r => r.GetByIdAsync(1))
                .ReturnsAsync(product);

            var orderService = new OrderService(orderRepository.Object, productRepository.Object, context);

            var createOrderDto = new CreateOrderDto
            {
                UserId = 1,
                ShippingAddress = "123 Main St",
                ProductIds = new List<int> { 1 }
            };

            // Act
            var order = await orderService.CheckoutAsync(createOrderDto);

            // Assert
            Assert.NotNull(order);
            Assert.Equal(1, order.UserId);
            Assert.Equal(500, order.TotalAmount);
            Assert.Equal(OrderStatus.Pending, order.Status);
            Assert.Single(order.OrderDetails);
        }

        [Fact]
        public async Task CheckoutAsync_WithMultipleProducts_CalculatesTotalCorrectly()
        {
            // Arrange
            var context = CreateInMemoryContext();
            var category = new Category { Id = 1, Name = "Electronics" };
            var product1 = new Product
            {
                Id = 1,
                Name = "Laptop",
                Price = 500,
                Status = ProductStatus.Available,
                CategoryId = 1,
                Category = category
            };
            var product2 = new Product
            {
                Id = 2,
                Name = "Phone",
                Price = 200,
                Status = ProductStatus.Available,
                CategoryId = 1,
                Category = category
            };

            context.Categories.Add(category);
            context.Products.AddRange(product1, product2);
            await context.SaveChangesAsync();

            var orderRepository = new Mock<IOrderRepository>();
            var productRepository = new Mock<IProductRepository>();

            productRepository.Setup(r => r.GetByIdAsync(1))
                .ReturnsAsync(product1);
            productRepository.Setup(r => r.GetByIdAsync(2))
                .ReturnsAsync(product2);

            var orderService = new OrderService(orderRepository.Object, productRepository.Object, context);

            var createOrderDto = new CreateOrderDto
            {
                UserId = 1,
                ShippingAddress = "123 Main St",
                ProductIds = new List<int> { 1, 2 }
            };

            // Act
            var order = await orderService.CheckoutAsync(createOrderDto);

            // Assert
            Assert.NotNull(order);
            Assert.Equal(700, order.TotalAmount); // 500 + 200
            Assert.Equal(2, order.OrderDetails.Count);
        }

        [Fact]
        public async Task CheckoutAsync_WithNonexistentProduct_ThrowsException()
        {
            // Arrange
            var context = CreateInMemoryContext();
            var orderRepository = new Mock<IOrderRepository>();
            var productRepository = new Mock<IProductRepository>();

            productRepository.Setup(r => r.GetByIdAsync(999))
                .ReturnsAsync((Product?)null);

            var orderService = new OrderService(orderRepository.Object, productRepository.Object, context);

            var createOrderDto = new CreateOrderDto
            {
                UserId = 1,
                ShippingAddress = "123 Main St",
                ProductIds = new List<int> { 999 }
            };

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => orderService.CheckoutAsync(createOrderDto));
        }

        [Fact]
        public async Task CheckoutAsync_WithSoldProduct_ThrowsProductSoldException()
        {
            // Arrange
            var context = CreateInMemoryContext();
            var category = new Category { Id = 1, Name = "Electronics" };
            var product = new Product
            {
                Id = 1,
                Name = "Sold Laptop",
                Price = 500,
                Status = ProductStatus.Sold,
                CategoryId = 1,
                Category = category
            };

            context.Categories.Add(category);
            context.Products.Add(product);
            await context.SaveChangesAsync();

            var orderRepository = new Mock<IOrderRepository>();
            var productRepository = new Mock<IProductRepository>();

            productRepository.Setup(r => r.GetByIdAsync(1))
                .ReturnsAsync(product);

            var orderService = new OrderService(orderRepository.Object, productRepository.Object, context);

            var createOrderDto = new CreateOrderDto
            {
                UserId = 1,
                ShippingAddress = "123 Main St",
                ProductIds = new List<int> { 1 }
            };

            // Act & Assert
            await Assert.ThrowsAsync<ProductSoldException>(() => orderService.CheckoutAsync(createOrderDto));
        }

        [Fact]
        public async Task CheckoutAsync_UpdatesProductStatusToSold()
        {
            // Arrange
            var context = CreateInMemoryContext();
            var category = new Category { Id = 1, Name = "Electronics" };
            var product = new Product
            {
                Id = 1,
                Name = "Test Product",
                Price = 100,
                Status = ProductStatus.Available,
                CategoryId = 1,
                Category = category
            };

            context.Categories.Add(category);
            context.Products.Add(product);
            await context.SaveChangesAsync();

            var orderRepository = new Mock<IOrderRepository>();
            var productRepository = new Mock<IProductRepository>();

            productRepository.Setup(r => r.GetByIdAsync(1))
                .ReturnsAsync(product);

            var orderService = new OrderService(orderRepository.Object, productRepository.Object, context);

            var createOrderDto = new CreateOrderDto
            {
                UserId = 1,
                ShippingAddress = "123 Main St",
                ProductIds = new List<int> { 1 }
            };

            // Act
            var order = await orderService.CheckoutAsync(createOrderDto);

            // Assert
            var updatedProduct = await context.Products.FindAsync(1);
            Assert.Equal(ProductStatus.Sold, updatedProduct?.Status);
        }

        [Fact]
        public async Task ChangeOrderStatusAsync_UpdatesOrderStatus()
        {
            // Arrange
            var context = CreateInMemoryContext();
            var order = new Order
            {
                Id = 1,
                UserId = 1,
                OrderDate = DateTime.UtcNow,
                Status = OrderStatus.Pending,
                ShippingAddress = "123 Main St"
            };

            context.Orders.Add(order);
            await context.SaveChangesAsync();

            var orderRepository = new Mock<IOrderRepository>();
            var productRepository = new Mock<IProductRepository>();

            orderRepository.Setup(r => r.GetByIdAsync(1))
                .ReturnsAsync(order);
            orderRepository.Setup(r => r.SaveChangesAsync())
                .Returns(Task.CompletedTask);

            var orderService = new OrderService(orderRepository.Object, productRepository.Object, context);

            // Act
            await orderService.ChangeOrderStatusAsync(1, OrderStatus.Shipping);

            // Assert
            orderRepository.Verify(r => r.Update(It.Is<Order>(o => o.Status == OrderStatus.Shipping)), Times.Once);
        }

        [Fact]
        public async Task ChangeOrderStatusAsync_WithNonexistentOrder_ThrowsException()
        {
            // Arrange
            var context = CreateInMemoryContext();
            var orderRepository = new Mock<IOrderRepository>();
            var productRepository = new Mock<IProductRepository>();

            orderRepository.Setup(r => r.GetByIdAsync(999))
                .ReturnsAsync((Order?)null);

            var orderService = new OrderService(orderRepository.Object, productRepository.Object, context);

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => orderService.ChangeOrderStatusAsync(999, OrderStatus.Shipping));
        }

        [Fact]
        public async Task GetMyOrdersAsync_ReturnsOrdersForUser()
        {
            // Arrange
            var context = CreateInMemoryContext();
            var user1Orders = new List<Order>
            {
                new Order { Id = 1, UserId = 1, OrderDate = DateTime.UtcNow, Status = OrderStatus.Pending, ShippingAddress = "123 Main" },
                new Order { Id = 2, UserId = 1, OrderDate = DateTime.UtcNow, Status = OrderStatus.Completed, ShippingAddress = "123 Main" }
            };

            var orderRepository = new Mock<IOrderRepository>();
            var productRepository = new Mock<IProductRepository>();

            orderRepository.Setup(r => r.GetOrdersByUserIdAsync(1))
                .ReturnsAsync(user1Orders);

            var orderService = new OrderService(orderRepository.Object, productRepository.Object, context);

            // Act
            var orders = await orderService.GetMyOrdersAsync(1);

            // Assert
            Assert.Equal(2, orders.Count());
        }

        [Fact]
        public async Task CheckoutAsync_SnapshotsPriceAtOrderTime()
        {
            // Arrange
            var context = CreateInMemoryContext();
            var category = new Category { Id = 1, Name = "Electronics" };
            var product = new Product
            {
                Id = 1,
                Name = "Product",
                Price = 500,
                Status = ProductStatus.Available,
                CategoryId = 1,
                Category = category
            };

            context.Categories.Add(category);
            context.Products.Add(product);
            await context.SaveChangesAsync();

            var orderRepository = new Mock<IOrderRepository>();
            var productRepository = new Mock<IProductRepository>();

            productRepository.Setup(r => r.GetByIdAsync(1))
                .ReturnsAsync(product);

            var orderService = new OrderService(orderRepository.Object, productRepository.Object, context);

            var createOrderDto = new CreateOrderDto
            {
                UserId = 1,
                ShippingAddress = "123 Main St",
                ProductIds = new List<int> { 1 }
            };

            // Act
            var order = await orderService.CheckoutAsync(createOrderDto);

            // Assert
            Assert.Equal(500, order.OrderDetails.First().Price);
        }
    }
}
