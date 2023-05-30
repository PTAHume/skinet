using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class BasketController : BaseApiController
{
    private readonly IBasketRepository _basketRepository;

    public BasketController(IBasketRepository basketRepository)
    {
        _basketRepository = basketRepository;
    }

    [HttpGet]
    public async Task<ActionResult<CustomerBasket>> GetBasketById(string id)
    {
        return Ok(await _basketRepository.GetBasketAsync(id) ?? new CustomerBasket(id));
    }

    [HttpPost]
    public async Task<ActionResult<CustomerBasket>> UpdateBasket(CustomerBasket basket)
    {
        return Ok(await _basketRepository.UpdateBasketAsync(basket) ??
                    new CustomerBasket(basket.Id));
    }

    [HttpDelete]
    public async Task<ActionResult<bool>> DeleteBasket(string id)
    {
        return Ok(await _basketRepository.DeleteBasketAsync(id));
    }
}