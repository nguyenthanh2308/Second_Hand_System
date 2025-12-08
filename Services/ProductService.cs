using Second_hand_System.DTOs;
using Second_hand_System.Entities;
using Second_hand_System.Repositories;

namespace Second_hand_System.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;

        public ProductService(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task<IEnumerable<Product>> GetProductsAsync(ProductFilterDto filter)
        {
            return await _productRepository.GetProductsAsync(
                filter.Keyword,
                filter.MinPrice,
                filter.MaxPrice,
                filter.CategoryId,
                filter.Condition);
        }

        public async Task<Product?> GetProductByIdAsync(int id)
        {
            return await _productRepository.GetProductByIdWithCategoryAsync(id);
        }
    }
}
