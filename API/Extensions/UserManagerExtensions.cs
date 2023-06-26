using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Core.Entities.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions;
public static class UserManagerExtensions
{
    public static async Task<AppUser> FindUserByClaimsPrincipleWithAddress
        (this UserManager<AppUser> userManager, ClaimsPrincipal user)
    {
        return await userManager.Users.Include(x => x.Address)
                .SingleOrDefaultAsync(x =>
                    x.Email == user.FindFirstValue(ClaimTypes.Email));
    }

    public static async Task<AppUser> FindByEmailClaimsPrinciple
        (this UserManager<AppUser> userManager, ClaimsPrincipal user)
    {
        return await userManager.Users
            .SingleOrDefaultAsync(x =>
                x.Email == user.FindFirstValue(ClaimTypes.Email));
    }
}
