using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Second_hand_System.DTOs;
using Second_hand_System.Entities;
using Second_hand_System.Repositories;
using Second_hand_System.Services;

namespace Second_hand_System.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;
        private readonly IRepository<Product> _repository; // Use generic repo for Add for simplicity as logic is simple
        private readonly IFileStorageService _fileStorageService;

        public ProductController(
            IProductService productService,
            IRepository<Product> repository,
            IFileStorageService fileStorageService)
        {
            _productService = productService;
            _repository = repository;
            _fileStorageService = fileStorageService;
        }

        [HttpGet]
        public async Task<IActionResult> GetProducts([FromQuery] ProductFilterDto filter)
        {
            var products = await _productService.GetProductsAsync(filter);
            return Ok(products);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProduct(int id)
        {
            var product = await _repository.GetByIdAsync(id);
            if (product == null) return NotFound();
            return Ok(product);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] UpdateProductDto dto)
        {
            Console.WriteLine($"=== UPDATE PRODUCT ===");
            Console.WriteLine($"URL ID: {id}");
            Console.WriteLine($"DTO ID: {dto?.Id}");
            Console.WriteLine($"DTO Name: {dto?.Name}");
            
            if (dto == null)
            {
                Console.WriteLine("ERROR: dto is NULL");
                return BadRequest("Product data is null");
            }
            
            if (id != dto.Id)
            {
                Console.WriteLine($"ERROR: ID mismatch - URL: {id}, DTO: {dto.Id}");
                return BadRequest($"ID mismatch - URL: {id}, DTO: {dto.Id}");
            }
            
            var existingProduct = await _repository.GetByIdAsync(id);
            if (existingProduct == null)
            {
                Console.WriteLine($"ERROR: Product {id} not found");
                return NotFound();
            }

            // Update fields
            existingProduct.Name = dto.Name;
            existingProduct.Price = dto.Price;
            existingProduct.OriginalPrice = dto.OriginalPrice ?? 0; // Handle nullable
            existingProduct.Condition = dto.Condition;
            existingProduct.Description = dto.Description;
            existingProduct.CategoryId = dto.CategoryId;
            
            // Parse Status string to ProductStatus enum
            if (Enum.TryParse<ProductStatus>(dto.Status, true, out var status))
            {
                existingProduct.Status = status;
            }
            else
            {
                Console.WriteLine($"WARNING: Invalid status '{dto.Status}', keeping existing");
            }

            _repository.Update(existingProduct);
            await _repository.SaveChangesAsync();
            
            Console.WriteLine($"SUCCESS: Product {id} updated");
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _repository.GetByIdAsync(id);
            if (product == null) return NotFound();
            
            _repository.Delete(product);
            await _repository.SaveChangesAsync();
            return NoContent();
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateProduct([FromForm] CreateProductDto dto)
        {
            string? imageUrl = null;
            if (dto.ImageFile != null)
            {
                imageUrl = await _fileStorageService.SaveFileAsync(dto.ImageFile, "products");
            }

            var product = new Product
            {
                Name = dto.Name,
                Price = dto.Price,
                OriginalPrice = dto.OriginalPrice,
                Condition = dto.Condition,
                Description = dto.Description,
                ImageUrl = imageUrl,
                CategoryId = dto.CategoryId,
                Status = ProductStatus.Available,
                CreatedDate = DateTime.UtcNow
            };

            await _repository.AddAsync(product);
            await _repository.SaveChangesAsync();

            return Ok(product);
        }
    }
}
