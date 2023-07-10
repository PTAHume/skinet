using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTO;
using AutoMapper;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using API.Extensions;
using API.DTOs;
using API.Errors;

namespace API.Controllers;

[Authorize]
public class OrdersController : BaseApiController
{
    private readonly IOrderService _orderService;
    private readonly IMapper _mapper;

    public OrdersController(IOrderService orderService, IMapper mapper)
    {
        _orderService = orderService;
        _mapper = mapper;
    }

    [HttpPost]
    public async Task<ActionResult<Order>> CreateOrders(OrderDTO orderDTO)
    {
        var address = _mapper.Map<AddressDTO, Address>(orderDTO.ShipToAddress);
        var order = await _orderService.CreateOrderAsync(
                HttpContext.User.RetrieveEmailFromPrincipal(), orderDTO.DeliveryMethodId,
               orderDTO.BasketId, address);
        if (order == null) return BadRequest(new ApiResponse(400, "Problem creating order"));
        return Ok(order);
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<OrderToReturnDTO>>> GetOrdersForUser()
    {
        var email = HttpContext.User.RetrieveEmailFromPrincipal();
        var order = await _orderService.GetOrdersForUserAsync(email);
        return Ok(_mapper.Map<IReadOnlyList<OrderToReturnDTO>>(order));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<OrderToReturnDTO>> GetOrdersByIdForUser(int id)
    {
        var email = HttpContext.User.RetrieveEmailFromPrincipal();
        var order = await _orderService.GetOrderByIdAsync(id, email);
        if (order == null) return NotFound(new ApiResponse(400));
        return _mapper.Map<OrderToReturnDTO>(order);
    }

    [HttpGet("deliveryMethods")]
    public async Task<ActionResult<IReadOnlyList<DeliveryMethod>>> GetDeliveryMethods()
    {
        return Ok(await _orderService.GetDeliveryMethodAsync());
    }
}
