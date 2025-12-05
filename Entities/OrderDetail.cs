using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Second_hand_System.Entities
{
    public class OrderDetail
    {
        [Key]
        public int Id { get; set; }

        public int OrderId { get; set; }

        public int ProductId { get; set; }

        [Range(0, double.MaxValue)]
        public decimal Price { get; set; } // Purchase price at that moment

        // Navigation Properties
        [ForeignKey("OrderId")]
        public Order? Order { get; set; }

        [ForeignKey("ProductId")]
        public Product? Product { get; set; }
    }
}
