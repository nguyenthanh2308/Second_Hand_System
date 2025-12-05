using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Second_hand_System.Entities
{
    public class Order
    {
        [Key]
        public int Id { get; set; }

        public int UserId { get; set; }

        public DateTime OrderDate { get; set; } = DateTime.UtcNow;

        [Range(0, double.MaxValue)]
        public decimal TotalAmount { get; set; }

        [Required]
        [MaxLength(300)]
        public string ShippingAddress { get; set; } = string.Empty;

        public OrderStatus Status { get; set; } = OrderStatus.Pending;

        // Navigation Properties
        [ForeignKey("UserId")]
        public User? User { get; set; }

        public ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
    }
}
