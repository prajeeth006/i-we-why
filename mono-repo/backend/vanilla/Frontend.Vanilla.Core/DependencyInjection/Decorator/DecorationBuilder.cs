using System;
using System.Collections.Generic;

namespace Frontend.Vanilla.Core.DependencyInjection.Decorator;

/// <summary>Used to specify decorators in strongly-typed manner.</summary>
internal sealed class DecorationBuilder<TService>
    where TService : class
{
    public IList<Func<TService, IServiceProvider, TService>> DecorationFunctions { get; } = new List<Func<TService, IServiceProvider, TService>>();

    public DecorationBuilder<TService> DecorateBy<TDecorator>()
        where TDecorator : class, TService
        => DecorateBy((s, p) => p.Create<TDecorator>(s));

    public DecorationBuilder<TService> DecorateBy(Func<TService, IServiceProvider, TService> decoratorFunc)
    {
        DecorationFunctions.Add(decoratorFunc);

        return this;
    }
}
