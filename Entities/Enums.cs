namespace Second_hand_System.Entities
{
    public enum UserRole
    {
        Customer = 0,
        Admin = 1
    }

    public enum ProductStatus
    {
        Available = 0,
        Sold = 1,
        Hidden = 2
    }

    public enum OrderStatus
    {
        Pending,
        Shipping,
        Completed,
        Cancelled
    }

    public enum ProductGender
    {
        Male,
        Female,
        Unisex
    }
}
