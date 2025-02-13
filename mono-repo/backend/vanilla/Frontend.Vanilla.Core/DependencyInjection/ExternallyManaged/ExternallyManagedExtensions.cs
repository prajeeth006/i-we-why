using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Core.DependencyInjection.ExternallyManaged;

internal static class ExternallyManagedExtensions
{
    /// <summary>
    /// Registers given service as transient one to be externally managed using <see cref="ExternalManager{TValue}" />.
    /// This allows creation of whole graph of services with one service (e.g. config) injected according to your needs.
    /// </summary>
    public static void AddExternallyManaged<TService>(this IServiceCollection services, ServiceLifetime lifetime)
        where TService : class
    {
        services.Add(new ServiceDescriptor(typeof(ExternalManager<TService>), _ => new ExternalManager<TService>(), lifetime));
        services.AddTransient(provider =>
        {
            var manager = provider.GetRequiredService<ExternalManager<TService>>();

            return manager.Value;
        });
    }
}
