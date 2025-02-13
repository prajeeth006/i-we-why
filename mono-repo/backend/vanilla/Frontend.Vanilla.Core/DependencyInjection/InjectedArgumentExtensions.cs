using System;
using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Core.Collections;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace Frontend.Vanilla.Core.DependencyInjection;

/// <summary>
/// Extension methods for easy registration of a service with explicit parameters.
/// </summary>
internal static class InjectedArgumentExtensions
{
    public static void AddSingleton<TService, TImplementation>(this IServiceCollection services, params InjectedArgument[] args)
        where TService : class
        where TImplementation : class, TService
        => services.Add(GetDescriptor<TService, TImplementation>(ServiceLifetime.Singleton, args));

    public static void TryAddSingleton<TService, TImplementation>(this IServiceCollection services, params InjectedArgument[] args)
        where TService : class
        where TImplementation : class, TService
        => services.TryAdd(GetDescriptor<TService, TImplementation>(ServiceLifetime.Singleton, args));

    public static void AddScoped<TService, TImplementation>(this IServiceCollection services, params InjectedArgument[] args)
        where TService : class
        where TImplementation : class, TService
        => services.Add(GetDescriptor<TService, TImplementation>(ServiceLifetime.Scoped, args));

    private static ServiceDescriptor GetDescriptor<TService, TImplementation>(ServiceLifetime lifetime, IEnumerable<InjectedArgument> args)
        where TService : class
        where TImplementation : class, TService
    {
        var argList = args.ToArray(); // Copy to prevent further modification

        object CreateService(IServiceProvider provider)
        {
            var argValues = argList.ConvertAll(a => a.GetValue(provider));

            return provider.Create<TImplementation>(argValues);
        }

        return new ServiceDescriptor(typeof(TService), CreateService, lifetime);
    }
}
