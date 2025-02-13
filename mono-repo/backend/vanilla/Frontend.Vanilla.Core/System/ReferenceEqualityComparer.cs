using System.Collections.Generic;
using System.Runtime.CompilerServices;

namespace Frontend.Vanilla.Core.System;

/// <summary>
/// Determines object equality based on their reference equality.
/// </summary>
internal sealed class ReferenceEqualityComparer : IEqualityComparer<object>
{
    public static readonly IEqualityComparer<object> Singleton = new ReferenceEqualityComparer();

    private ReferenceEqualityComparer() { }

    public new bool Equals(object? x, object? y)
        => ReferenceEquals(x, y);

    public int GetHashCode(object obj)
#pragma warning disable RS1024 // Compare symbols correctly
        => RuntimeHelpers.GetHashCode(obj);
#pragma warning restore RS1024 // Compare symbols correctly
}
