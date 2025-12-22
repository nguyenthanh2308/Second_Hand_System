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

                    // CHECK: Ensure product is not in any pending or shipping orders
                    var existingOrders = await _context.Orders
                        .Include(o => o.OrderDetails)
                        .Where(o => (o.Status == OrderStatus.Pending || o.Status == OrderStatus.Shipping) &&
                                   o.OrderDetails.Any(od => od.ProductId == productId))
                        .AnyAsync();

                    if (existingOrders)
                    {
                        throw new Second_hand_System.Exceptions.ProductSoldException($"Product '{product.Name}' (ID: {productId}) is currently in another pending order.");
                    }

                    // NOTE: Product status remains Available during checkout
                    // It will only be set to Sold when admin marks order as Completed

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

        public async Task<IEnumerable<Order>> GetAllOrdersAsync()
        {
            return await _orderRepository.GetAllAsync();
        }

        public async Task UpdateOrderStatusAsync(int orderId, string status)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var order = await _context.Orders
                    .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                    .FirstOrDefaultAsync(o => o.Id == orderId);

                if (order == null)
                {
                    throw new Exception("Order not found.");
                }

                if (Enum.TryParse<OrderStatus>(status, out var orderStatus))
                {
                    order.Status = orderStatus;

                    // When order is marked as Completed, mark all products as Sold
                    if (orderStatus == OrderStatus.Completed)
                    {
                        foreach (var detail in order.OrderDetails)
                        {
                            if (detail.Product != null && detail.Product.Status == ProductStatus.Available)
                            {
                                detail.Product.Status = ProductStatus.Sold;
                                _productRepository.Update(detail.Product);
                            }
                        }
                    }

                    _orderRepository.Update(order);
                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();
                }
                else
                {
                    await transaction.RollbackAsync();
                    throw new Exception("Invalid order status.");
                }
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task CancelOrderAsync(int orderId, int requestingUserId, bool isAdmin)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Get order with details
                var order = await _context.Orders
                    .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                    .FirstOrDefaultAsync(o => o.Id == orderId);

                if (order == null)
                {
                    throw new Exception("Order not found.");
                }

                // Permission check: Customer can only cancel their own orders, Admin can cancel any
                if (!isAdmin && order.UserId != requestingUserId)
                {
                    throw new UnauthorizedAccessException("You can only cancel your own orders.");
                }

                // Status validation: Only Pending and Shipping orders can be cancelled
                if (order.Status == OrderStatus.Completed)
                {
                    throw new Exception("Cannot cancel a completed order.");
                }

                if (order.Status == OrderStatus.Cancelled)
                {
                    throw new Exception("Order is already cancelled.");
                }

                // Cancel the order
                order.Status = OrderStatus.Cancelled;
                _orderRepository.Update(order);

                // Only restore products to Available if they were marked as Sold
                // (i.e., if the order had been Completed before cancellation)
                Console.WriteLine($"Restoring products for cancelled order {orderId}...");
                foreach (var detail in order.OrderDetails)
                {
                    if (detail.Product != null)
                    {
                        Console.WriteLine($"Product {detail.ProductId} current status: {detail.Product.Status}");
                        if (detail.Product.Status == ProductStatus.Sold)
                        {
                            detail.Product.Status = ProductStatus.Available;
                            _productRepository.Update(detail.Product);
                            Console.WriteLine($"Product {detail.ProductId} restored to Available");
                        }
                        else
                        {
                            Console.WriteLine($"Product {detail.ProductId} already Available, no restore needed");
                        }
                    }
                }

                // Commit transaction
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
    }
}
