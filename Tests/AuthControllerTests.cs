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
    public class AuthControllerTests
    {
        [Fact]
        public async Task Login_WithValidCredentials_ReturnsOkWithToken()
        {
            // Arrange
            var mockAuthService = new Mock<IAuthService>();
            var controller = new AuthController(mockAuthService.Object);
            var loginDto = new LoginDto { Username = "testuser", Password = "password" };
            var expectedToken = "valid.jwt.token";

            mockAuthService.Setup(s => s.LoginAsync(It.IsAny<LoginDto>()))
                .ReturnsAsync(expectedToken);

            // Act
            var result = await controller.Login(loginDto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(okResult.Value);
        }

        [Fact]
        public async Task Login_WithInvalidCredentials_ReturnsBadRequest()
        {
            // Arrange
            var mockAuthService = new Mock<IAuthService>();
            var controller = new AuthController(mockAuthService.Object);
            var loginDto = new LoginDto { Username = "testuser", Password = "wrongpassword" };

            mockAuthService.Setup(s => s.LoginAsync(It.IsAny<LoginDto>()))
                .ThrowsAsync(new Exception("Invalid username or password."));

            // Act
            var result = await controller.Login(loginDto);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.NotNull(badRequestResult.Value);
        }

        [Fact]
        public async Task Register_WithValidData_ReturnsOk()
        {
            // Arrange
            var mockAuthService = new Mock<IAuthService>();
            var controller = new AuthController(mockAuthService.Object);
            var registerDto = new RegisterDto
            {
                Username = "newuser",
                Password = "Password123!",
                Email = "newuser@example.com"
            };

            mockAuthService.Setup(s => s.RegisterAsync(It.IsAny<RegisterDto>()))
                .Returns(Task.CompletedTask);

            // Act
            var result = await controller.Register(registerDto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal("User registered successfully.", okResult.Value);
        }

        [Fact]
        public async Task Register_WithExistingUsername_ReturnsBadRequest()
        {
            // Arrange
            var mockAuthService = new Mock<IAuthService>();
            var controller = new AuthController(mockAuthService.Object);
            var registerDto = new RegisterDto
            {
                Username = "existinguser",
                Password = "Password123!",
                Email = "user@example.com"
            };

            mockAuthService.Setup(s => s.RegisterAsync(It.IsAny<RegisterDto>()))
                .ThrowsAsync(new Exception("Username already exists."));

            // Act
            var result = await controller.Register(registerDto);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.NotNull(badRequestResult.Value);
        }

        [Fact]
        public async Task Login_VerifiesAuthServiceIsCalled()
        {
            // Arrange
            var mockAuthService = new Mock<IAuthService>();
            var controller = new AuthController(mockAuthService.Object);
            var loginDto = new LoginDto { Username = "testuser", Password = "password" };

            mockAuthService.Setup(s => s.LoginAsync(It.IsAny<LoginDto>()))
                .ReturnsAsync("token");

            // Act
            await controller.Login(loginDto);

            // Assert
            mockAuthService.Verify(s => s.LoginAsync(It.IsAny<LoginDto>()), Times.Once);
        }

        [Fact]
        public async Task Register_VerifiesAuthServiceIsCalled()
        {
            // Arrange
            var mockAuthService = new Mock<IAuthService>();
            var controller = new AuthController(mockAuthService.Object);
            var registerDto = new RegisterDto
            {
                Username = "newuser",
                Password = "Password123!",
                Email = "user@example.com"
            };

            mockAuthService.Setup(s => s.RegisterAsync(It.IsAny<RegisterDto>()))
                .Returns(Task.CompletedTask);

            // Act
            await controller.Register(registerDto);

            // Assert
            mockAuthService.Verify(s => s.RegisterAsync(It.IsAny<RegisterDto>()), Times.Once);
        }
    }
}
