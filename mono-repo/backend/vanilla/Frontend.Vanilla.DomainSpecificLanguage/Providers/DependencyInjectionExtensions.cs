using Frontend.Vanilla.Core.System.Text;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers;

/// <summary>
/// Convenience methods for easy registration of DSL providers.
/// </summary>
public static class DependencyInjectionExtensions
{
    /// <summary>
    /// Adds <see cref="DslValueProvider" /> with name according to convetion (IFooDslProvider -> Foo)
    /// and resolves instance of <typeparamref name="TProvider" /> as its instance.
    /// </summary>
    public static IServiceCollection AddDslValueProvider<TProvider>(this IServiceCollection services, Identifier? name = null)
        where TProvider : class
        => services.AddSingleton(p =>
        {
            var instance = p.GetRequiredService<TProvider>();

            return DslValueProvider.Create(instance, name);
        });
}
