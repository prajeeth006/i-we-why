using System;
using Frontend.Vanilla.Core.Reflection;
using Frontend.Vanilla.Core.Utils;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Core.DependencyInjection;

/// <summary>
/// Shorter syntax for <see cref="ActivatorUtilities" />.
/// </summary>
internal static class ActivationExtensions
{
    public static TService Create<TService>(this IServiceProvider services, params object[] args)
        where TService : class
        => (TService)services.Create(typeof(TService), args);

    public static object Create(this IServiceProvider services, Type serviceType, params object[] args)
    {
        Guard.Requires(serviceType, t => t.IsFinalClass(), nameof(serviceType), "Service type must a final class to be able to create it.");

        return ActivatorUtilities.CreateInstance(services, serviceType, args);
    }

    public static Func<T> GetFunc<T>(this IServiceProvider services)
        where T : class
        => services.GetRequiredService<T>;
}
