using System.ComponentModel.DataAnnotations;

namespace Second_hand_System.Entities
{
    public class Category
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        // Navigation Property: 1 Category - Many Products
        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}
