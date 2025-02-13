using System;
using System.Collections.Generic;

namespace Frontend.Vanilla.Core.Reflection.Proxy;

/// <summary>
/// Generates proxy class based on instructions from provided <see cref="IRoslynProxyBuilder" />.
/// </summary>
internal sealed class RoslynProxy
{
    public static readonly RoslynProxyQueue Queue = new RoslynProxyQueue(RoslynProxyCompiler.Singleton, RoslynProxyCodeGenerator.Singleton);

    public static Func<Type> EnqueueClassGeneration(IRoslynProxyBuilder builder)
        => Queue.Enqueue(builder);

    public static IReadOnlyList<Type> GenerateClasses(IEnumerable<IRoslynProxyBuilder> builders)
        => Queue.GenerateClasses(builders);
}
