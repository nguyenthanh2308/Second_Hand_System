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
        Pending = 0,
        Shipping = 1,
        Completed = 2,
        Cancelled = 3
    }
}
