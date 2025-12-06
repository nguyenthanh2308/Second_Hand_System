using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Second_hand_System.Data;
using Second_hand_System.DTOs;
using Second_hand_System.Entities;

namespace Second_hand_System.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly ITokenService _tokenService;

        public AuthService(AppDbContext context, ITokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        public async Task<string> LoginAsync(LoginDto loginDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == loginDto.Username);
            if (user == null || user.PasswordHash != HashPassword(loginDto.Password))
            {
                throw new UnauthorizedAccessException("Invalid username or password.");
            }

            return _tokenService.GenerateToken(user);
        }

        public async Task RegisterAsync(RegisterDto registerDto)
        {
            if (await _context.Users.AnyAsync(u => u.Username == registerDto.Username))
            {
                throw new BadHttpRequestException("Username already exists.");
            }

            var user = new User
            {
                Username = registerDto.Username,
                PasswordHash = HashPassword(registerDto.Password),
                Email = registerDto.Email,
                Address = registerDto.Address,
                Role = UserRole.Customer // Default role
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }
    }
}
