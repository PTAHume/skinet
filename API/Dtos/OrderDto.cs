using API.DTOs;

namespace API.DTO;

public class OrderDTO
{
    public int DeliveryMethodId { get; set; }
    public string BasketId { get; set; }
    public AddressDTO ShipToAddress { get; set; }
}