using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;

namespace Infrastructure.Services;

public class OrderService : IOrderService
{
    public IGenericRepository<Order> _orderReo { get; }
    public IGenericRepository<DeliveryMethod> _dmRepo { get; }
    public IGenericRepository<Product> _productRepo { get; }
    public OrderService(IBasketRepository _basketRepo)
    {
        this._basketRepo = _basketRepo;

    }
    public IBasketRepository _basketRepo { get; }
    public OrderService(IGenericRepository<Order> orderReo, IGenericRepository<DeliveryMethod> dmRepo, IGenericRepository<Product> productRepo, IBasketRepository basketRepo) =>
     (_orderReo, _dmRepo, _productRepo, _basketRepo) = (orderReo, dmRepo, productRepo, basketRepo);


    public async Task<Order> CreateOrderAsync(string buyerEmail, int deliveryMethodId, string basketId, Address shipToAddress)
    {
        var items = await Task.WhenAll((await _basketRepo.GetBasketAsync(basketId)).Items.AsParallel().Select(async x =>
        {
            var productItem = await _productRepo.GetByIdAsync(x.Id);
            var itemOrdered = new ProductItemOrders(productItem.Id, productItem.Name, productItem.PictureUrl);
            return new OrderItem(itemOrdered, productItem.Price, x.Quantity);
        }).AsParallel().ToList());

        var deliveryMethod = await _dmRepo.GetByIdAsync(deliveryMethodId);
        var subTotal = items.Sum(item => item.Price * item.Quantity);
        var order = new Order(items, buyerEmail, shipToAddress, deliveryMethod, subTotal);
        //TODO: Save to db
        return order;
    }

    public Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethodAsync()
    {
        return null;
    }

    public Task<Order> GetOrderByIdAsync(int id, string buyerEmail)
    {
        return null;
    }

    public Task<IReadOnlyList<Order>> GetOrdersForUserAsync(string buyerEmail)
    {
        return null;
    }
}
