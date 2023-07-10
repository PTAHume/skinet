using API.Dtos;
using Core.Entities.OrderAggregate;

namespace API.Dto;

public class OrderDto
{
    public int DeliveryMethodId { get; set; }
    public string BasketId { get; set; }
    public AddressDto ShipToAddress { get; set; }
}
