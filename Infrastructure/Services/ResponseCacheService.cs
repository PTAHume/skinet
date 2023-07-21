using System.IO;
using System;
using System.Threading.Tasks;
using Core.Interfaces;
using System.Text.Json;
using StackExchange.Redis;
using System.Text;

namespace Infrastructure.Services;

public class ResponseCacheService : IResponseCacheService
{
	private readonly IDatabase _database;
	public ResponseCacheService(IConnectionMultiplexer redus)
	{
		_database = redus.GetDatabase();
	}

	public async Task CacheResponseAsync(string cacheKey, object response, TimeSpan timeToLive)
	{
		if(response == null) return;
		var options = new JsonSerializerOptions
		{
			PropertyNamingPolicy = JsonNamingPolicy.CamelCase
		};
        await using var stream = new MemoryStream();
		await JsonSerializer.SerializeAsync(stream,response, options);
		await _database.StringSetAsync(cacheKey, Encoding.UTF8.GetString(stream.ToArray()), timeToLive);
	}

	public async Task<string> GetCachedResponseAsync(string cacheKey)
	{
		var cachedResponse = await _database.StringGetAsync(cacheKey);
		if(cachedResponse.IsNullOrEmpty) return null;
		return cachedResponse;
	}
}
