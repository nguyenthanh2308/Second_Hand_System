using Second_hand_System.DTOs;

namespace Second_hand_System.Services
{
    public interface IAuthService
    {
        Task<string> LoginAsync(LoginDto loginDto);
        Task RegisterAsync(RegisterDto registerDto);
    }
}
