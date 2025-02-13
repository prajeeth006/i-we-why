using System;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Core.DependencyInjection.Decorator;

/// <summary>
/// Extension methods for easy application of decorator pattern with dependency injection.
/// </summary>
internal static class DecoratorExtensions
{
    /// <summary>Adds singleton  <typeparamref name="TService" /> wrapping it by given decorators in respective order.</summary>
    public static void AddSingletonWithDecorators<TService, TImplementation>(this IServiceCollection services, Action<DecorationBuilder<TService>> configureDecoration)
        where TService : class
        where TImplementation : class, TService
        => services.AddWithDecorators<TService, TImplementation>(ServiceLifetime.Singleton, configureDecoration);

    /// <summary>Adds singleton  <typeparamref name="TService" /> wrapping it by given decorators in respective order.</summary>
    public static void AddScopedWithDecorators<TService, TImplementation>(this IServiceCollection services, Action<DecorationBuilder<TService>> configureDecoration)
        where TService : class
        where TImplementation : class, TService
        => services.AddWithDecorators<TService, TImplementation>(ServiceLifetime.Scoped, configureDecoration);

    /// <summary>Adds <typeparamref name="TService" /> wrapping it by given decorators in respective order.</summary>
    public static void AddWithDecorators<TService, TImplementation>(
        this IServiceCollection services,
        ServiceLifetime lifetime,
        Action<DecorationBuilder<TService>> configureDecoration)
        where TService : class
        where TImplementation : class, TService
        => services.AddWithDecorators(lifetime, p => p.Create<TImplementation>(), configureDecoration);

    /// <summary>Adds <typeparamref name="TService" /> wrapping it by given decorators in respective order.</summary>
    public static void AddWithDecorators<TService>(
        this IServiceCollection services,
        ServiceLifetime lifetime,
        Func<IServiceProvider, TService> getImplementation,
        Action<DecorationBuilder<TService>> configureDecoration)
        where TService : class
    {
        var builder = new DecorationBuilder<TService>();
        configureDecoration(builder);

        services.Add(new ServiceDescriptor(typeof(TService), CreateService, lifetime));

        object CreateService(IServiceProvider provider)
        {
            var service = getImplementation(provider);

            foreach (var decorate in builder.DecorationFunctions)
                service = decorate(service, provider);

            return service;
        }
    }
}
