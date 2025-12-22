using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace Second_hand_System.DTOs
{
    public class CreateProductDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        [Range(0, double.MaxValue)]
        public decimal Price { get; set; }

        public decimal OriginalPrice { get; set; }

        public string? Condition { get; set; }

        public string? Description { get; set; }

        public string Gender { get; set; } = "Unisex";

        public string? Size { get; set; }

        public IFormFile? ImageFile { get; set; }

        [Required]
        public int CategoryId { get; set; }
    }
}
