using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Second_hand_System.DTOs;
using Second_hand_System.Services;

namespace Second_hand_System.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpPost]
        public async Task<IActionResult> Checkout([FromBody] CreateOrderDto dto)
        {
            try
            {
                // Ensure the user creating the order matches the token
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null) return Unauthorized();

                int userId = int.Parse(userIdClaim.Value);
                if (dto.UserId != userId)
                {
                    return BadRequest("User ID mismatch.");
                }

                var order = await _orderService.CheckoutAsync(dto);
                return Ok(order);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("history")]
        public async Task<IActionResult> GetMyOrders()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();

            int userId = int.Parse(userIdClaim.Value);
            var orders = await _orderService.GetMyOrdersAsync(userId);
            return Ok(orders);
        }
    }
}
