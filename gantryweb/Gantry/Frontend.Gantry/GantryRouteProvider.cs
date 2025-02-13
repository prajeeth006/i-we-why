using Frontend.Vanilla.DotNetCore.Host;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;

namespace Frontend.Gantry
{
    public sealed class GantryRouteProvider : IRouteProvider
    {
        public int Priority => 2;
        public void Provide(IEndpointRouteBuilder endpointRouteBuilder)
        {
            InitGantryRoutes(endpointRouteBuilder); //TODO check lobby .WithDefault("path", UrlParameter.Optional));
        }

        private void InitGantryRoutes(IEndpointRouteBuilder context)
        {
            context.MapControllerRoute("cache/{controller}/{action}", "{culture}/cache/{controller}/{action}");

            context.MapControllerRoute("StaticPromotion/{controller}/{action}/{id}", "{culture}/gantry/StaticPromotion/{controller}/{action}/{id}");

            // Wild card route
            context.MapControllerRoute("gantry/{*path}", "{culture}/gantry/{*path}", new { controller = "GantryClientBootstrap", action = "GantryBootstrap" });

            context.MapClientBootstrapRoute("gantry/servererror/{*path}", "{culture}/gantry/servererror/{*path}");
        }

    }
}
