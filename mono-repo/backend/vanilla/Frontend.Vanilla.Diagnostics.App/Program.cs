using System;
using System.Threading.Tasks;
using BlazorStrap;
using Frontend.Vanilla.Diagnostics.App.Infrastructure;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Diagnostics.App;

public class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebAssemblyHostBuilder.CreateDefault(args);
        builder.RootComponents.Add<App>("app");
        builder.RootComponents.Add<HeadOutlet>("head::after");

        builder.Services.AddScoped<IVanillaApiClient>(_ =>
        {
            var baseUri = new Uri(builder.HostEnvironment.BaseAddress);

            return new VanillaApiClient($"{baseUri.Scheme}://{baseUri.Host}:{baseUri.Port}/");
        });
        builder.Services.AddBlazorStrap();

        await builder.Build().RunAsync();
    }
}
