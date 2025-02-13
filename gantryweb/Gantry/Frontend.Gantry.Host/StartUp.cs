using Frontend.Gantry.Shared.Middlewares;
using Frontend.Host;
using Frontend.Vanilla.DotNetCore.AppBuilder;

namespace Frontend.Gantry.Host;

public class Startup : VanillaAppStartup
{
    public Startup(IWebHostEnvironment environment)
        : base(environment) { }

    protected override void ConfigureAppServices(IServiceCollection services)
    {
        services.AddHostServices();
        services.AddGantryServices();
    }

    protected override void ConfigureAppBeforeRouting(IApplicationBuilder app)
    {
        app.ConfigureHostBeforeRouting();
        app.UseMiddleware<GantryApiExceptionMiddleware>();
    }
}
