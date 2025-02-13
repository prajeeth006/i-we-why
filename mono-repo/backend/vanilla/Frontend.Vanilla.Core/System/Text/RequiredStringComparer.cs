using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Core.System.Text;

/// <summary>
/// Comparer for <see cref="RequiredString" /> based on <see cref="StringComparer" />.
/// </summary>
internal sealed class RequiredStringComparer : IComparer<RequiredString?>, IEqualityComparer<RequiredString?>
{
    /// <summary>Gets comparer based on <see cref="StringComparer.OrdinalIgnoreCase" />.</summary>
    public static RequiredStringComparer OrdinalIgnoreCase { get; } = new RequiredStringComparer(StringComparer.OrdinalIgnoreCase);

    private readonly StringComparer inner;

    private RequiredStringComparer(StringComparer inner)
        => this.inner = Guard.NotNull(inner, nameof(inner));

    /// <summary>See <see cref="IComparer{T}.Compare" />.</summary>
    public int Compare(RequiredString? x, RequiredString? y)
        => inner.Compare(x?.Value, y?.Value);

    /// <summary>See <see cref="IEqualityComparer{T}.Equals(T,T)" />.</summary>
    public bool Equals(RequiredString? x, RequiredString? y)
        => inner.Equals(x?.Value, y?.Value);

    /// <summary>See <see cref="IEqualityComparer{T}.GetHashCode(T)" />.</summary>
#pragma warning disable CS8614 // Nullability of reference types in type of parameter doesn't match implicitly implemented member.
#pragma warning disable CS8767 // Nullability of reference types in type of parameter doesn't match implicitly implemented member (possibly because of nullability attributes).
    public int GetHashCode(RequiredString obj)
#pragma warning restore CS8767 // Nullability of reference types in type of parameter doesn't match implicitly implemented member (possibly because of nullability attributes).
#pragma warning restore CS8614 // Nullability of reference types in type of parameter doesn't match implicitly implemented member.
        => inner.GetHashCode(obj);

    /// <summary>Simple cast to ease usage with LINQ.</summary>
    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    internal IEqualityComparer<TrimmedRequiredString?> AsTrimmed()
        => this;
}
