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
