using System.Collections.Generic;
using System;

namespace Core.Entities.OrderAggregate;

public class Order : BaseEntity
{
	public Order() { }
	public Order(IReadOnlyList<OrderItem> orderItems,
	string buyerEmail, 
	Address shipToAddress, 
	DeliveryMethod deliveryMethod, 
	decimal subtotal) => 
		(OrderItems,
		BuyerEmail,  
		ShipToAddress, 
		DeliveryMethod, 
		Subtotal) = 
			(orderItems,
			buyerEmail,
			shipToAddress, 
			deliveryMethod, 
			subtotal);
	public string BuyerEmail { get; set; }
	public DateTime OrderDate { get; set; } = DateTime.UtcNow;
	public Address ShipToAddress { get; set; }
	public DeliveryMethod DeliveryMethod { get; set; }
	public IReadOnlyList<OrderItem> OrderItems { get; set; }
	public decimal Subtotal { get; set; }
	public OrderStatus Status { get; set; } = OrderStatus.Pending;
	public string PaymentIntentId { get; set; }
	public decimal GetTotal()
	{
		return Subtotal + DeliveryMethod.Price;
	}
}