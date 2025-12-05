using Xunit;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Moq;
using System.Security.Claims;
using Second_hand_System.Controllers;
using Second_hand_System.DTOs;
using Second_hand_System.Entities;
using Second_hand_System.Services;

namespace Second_hand_System.Tests
{
    public class OrderControllerTests
    {
        private ClaimsPrincipal CreateUserWithClaim(int userId)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, userId.ToString())
            };
            var identity = new ClaimsIdentity(claims, "TestAuth");
            return new ClaimsPrincipal(identity);
        }

        [Fact]
        public async Task Checkout_WithValidOrder_ReturnsOk()
        {
            // Arrange
            var mockOrderService = new Mock<IOrderService>();
            var controller = new OrderController(mockOrderService.Object);
            
            var createOrderDto = new CreateOrderDto
            {
                UserId = 1,
                ShippingAddress = "123 Main St",
                ProductIds = new List<int> { 1 }
            };

            var expectedOrder = new Order
            {
                Id = 1,
                UserId = 1,
                OrderDate = DateTime.UtcNow,
                Status = OrderStatus.Pending,
                ShippingAddress = "123 Main St",
                TotalAmount = 500
            };

            mockOrderService.Setup(s => s.CheckoutAsync(It.IsAny<CreateOrderDto>()))
                .ReturnsAsync(expectedOrder);

            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = CreateUserWithClaim(1) }
            };

            // Act
            var result = await controller.Checkout(createOrderDto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(expectedOrder, okResult.Value);
        }

        [Fact]
        public async Task Checkout_WithMismatchedUserId_ReturnsBadRequest()
        {
            // Arrange
            var mockOrderService = new Mock<IOrderService>();
            var controller = new OrderController(mockOrderService.Object);
            
            var createOrderDto = new CreateOrderDto
            {
                UserId = 2, // Different from authenticated user
                ShippingAddress = "123 Main St",
                ProductIds = new List<int> { 1 }
            };

            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = CreateUserWithClaim(1) }
            };

            // Act
            var result = await controller.Checkout(createOrderDto);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("User ID mismatch.", badRequestResult.Value);
        }

        [Fact]
        public async Task Checkout_WithoutUserIdClaim_ReturnsUnauthorized()
        {
            // Arrange
            var mockOrderService = new Mock<IOrderService>();
            var controller = new OrderController(mockOrderService.Object);
            
            var createOrderDto = new CreateOrderDto
            {
                UserId = 1,
                ShippingAddress = "123 Main St",
                ProductIds = new List<int> { 1 }
            };

            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = new ClaimsPrincipal() }
            };

            // Act
            var result = await controller.Checkout(createOrderDto);

            // Assert
            Assert.IsType<UnauthorizedResult>(result);
        }

        [Fact]
        public async Task Checkout_WithServiceException_ReturnsBadRequest()
        {
            // Arrange
            var mockOrderService = new Mock<IOrderService>();
            var controller = new OrderController(mockOrderService.Object);
            
            var createOrderDto = new CreateOrderDto
            {
                UserId = 1,
                ShippingAddress = "123 Main St",
                ProductIds = new List<int> { 999 }
            };

            mockOrderService.Setup(s => s.CheckoutAsync(It.IsAny<CreateOrderDto>()))
                .ThrowsAsync(new Exception("Product not found"));

            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = CreateUserWithClaim(1) }
            };

            // Act
            var result = await controller.Checkout(createOrderDto);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.NotNull(badRequestResult.Value);
        }

        [Fact]
        public async Task GetMyOrders_WithValidUser_ReturnsOk()
        {
            // Arrange
            var mockOrderService = new Mock<IOrderService>();
            var controller = new OrderController(mockOrderService.Object);

            var expectedOrders = new List<Order>
            {
                new Order { Id = 1, UserId = 1, OrderDate = DateTime.UtcNow, Status = OrderStatus.Pending, ShippingAddress = "123 Main" }
            };

            mockOrderService.Setup(s => s.GetMyOrdersAsync(1))
                .ReturnsAsync(expectedOrders);

            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = CreateUserWithClaim(1) }
            };

            // Act
            var result = await controller.GetMyOrders();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(okResult.Value);
        }

        [Fact]
        public async Task GetMyOrders_WithoutUserIdClaim_ReturnsUnauthorized()
        {
            // Arrange
            var mockOrderService = new Mock<IOrderService>();
            var controller = new OrderController(mockOrderService.Object);

            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = new ClaimsPrincipal() }
            };

            // Act
            var result = await controller.GetMyOrders();

            // Assert
            Assert.IsType<UnauthorizedResult>(result);
        }

        [Fact]
        public async Task Checkout_VerifiesOrderServiceIsCalled()
        {
            // Arrange
            var mockOrderService = new Mock<IOrderService>();
            var controller = new OrderController(mockOrderService.Object);
            
            var createOrderDto = new CreateOrderDto
            {
                UserId = 1,
                ShippingAddress = "123 Main St",
                ProductIds = new List<int> { 1 }
            };

            var expectedOrder = new Order
            {
                Id = 1,
                UserId = 1,
                OrderDate = DateTime.UtcNow,
                Status = OrderStatus.Pending,
                ShippingAddress = "123 Main St"
            };

            mockOrderService.Setup(s => s.CheckoutAsync(It.IsAny<CreateOrderDto>()))
                .ReturnsAsync(expectedOrder);

            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = CreateUserWithClaim(1) }
            };

            // Act
            await controller.Checkout(createOrderDto);

            // Assert
            mockOrderService.Verify(s => s.CheckoutAsync(It.IsAny<CreateOrderDto>()), Times.Once);
        }

        [Fact]
        public async Task GetMyOrders_VerifiesOrderServiceIsCalled()
        {
            // Arrange
            var mockOrderService = new Mock<IOrderService>();
            var controller = new OrderController(mockOrderService.Object);

            mockOrderService.Setup(s => s.GetMyOrdersAsync(It.IsAny<int>()))
                .ReturnsAsync(new List<Order>());

            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = CreateUserWithClaim(1) }
            };

            // Act
            await controller.GetMyOrders();

            // Assert
            mockOrderService.Verify(s => s.GetMyOrdersAsync(It.IsAny<int>()), Times.Once);
        }
    }
}
