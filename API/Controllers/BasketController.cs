using System.Threading.Tasks;
using API.Dtos;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class BasketController : BaseApiController
{
	private readonly IBasketRepository _basketRepository;
	private readonly IMapper _mapper;

	public BasketController(IBasketRepository basketRepository, IMapper mapper)
	{
		_basketRepository = basketRepository;
		_mapper = mapper;
	}

	[HttpGet]
	public async Task<ActionResult<CustomerBasket>> GetBasketById(string id)
	{
		return Ok(await _basketRepository.GetBasketAsync(id) ?? new CustomerBasket(id));
	}

	[HttpPost]
	public async Task<ActionResult<CustomerBasket>> UpdateBasket(CustomerBasketDto basket)
	{
		var customerBasket = _mapper.Map<CustomerBasket>(basket);
		var updatedBasket = await 
				_basketRepository.UpdateBasketAsync(customerBasket) ?? new CustomerBasket(customerBasket.Id);
		return Ok(updatedBasket);
	}

	[HttpDelete]
	public async Task<ActionResult<bool>> DeleteBasket(string id)
	{
		return Ok(await _basketRepository.DeleteBasketAsync(id));
	}
}