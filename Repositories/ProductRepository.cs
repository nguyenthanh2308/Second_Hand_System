using Microsoft.EntityFrameworkCore;
using Second_hand_System.Data;
using Second_hand_System.Entities;

namespace Second_hand_System.Repositories
{
    public class ProductRepository : Repository<Product>, IProductRepository
    {
        public ProductRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Product>> GetProductsAsync(
            string? keyword,
            decimal? minPrice,
            decimal? maxPrice,
            int? categoryId,
            string? condition)
        {
            var query = _dbSet.AsQueryable();

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                query = query.Where(p => p.Name.Contains(keyword) || (p.Description != null && p.Description.Contains(keyword)));
            }

            if (minPrice.HasValue)
            {
                query = query.Where(p => p.Price >= minPrice.Value);
            }

            if (maxPrice.HasValue)
            {
                query = query.Where(p => p.Price <= maxPrice.Value);
            }

            if (categoryId.HasValue)
            {
                query = query.Where(p => p.CategoryId == categoryId.Value);
            }

            if (!string.IsNullOrWhiteSpace(condition))
            {
                query = query.Where(p => p.Condition == condition);
            }

            // Include Category for display
            query = query.Include(p => p.Category);

            return await query.ToListAsync();
        }

        public async Task<Product?> GetProductByIdWithCategoryAsync(int id)
        {
            return await _dbSet
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.Id == id);
        }
    }
}
