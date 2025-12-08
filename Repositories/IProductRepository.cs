using Second_hand_System.Entities;

namespace Second_hand_System.Repositories
{
    public interface IProductRepository : IRepository<Product>
    {
        Task<IEnumerable<Product>> GetProductsAsync(
            string? keyword,
            decimal? minPrice,
            decimal? maxPrice,
            int? categoryId,
            string? condition);

        Task<Product?> GetProductByIdWithCategoryAsync(int id);
    }
}
