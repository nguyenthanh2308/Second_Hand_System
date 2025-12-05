namespace Second_hand_System.DTOs
{
    public class ProductFilterDto
    {
        public string? Keyword { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public int? CategoryId { get; set; }
        public string? Condition { get; set; }
    }
}
