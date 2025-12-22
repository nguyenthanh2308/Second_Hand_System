using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Second_hand_System.Entities
{
    public class Product
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [Range(0, double.MaxValue)]
        public decimal Price { get; set; }

        [Range(0, double.MaxValue)]
        public decimal OriginalPrice { get; set; }

        [MaxLength(50)]
        public string? Condition { get; set; } // e.g., "99%", "Like New"

        public string? Description { get; set; }

        public string? ImageUrl { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        public ProductStatus Status { get; set; } = ProductStatus.Available;

        public ProductGender Gender { get; set; } = ProductGender.Unisex;

        [MaxLength(50)]
        public string? Size { get; set; } // e.g., "M", "L", "42", "Free Size"

        // Foreign Key for Category
        public int CategoryId { get; set; }

        // Navigation Properties
        [ForeignKey("CategoryId")]
        public Category? Category { get; set; }

        // 1 Product - 0..1 OrderDetail (logic: item selling only once)
        public OrderDetail? OrderDetail { get; set; }
    }
}
