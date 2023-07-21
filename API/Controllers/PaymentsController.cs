using System.Threading.Tasks;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Core.Entities;
using API.Errors;
using System.IO;
using Stripe;

using Microsoft.Extensions.Logging;
using Core.Entities.OrderAggregate;
using Microsoft.Extensions.Configuration;

namespace API.Controllers;

public class PaymentsController : BaseApiController
{
    private readonly IPaymentService _paymentService;
    private readonly ILogger<PaymentsController> _logger;
    private readonly string _whSecret;

    public PaymentsController
        (IPaymentService paymentService,
            ILogger<PaymentsController> logger, IConfiguration config) =>
        (_paymentService, _logger, _whSecret) =
        (paymentService, logger, config.GetSection("StripeSettings:WhSecret").Value);

    [Authorize]
    [HttpPost("{basketId}")]
    public async Task<ActionResult<CustomerBasket>> CreateOrUpdatePaymentIntent(string basketId)
    {
        var basket = await _paymentService.CreateOrUpdatePaymentIntent(basketId);
        if (basket == null) return BadRequest(new ApiResponse(400, "Problem with your basket"));
        return basket;
    }

    [HttpPost("webhook")]
    public async Task<ActionResult> StripeWebHook()
    {
        var json = await new StreamReader(Request.Body).ReadToEndAsync();
        var stripeEvent = EventUtility
                .ConstructEvent(json, Request.Headers["Stripe-Signature"], _whSecret, throwOnApiVersionMismatch: false);

        PaymentIntent intent;
        Order order;
        switch (stripeEvent.Type)
        {
            case "payment_intent.succeeded":
                intent = (PaymentIntent)stripeEvent.Data.Object;
                _logger.LogInformation("Payment succeeded:", intent);
                order = await _paymentService.UpdateOrderPaymentSucceeded(intent.Id);
                _logger.LogInformation("Order updated to payment received:", order);
                break;
            case "payment_intent.payment_failed":
                intent = (PaymentIntent)stripeEvent.Data.Object;
                _logger.LogInformation("Payment failed:", intent);
                order = await _paymentService.UpdateOrderPaymentFailed(intent.Id);
                _logger.LogInformation("Order updated to payment failed:", order);
                break;
        };
        return new EmptyResult();
    }
}