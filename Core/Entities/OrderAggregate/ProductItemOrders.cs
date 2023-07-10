
namespace Core.Entities.OrderAggregate;

public class ProductItemOrders
{
    public ProductItemOrders() { }
	public ProductItemOrders(int productItemId, string productName, string pictureUrl) =>
	(ProductItemId, ProductName, PictureUrl) = (productItemId, productName, pictureUrl);

	public int ProductItemId { get; set; }
	public string ProductName { get; set; }
	public string PictureUrl { get; set; }
}