using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.Ioc;

internal static class IocServices
{
    public static void AddIocFeature(this IServiceCollection services)
    {
        services.AddSingleton<IBootTaskExecutor, BootTaskExecutor>();
        services.AddSingleton(new ReferencedAssemblies(GetAssemblies()));
    }

    private static IEnumerable<Assembly> GetAssemblies()
    {
        return Assembly.GetExecutingAssembly().GetReferencedAssemblies().Select(Assembly.Load);
    }
}
