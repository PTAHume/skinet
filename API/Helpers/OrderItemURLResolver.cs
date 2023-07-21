using API.DTOs;
using AutoMapper;
using Core.Entities.OrderAggregate;
using Microsoft.Extensions.Configuration;

namespace API.Helpers
{
    public class OrderItemURLResolver : IValueResolver<OrderItem, OrderItemDTO, string>
    {
        public IConfiguration _config { get; }
        public OrderItemURLResolver(IConfiguration config)
        {
            _config = config;
        }

        public string Resolve(OrderItem source, OrderItemDTO destination, string destMember,
            ResolutionContext context)
        {
            if (string.IsNullOrEmpty(source.ItemOrder.PictureUrl))
            {
                return null;
            }

            return _config["ApiUrl"] + source.ItemOrder.PictureUrl;
        }
    }
}

