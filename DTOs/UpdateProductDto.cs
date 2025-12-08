using Second_hand_System.Entities;

namespace Second_hand_System.DTOs
{
    public class UpdateProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal? OriginalPrice { get; set; } // Nullable to handle potential nulls
        public string? Condition { get; set; }
        public string? Description { get; set; }
        public int CategoryId { get; set; }
        public string Status { get; set; } = "Available";
        public string? ImageUrl { get; set; } // Added to prevent binding error if frontend sends it
    }
}
