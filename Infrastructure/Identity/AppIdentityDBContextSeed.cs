using System.Linq;
using System.Threading.Tasks;
using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Identity;

public class AppIdentityDbContextSeed
{
	public static async Task SeedUserAsync(UserManager<AppUser> manager)
	{
		if(!manager.Users.Any())
		{
			var user = new AppUser()
			{
				DisplayName = "Test User",
				Email = "test@user.com",
				UserName = "test@user.com",
				Address = new Address()
				{
					FirstName = "Test",
					LastName = "User",
					Street = "123 Street",
					City = "Wales",
					County = "UK",
					PostCode = "AB1 2CD"
				}
			};
            await manager.CreateAsync(user, "Pa$$w0rd");
        }
	}
}