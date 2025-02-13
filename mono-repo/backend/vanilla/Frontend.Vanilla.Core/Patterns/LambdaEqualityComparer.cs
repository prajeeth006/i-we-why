using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Core.Patterns;

/// <summary>
/// Provides an extensible <see cref="IEqualityComparer{T}"/> implementation based on lambda functions.
/// </summary>
/// <typeparam name="T">The type of items that can be compared.</typeparam>
public sealed class LambdaEqualityComparer<T> : IEqualityComparer<T>
{
    private readonly Func<T?, T?, bool> equalsFunc;
    private readonly Func<T, int> hashCodeFunc;

    /// <summary>
    /// Determines whether the specified objects are equal.
    /// </summary>
    /// <param name="x">The first object of type <typeparamref name="T"/> to compare.</param>
    /// <param name="y">The second object of type <typeparamref name="T"/> to compare.</param>
    /// <returns>
    /// <see langword="true"/> if the specified objects are equal; otherwise, <see langword="false"/>.
    /// </returns>
    public bool Equals(T? x, T? y)
    {
        return equalsFunc(x, y);
    }

    /// <summary>
    /// Returns a hash code for this instance.
    /// </summary>
    /// <param name="obj">The object for which a hash code is to be returned.</param>
    /// <returns>
    /// A hash code for the specified object.
    /// </returns>
    public int GetHashCode([DisallowNull] T obj)
    {
        return hashCodeFunc(obj);
    }

    /// <summary>
    /// Initializes a new instance of the <see cref="LambdaEqualityComparer{T}"/> class.
    /// </summary>
    /// <param name="equalsFunc">The equals func.</param>
    /// <param name="hashCodeFunc">The hash code func.</param>
    public LambdaEqualityComparer(Func<T?, T?, bool>? equalsFunc, Func<T, int>? hashCodeFunc = null)
    {
        this.equalsFunc = equalsFunc ?? EqualityComparer<T>.Default.Equals;
        this.hashCodeFunc = hashCodeFunc ?? (arg => EqualityComparer<T>.Default.GetHashCode(arg!));
    }
}

/// <summary>
/// Provides an extensible <see cref="IEqualityComparer{T}"/> implementation based on lambda functions.
/// </summary>
/// <typeparam name="T">The type of items that can be compared.</typeparam>
/// <typeparam name="TValue">The type of the value used for equality testing, which can
/// be a member of objects under comparison.</typeparam>
/// <example><code><![CDATA[
///     public class MyItem {
///         public int MyProperty { get; set; }
///     }
///
///     public static class Program {
///         public static void Main(string[] args) {
///             IEnumerable<MyItem> items = ... // get this from somewhere
///
///             // filter the sequence of items so that only distinct items (according to MyProperty value) are retained
///             var distinctByMyProperty = items.Distinct(new LambdaEqualityComparer<MyItem, int>(item => item.MyProperty));
///         }
///     }
/// ]]></code></example>
public sealed class LambdaEqualityComparer<T, TValue> : IEqualityComparer<T>
{
    private readonly Func<T, TValue> memberSelector;

    /// <summary>
    /// Determines whether the specified objects are equal.
    /// </summary>
    /// <param name="x">The first object of type <typeparamref name="T"/> to compare.</param>
    /// <param name="y">The second object of type <typeparamref name="T"/> to compare.</param>
    /// <returns>
    /// <see langword="true"/> if the specified objects are equal; otherwise, <see langword="false"/>.
    /// </returns>
    public bool Equals(T? x, T? y)
    {
        return EqualityComparer<TValue>.Default.Equals(memberSelector(x!), memberSelector(y!));
    }

    /// <summary>
    /// Returns a hash code for this instance.
    /// </summary>
    /// <param name="obj">The object for which a hash code is to be returned.</param>
    /// <returns>
    /// A hash code for the specified object.
    /// </returns>
    public int GetHashCode([DisallowNull] T obj)
    {
        return EqualityComparer<TValue>.Default.GetHashCode(memberSelector(obj)!);
    }

    /// <summary>
    /// Initializes a new instance of the <see cref="LambdaEqualityComparer{T, TValue}"/> class.
    /// </summary>
    /// <param name="memberSelector">A function that selects the member (or expression) to be used
    /// for equality comparison (e.g. <c>item => item.Property</c>).</param>
    public LambdaEqualityComparer(Func<T, TValue> memberSelector)
    {
        Guard.NotNull(memberSelector, nameof(memberSelector));
        this.memberSelector = memberSelector;
    }
}
