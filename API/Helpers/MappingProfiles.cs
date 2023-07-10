
using API.DTOs;
using AutoMapper;
using Core.Entities;
using Core.Entities.OrderAggregate;

namespace API.Helpers;
public class MappingProfiles : Profile
{
	public MappingProfiles()
	{
		CreateMap<Product, ProductToReturnDTO>()
			.ForMember(d => d.ProductBrand, o => o.MapFrom(s => s.ProductBrand.Name))
			.ForMember(d => d.ProductType, o => o.MapFrom(s => s.ProductType.Name))
			.ForMember(d => d.PictureUrl, o => o.MapFrom<ProductUrlResolver>());
		CreateMap<Core.Entities.Identity.Address, AddressDTO>().ReverseMap();
		CreateMap<CustomerBasketDTO, CustomerBasket>();
		CreateMap<BasketItemDTO, BasketItem>();
		CreateMap<AddressDTO, Core.Entities.OrderAggregate.Address>().ReverseMap();
		CreateMap<Order, OrderToReturnDTO>()
				.ForMember(d => d.DeliveryMethod,
					o => o.MapFrom(s => s.DeliveryMethod.ShortName))
				.ForMember(d => d.ShippingPrice,
					o => o.MapFrom(s => s.DeliveryMethod.Price));

		CreateMap<OrderItem, OrderItemDTO>()
				.ForMember(d => d.ProductId,
					o => o.MapFrom(s => s.ItemOrder.ProductItemId))
		   	.ForMember(d => d.ProductName,
					o => o.MapFrom(s => s.ItemOrder.ProductName))
			.ForMember(d => d.PictureUrl, 
					o => o.MapFrom(s => s.ItemOrder.PictureUrl))
			.ForMember(d => d.PictureUrl,
                    o => o.MapFrom<OrderItemURLResolver>());
	}
}