using Second_hand_System.Entities;

namespace Second_hand_System.Repositories
{
    public interface IOrderRepository : IRepository<Order>
    {
        Task<IEnumerable<Order>> GetOrdersByUserIdAsync(int userId);
    }
}
