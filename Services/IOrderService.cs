using Second_hand_System.DTOs;
using Second_hand_System.Entities;

namespace Second_hand_System.Services
{
    public interface IOrderService
    {
        Task<Order> CheckoutAsync(CreateOrderDto input);
        Task ChangeOrderStatusAsync(int orderId, OrderStatus status);
        Task<IEnumerable<OrderDto>> GetMyOrdersAsync(int userId);
        Task<IEnumerable<OrderDto>> GetAllOrdersAsync();
        Task UpdateOrderStatusAsync(int orderId, string status);
        Task CancelOrderAsync(int orderId, int requestingUserId, bool isAdmin);
    }
}
