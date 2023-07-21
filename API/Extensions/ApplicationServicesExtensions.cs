using System.Linq;
using API.Errors;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using API.Helpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using StackExchange.Redis;
using Infrastructure.Services;

namespace API.Extensions;

public static class ApplicationServicesExtensions
{
	public static IServiceCollection AddApplicationServices(this IServiceCollection
		services, IConfiguration config)
	{
		services.AddControllers();
		services.AddDbContext<StoreContext>(x =>
			x.UseNpgsql(config.GetConnectionString("DefaultConnection")));
		services.AddSingleton<IConnectionMultiplexer>(c =>
		{
			var options = ConfigurationOptions.Parse(config.GetConnectionString("Redis"));
			return ConnectionMultiplexer.Connect(options);
		});
        services.AddSingleton<IResponseCacheService, ResponseCacheService>();
        services.AddScoped<IBasketRepository, BasketRepository>();
		services.AddScoped<IProductRepository, ProductRepository>();
		services.AddScoped<ITokenService, TokenService>();
		services.AddScoped<IOrderService,OrderService>();
		services.AddScoped<IUnitOfWork, UnitOfWork>();
		services.AddScoped(typeof(IGenericRepository<>), (typeof(GenericRepository<>)));
		services.AddScoped<IPaymentService, PaymentService>();
		services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
		services.AddAutoMapper(typeof(MappingProfiles));
		services.Configure<ApiBehaviorOptions>(options =>
		{
			options.InvalidModelStateResponseFactory = actionContext =>
			{
				var errors = actionContext.ModelState
					.Where(e => e.Value.Errors.Count > 0)
					.SelectMany(x => x.Value.Errors)
					.Select(x => x.ErrorMessage).ToArray();

				var errorResponse = new ApiValidationErrorResponse
				{
					Errors = errors
				};

				return new BadRequestObjectResult(errorResponse);
			};
		});

		services.AddCors(opt => opt.AddPolicy("CorsPolicy", policy =>
		{
			policy.AllowAnyHeader()
					.AllowAnyMethod()
					.WithOrigins("https://localhost:4200");
		}));

		return services;
	}
}
