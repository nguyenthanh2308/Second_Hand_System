using Microsoft.EntityFrameworkCore;
using Second_hand_System.Data;
using Second_hand_System.DTOs;
using Second_hand_System.Entities;
using Second_hand_System.Repositories;

namespace Second_hand_System.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IProductRepository _productRepository;
        private readonly AppDbContext _context;

        public OrderService(
            IOrderRepository orderRepository,
            IProductRepository productRepository,
            AppDbContext context)
        {
            _orderRepository = orderRepository;
            _productRepository = productRepository;
            _context = context;
        }

        public async Task<Order> CheckoutAsync(CreateOrderDto input)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var order = new Order
                {
                    UserId = input.UserId,
                    OrderDate = DateTime.UtcNow,
                    ShippingAddress = input.ShippingAddress,
                    Status = OrderStatus.Pending,
                    OrderDetails = new List<OrderDetail>()
                };

                decimal totalAmount = 0;

                foreach (var productId in input.ProductIds)
                {
                    // Look up product
                    var product = await _productRepository.GetByIdAsync(productId);
                    if (product == null)
                    {
                        throw new Exception($"Product with ID {productId} does not exist.");
                    }

                    // ATOMIC CHECK: Check if available
                    if (product.Status != ProductStatus.Available)
                    {
                        throw new Second_hand_System.Exceptions.ProductSoldException($"Product '{product.Name}' (ID: {productId}) is already sold or unavailable.");
                    }

                    // LOCK ITEM: Set status to Sold
                    product.Status = ProductStatus.Sold;
                    _productRepository.Update(product); // Mark as modified

                    // Add to OrderDetail
                    var detail = new OrderDetail
                    {
                        ProductId = productId,
                        Price = product.Price, // Snapshot price at purchase time
                        Product = product
                    };
                    
                    order.OrderDetails.Add(detail);
                    totalAmount += product.Price;
                }

                order.TotalAmount = totalAmount;

                // Save Order
                await _orderRepository.AddAsync(order);
                
                // Commit changes (Both Order creation and Product updates happen here atomically)
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return order;
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw; // Rethrow to controller
            }
        }

        public async Task ChangeOrderStatusAsync(int orderId, OrderStatus status)
        {
            var order = await _orderRepository.GetByIdAsync(orderId);
            if (order == null)
            {
                throw new Exception("Order not found.");
            }

            order.Status = status;
            _orderRepository.Update(order);
            await _orderRepository.SaveChangesAsync();
        }

        public async Task<IEnumerable<Order>> GetMyOrdersAsync(int userId)
        {
            return await _orderRepository.GetOrdersByUserIdAsync(userId);
        }
    }
}
