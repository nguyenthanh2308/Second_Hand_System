using Second_hand_System.Entities;

namespace Second_hand_System.Services
{
    public interface ITokenService
    {
        string GenerateToken(User user);
    }
}
