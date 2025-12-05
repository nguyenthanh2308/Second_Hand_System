using System.ComponentModel.DataAnnotations;

namespace Second_hand_System.DTOs
{
    public class CreateOrderDto
    {
        [Required]
        public int UserId { get; set; }

        [Required]
        public string ShippingAddress { get; set; } = string.Empty;

        [Required]
        [MinLength(1, ErrorMessage = "At least one product is required.")]
        public List<int> ProductIds { get; set; } = new List<int>();
    }
}
