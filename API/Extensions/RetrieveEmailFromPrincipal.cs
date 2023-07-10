using System.Security.Claims;

namespace API.Extensions;

public static class ClaimsPrincipalExtensions
{
    public static string RetrieveEmailFromPrincipal(this ClaimsPrincipal User)
    {
        return User?.FindFirstValue(ClaimTypes.Email);
    }
}
