using System;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;
using StackExchange.Redis;
using System.Text.Json;
using System.IO;

namespace Infrastructure.Data;

public class BasketRepository : IBasketRepository
{
    private readonly IDatabase _database;
    public BasketRepository(IConnectionMultiplexer redis)
    {
        _database = redis.GetDatabase();
    }

    public async Task<bool> DeleteBasketAsync(string basketId)
    {
        return await _database.KeyDeleteAsync(basketId);
    }

    public async Task<CustomerBasket> GetBasketAsync(string basketId)
    {
        var data = await _database.StringGetAsync(basketId);
        return data.IsNullOrEmpty ? null : JsonSerializer.Deserialize<CustomerBasket>(data);
    }

    public async Task<CustomerBasket> UpdateBasketAsync(CustomerBasket basket)
    {
        using (var stream = new MemoryStream())
        {
            await JsonSerializer.SerializeAsync<CustomerBasket>(stream, basket);
            stream.Position = 0;
            using var reader = new StreamReader(stream);
            var created = await _database.StringSetAsync(basket.Id,
                		await reader.ReadToEndAsync(), TimeSpan.FromDays(30));
            if (!created) return null;
            return await GetBasketAsync(basket.Id);
        }
    }
}
