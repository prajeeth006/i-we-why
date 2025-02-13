using System;
using System.Threading.Tasks;

namespace Frontend.Vanilla.DomainSpecificLanguage.Compilation;

/// <summary>
/// Dummy object used as a return value for DSL actions.
/// </summary>
internal sealed class VoidDslResult : IEquatable<VoidDslResult>
{
    public static readonly VoidDslResult Singleton = new VoidDslResult();
    public static readonly Task<object> SingletonTask = Task.FromResult<object>(Singleton);

    private VoidDslResult() { }

    public bool Equals(VoidDslResult? other) => true;
}
