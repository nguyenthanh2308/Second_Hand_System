using System.Net;
using System.Text.Json;
using Second_hand_System.Exceptions;

namespace Second_hand_System.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unhandled exception occurred.");
                await HandleExceptionAsync(context, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";

            if (exception is ProductSoldException)
            {
                context.Response.StatusCode = (int)HttpStatusCode.Conflict; // 409
                var result = JsonSerializer.Serialize(new { error = "Sản phẩm đã được người khác mua" });
                return context.Response.WriteAsync(result);
            }
            else if (exception is UnauthorizedAccessException)
            {
                context.Response.StatusCode = (int)HttpStatusCode.Unauthorized; // 401
                var result = JsonSerializer.Serialize(new { error = exception.Message });
                return context.Response.WriteAsync(result);
            }
            else
            {
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError; // 500
                // For production, generic error message. For dev, maybe details but sticking to user request for now.
                var result = JsonSerializer.Serialize(new { error = "Internal Server Error", detail = exception.Message });
                return context.Response.WriteAsync(result);
            }
        }
    }
}
