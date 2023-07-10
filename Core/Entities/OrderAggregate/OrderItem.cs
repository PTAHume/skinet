namespace Core.Entities.OrderAggregate;

public class OrderItem : BaseEntity
{
    public OrderItem() { }
    public OrderItem(ProductItemOrders itemOrder, decimal price, int quantity) =>
        (ItemOrder, Price, Quantity) = (itemOrder, price, quantity);

    public ProductItemOrders ItemOrder { get; set; }

    public decimal Price { get; set; }

    public int Quantity { get; set; }
}
