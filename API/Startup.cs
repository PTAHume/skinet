using System.IO;
using API.Extensions;
using API.Middleware;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;

namespace API;

public class Startup
{
    private readonly IConfiguration _config;
    public Startup(IConfiguration config)
    {
        _config = config;
    }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddApplicationServices(_config);
        services.AddIdentityServices(_config);
        services.AddSwaggerDocumentation();
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        app.UseMiddleware<ExceptionMiddleware>();
        app.UseStatusCodePagesWithReExecute("/errors/{0}");
        app.UseSwaggerDocumentation();
        app.UseHttpsRedirection();
        app.UseRouting();
        app.UseStaticFiles();
        app.UseStaticFiles(new StaticFileOptions
        {
            FileProvider = new PhysicalFileProvider(
                Path.Combine(
                    Directory.GetCurrentDirectory(),
                    "Content")),
            RequestPath = "/Content"
        });
        app.UseCors("CorsPolicy");
        app.UseAuthentication();
        app.UseAuthorization();
        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
            endpoints.MapFallbackToController("Index", "FallBack");
        });
    }
}
