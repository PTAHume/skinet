using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Core.Specifications;

namespace Infrastructure.Services;

public class OrderService : IOrderService
{
	public IUnitOfWork _unitOfWork { get; }

	public IBasketRepository _basketRepo { get; }

	public OrderService(IBasketRepository basketRepo)
	{
		_basketRepo = basketRepo;
	}
	public OrderService(IUnitOfWork unitOfWork, IBasketRepository basketRepo) =>
	 (_unitOfWork, _basketRepo) = (unitOfWork, basketRepo);

	public async Task<Order> CreateOrderAsync(string buyerEmail, int deliveryMethodId,
			string basketId, Address shipToAddress)
	{
		var basket = await _basketRepo.GetBasketAsync(basketId);
		if (basket == null) return null;
		
		var items = new List<OrderItem>();
		foreach (var item in basket.Items)
		{
			var productItem = await _unitOfWork.Repository<Product>().GetByIdAsync(item.Id);
			var itemOrdered = new
				ProductItemOrders(productItem.Id, productItem.Name, productItem.PictureUrl);
			items.Add(new OrderItem(itemOrdered, productItem.Price, item.Quantity));
		}
		
		var deliveryMethod = await _unitOfWork
						.Repository<DeliveryMethod>().GetByIdAsync(deliveryMethodId);
		var subTotal = items.Sum(item => item.Price * item.Quantity);

		var spec = new OrderByPaymentIntentIdSpecification(basket.PaymentIntentId);
		var order = await _unitOfWork.Repository<Order>().GetEntityWithSpec(spec);
		if (order != null)
		{
			order.ShipToAddress = shipToAddress;
			order.DeliveryMethod = deliveryMethod;
			order.Subtotal = subTotal;
			_unitOfWork.Repository<Order>().Update(order);
		}
		else
		{
			order = new Order(items, buyerEmail, shipToAddress,
						deliveryMethod, subTotal, basket.PaymentIntentId);
			_unitOfWork.Repository<Order>().Add(order);
		}

		var result = await _unitOfWork.Complete();

		if (result <= 0) return null;

		return order;
	}

	public async Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethodAsync()
	{
		return await _unitOfWork.Repository<DeliveryMethod>().ListAllAsync();
	}

	public async Task<Order> GetOrderByIdAsync(int id, string buyerEmail)
	{
		var spec = new OrdersWithItemsAndOrderingSpecification(id, buyerEmail);
		return await _unitOfWork.Repository<Order>().GetEntityWithSpec(spec);
	}

	public async Task<IReadOnlyList<Order>> GetOrdersForUserAsync(string buyerEmail)
	{
		var spec = new OrdersWithItemsAndOrderingSpecification(buyerEmail);
		return await _unitOfWork.Repository<Order>().ListAsync(spec);
	}
}
