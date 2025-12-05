using System.ComponentModel.DataAnnotations;

namespace Second_hand_System.Entities
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Username { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(100)]
        public string Email { get; set; } = string.Empty;

        public UserRole Role { get; set; } = UserRole.Customer;

        [MaxLength(200)]
        public string? Address { get; set; }

        // Navigation Property: 1 User - Many Orders
        public ICollection<Order> Orders { get; set; } = new List<Order>();
    }
}
