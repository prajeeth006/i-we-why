using System;
using System.Collections.Generic;

namespace Frontend.Vanilla.Core.System;

/// <summary>
/// Base class for equality comparers of reference types.
/// </summary>
internal abstract class ReferenceTypeEqualityComparer<T> : IEqualityComparer<T?>
    where T : class
{
    public bool Equals(T? x, T? y)
    {
        if (x == null && y == null)
            return true;

        if (x == null || y == null)
            return false;

        return EqualsCore(x, y);
    }

    public abstract bool EqualsCore(T x, T y);

#pragma warning disable CS8614 // Nullability of reference types in type of parameter doesn't match implicitly implemented member.
#pragma warning disable CS8767 // Nullability of reference types in type of parameter doesn't match implicitly implemented member (possibly because of nullability attributes).
    public abstract int GetHashCode(T obj);
#pragma warning restore CS8767 // Nullability of reference types in type of parameter doesn't match implicitly implemented member (possibly because of nullability attributes).
#pragma warning restore CS8614 // Nullability of reference types in type of parameter doesn't match implicitly implemented member.
}

/// <summary>
/// Base class for equality and common comparers of reference types.
/// </summary>
internal abstract class ComparableReferenceTypeEqualityComparer<T> : ReferenceTypeEqualityComparer<T>, IComparer<T?>
    where T : class, IComparable<T?>
{
    public sealed override bool EqualsCore(T x, T y)
        => CompareCore(x, y) == 0;

    public int Compare(T? x, T? y)
    {
        if (x == null && y == null)
            return 0;

        if (x == null)
            return -1;

        if (y == null)
            return 1;

        return CompareCore(x, y);
    }

    public abstract int CompareCore(T x, T y);
}
