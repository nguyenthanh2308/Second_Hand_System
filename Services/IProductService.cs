using Second_hand_System.DTOs;
using Second_hand_System.Entities;

namespace Second_hand_System.Services
{
    public interface IProductService
    {
        Task<IEnumerable<Product>> GetProductsAsync(ProductFilterDto filter);
        Task<Product?> GetProductByIdAsync(int id);
    }
}
