using System;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace Frontend.Vanilla.Features.Authentication;

internal static class ServiceCollectionExtensions
{
    public static IServiceCollection Configure<TOptions, TDependency>(this IServiceCollection services, string name, Action<TOptions, TDependency> action)
        where TOptions : class
        where TDependency : class
        => services.AddSingleton<IConfigureOptions<TOptions>>(p => new ConfigureNamedOptions<TOptions, TDependency>(name, p.GetRequiredService<TDependency>(), action));
}
