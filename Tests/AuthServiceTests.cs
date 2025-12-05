using System.Security.Cryptography;
using System.Text;
using Moq;
using Xunit;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Second_hand_System.Data;
using Second_hand_System.DTOs;
using Second_hand_System.Entities;
using Second_hand_System.Services;

namespace Second_hand_System.Tests
{
    public class AuthServiceTests
    {
        private AppDbContext CreateInMemoryContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .ConfigureWarnings(w => w.Ignore(CoreEventId.DetachedLazyLoadingWarning, InMemoryEventId.TransactionIgnoredWarning))
                .Options;

            return new AppDbContext(options);
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }

        [Fact]
        public async Task LoginAsync_WithValidCredentials_ReturnsToken()
        {
            // Arrange
            var context = CreateInMemoryContext();
            var mockTokenService = new Mock<ITokenService>();
            var password = "TestPassword123!";
            var user = new User
            {
                Id = 1,
                Username = "testuser",
                PasswordHash = HashPassword(password),
                Email = "test@example.com",
                Role = UserRole.Customer
            };

            context.Users.Add(user);
            await context.SaveChangesAsync();

            var authService = new AuthService(context, mockTokenService.Object);
            var loginDto = new LoginDto { Username = "testuser", Password = password };
            var expectedToken = "valid.jwt.token";
            mockTokenService.Setup(x => x.GenerateToken(It.IsAny<User>())).Returns(expectedToken);

            // Act
            var token = await authService.LoginAsync(loginDto);

            // Assert
            Assert.Equal(expectedToken, token);
            mockTokenService.Verify(x => x.GenerateToken(It.Is<User>(u => u.Username == "testuser")), Times.Once);
        }

        [Fact]
        public async Task LoginAsync_WithInvalidUsername_ThrowsException()
        {
            // Arrange
            var context = CreateInMemoryContext();
            var mockTokenService = new Mock<ITokenService>();
            var authService = new AuthService(context, mockTokenService.Object);
            var loginDto = new LoginDto { Username = "nonexistent", Password = "password" };

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => authService.LoginAsync(loginDto));
        }

        [Fact]
        public async Task LoginAsync_WithInvalidPassword_ThrowsException()
        {
            // Arrange
            var context = CreateInMemoryContext();
            var mockTokenService = new Mock<ITokenService>();
            var user = new User
            {
                Id = 1,
                Username = "testuser",
                PasswordHash = HashPassword("CorrectPassword123!"),
                Email = "test@example.com",
                Role = UserRole.Customer
            };

            context.Users.Add(user);
            await context.SaveChangesAsync();

            var authService = new AuthService(context, mockTokenService.Object);
            var loginDto = new LoginDto { Username = "testuser", Password = "WrongPassword" };

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => authService.LoginAsync(loginDto));
        }

        [Fact]
        public async Task RegisterAsync_WithValidData_CreatesUserSuccessfully()
        {
            // Arrange
            var context = CreateInMemoryContext();
            var mockTokenService = new Mock<ITokenService>();
            var authService = new AuthService(context, mockTokenService.Object);
            var registerDto = new RegisterDto
            {
                Username = "newuser",
                Password = "NewPassword123!",
                Email = "newuser@example.com",
                Address = "123 Main St"
            };

            // Act
            await authService.RegisterAsync(registerDto);

            // Assert
            var user = await context.Users.FirstOrDefaultAsync(u => u.Username == "newuser");
            Assert.NotNull(user);
            Assert.Equal("newuser@example.com", user.Email);
            Assert.Equal("123 Main St", user.Address);
            Assert.Equal(UserRole.Customer, user.Role);
        }

        [Fact]
        public async Task RegisterAsync_WithExistingUsername_ThrowsException()
        {
            // Arrange
            var context = CreateInMemoryContext();
            var mockTokenService = new Mock<ITokenService>();
            var existingUser = new User
            {
                Id = 1,
                Username = "existinguser",
                PasswordHash = HashPassword("password"),
                Email = "existing@example.com",
                Role = UserRole.Customer
            };

            context.Users.Add(existingUser);
            await context.SaveChangesAsync();

            var authService = new AuthService(context, mockTokenService.Object);
            var registerDto = new RegisterDto
            {
                Username = "existinguser",
                Password = "NewPassword123!",
                Email = "different@example.com"
            };

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => authService.RegisterAsync(registerDto));
        }

        [Fact]
        public async Task RegisterAsync_WithoutAddress_CreatesUserWithoutAddress()
        {
            // Arrange
            var context = CreateInMemoryContext();
            var mockTokenService = new Mock<ITokenService>();
            var authService = new AuthService(context, mockTokenService.Object);
            var registerDto = new RegisterDto
            {
                Username = "newuser",
                Password = "Password123!",
                Email = "user@example.com",
                Address = null
            };

            // Act
            await authService.RegisterAsync(registerDto);

            // Assert
            var user = await context.Users.FirstOrDefaultAsync(u => u.Username == "newuser");
            Assert.NotNull(user);
            Assert.Null(user.Address);
        }
    }
}
