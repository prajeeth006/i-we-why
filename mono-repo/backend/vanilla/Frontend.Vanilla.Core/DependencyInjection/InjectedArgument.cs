using System;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Core.DependencyInjection;

/// <summary>
/// Specifies an argument that will be explicitly injected during service creation using <see cref="InjectedArgumentExtensions" />.
/// </summary>
internal class InjectedArgument(Func<IServiceProvider, object> getValue)
{
    public static InjectedArgument CreateFuncArgument<T>()
        where T : notnull
        => new (p => new Func<T>(p.GetRequiredService<T>));

    public Func<IServiceProvider, object> GetValue { get; } = getValue;

    public InjectedArgument(object value)
        : this(_ => value) { }
}

internal class InjectedArgument<TService>() : InjectedArgument(p => p.GetRequiredService<TService>())
    where TService : class { }
