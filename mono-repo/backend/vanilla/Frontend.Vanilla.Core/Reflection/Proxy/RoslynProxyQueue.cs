using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Core.Reflection.Proxy;

/// <summary>
/// Compiles given source codes of multiple types to a dynamic assembly in memory and loads them.
/// </summary>
internal sealed class RoslynProxyQueue(IRoslynProxyCompiler compiler, IRoslynProxyCodeGenerator codeGenerator)
{
    private readonly Lock lockObject = new ();
    private readonly StringBuilder cSharpCodes = new ();
    private readonly HashSet<ProxyClassKey> enqueuedInterfacesToProxy = new ();
    private readonly List<CompilationInfo> compilations = new ();

    public Func<Type> Enqueue(IRoslynProxyBuilder builder)
    {
        lock (lockObject)
        {
            // Don't pass builder to any closure so that it can be garbage collected asap!!!
            var proxyKey = new ProxyClassKey { ProxiedInterface = builder.InterfaceToProxy, ClassNameInfix = builder.ClassNameInfix };

            if (GetGeneratedType(proxyKey) is Type alreadyCompiled)
                return () => alreadyCompiled;

            if (!enqueuedInterfacesToProxy.Contains(proxyKey))
            {
                var code = codeGenerator.GenerateClassCode(builder);
                cSharpCodes.AppendLine(code);
                enqueuedInterfacesToProxy.Add(proxyKey);
            }

            return CompileAndGetGeneratedTypeLazily(proxyKey);
        }
    }

    public IReadOnlyList<Type> GenerateClasses(IEnumerable<IRoslynProxyBuilder> builders)
        => builders.Select(Enqueue).ToList().ConvertAll(f => f()); // Make sure all builders are enqueued together

    public IReadOnlyList<CompilationInfo> GetCompilations()
    {
        lock (lockObject)
            return compilations.ToList();
    }

    private Func<Type> CompileAndGetGeneratedTypeLazily(ProxyClassKey proxyKey)
        => () =>
        {
            lock (lockObject)
            {
                if (GetGeneratedType(proxyKey) is Type alreadyCompiled)
                    return alreadyCompiled;

                var start = Stopwatch.GetTimestamp();
                var startMemory = GetConsumedMemory();
                var compiledClasses = compiler.CompileTypes(cSharpCodes.ToString());
                var endMemory = GetConsumedMemory();

                compilations.Add(new CompilationInfo(compiledClasses, Stopwatch.GetElapsedTime(start), endMemory - startMemory));
                cSharpCodes.Capacity = cSharpCodes.Length = 0; // Memory cleanup
                enqueuedInterfacesToProxy.Clear();

                return GetGeneratedType(proxyKey) ?? throw new VanillaBugException();
            }
        };

    private Type? GetGeneratedType(ProxyClassKey proxyKey)
        => compilations.SelectMany(c => c.GeneratedClasses)
            .SingleOrDefault(c => proxyKey.ProxiedInterface.IsAssignableFrom(c) && c.Name.Contains(proxyKey.ClassNameInfix));

    private static long GetConsumedMemory()
        => Process.GetCurrentProcess().PrivateMemorySize64;

    private struct ProxyClassKey
    {
        public Type ProxiedInterface { get; set; }
        public TrimmedRequiredString ClassNameInfix { get; set; }
    }
}

internal sealed class CompilationInfo(IReadOnlyList<Type> generatedClasses, TimeSpan duration, long estimatedMemoryIncrease)
{
    public TimeSpan Duration { get; } = duration;
    public string EstimatedMemoryIncrease { get; } = estimatedMemoryIncrease.ToString("### ### ### ### bytes");
    public IReadOnlyList<Type> GeneratedClasses { get; } = generatedClasses;
}
