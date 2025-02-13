using Frontend.Gantry.Shared;
using Frontend.Vanilla.DotNetCore.Host;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Gantry
{
    public static class GantryServices
    {
        public static void AddGantryServices(this IServiceCollection services)
        {
            services.AddGantrySharedServices();
            services.AddSingleton<IRouteProvider, GantryRouteProvider>();
        }

    }
}
