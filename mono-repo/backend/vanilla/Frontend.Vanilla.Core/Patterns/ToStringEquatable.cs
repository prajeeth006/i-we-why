using System;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Core.Patterns;

/// <summary>
/// Offers implementations of <see cref="IEquatable{T}" />, <see cref="IComparable" /> and
/// <see cref="IComparable{T}" /> based on the result of calling <see cref="object.ToString()"/>,
/// thus enabling string-based equality/comparison testing and sorting.
/// </summary>
/// <typeparam name="T">The type.</typeparam>
/// <example><code><![CDATA[
///     public class MyClass : ToStringEquatable<MyClass> {
///         public override string ToString() {
///             // define a string view of your class, and you get equality and comparison based on these string values
///         }
///     }
/// ]]></code></example>
public abstract class ToStringEquatable<T> : IEquatable<T>, IComparable, IComparable<T>
    where T : class
{
    /// <summary>
    /// This is static for a very specific reason, it is not shared between different closed types of ToStringEquatable and can be set
    /// for each closed type in a static constructor of its type to something different.
    /// </summary>
    // ReSharper disable StaticFieldInGenericType
    public static StringComparison Comparison
    {
        get => comparison;
        protected set
        {
            comparison = Guard.DefinedEnum(value, nameof(value));
            isCaseSensitive = value.EqualsAny(StringComparison.CurrentCulture, StringComparison.Ordinal, StringComparison.InvariantCulture);
        }
    }

    private static StringComparison comparison = StringComparison.Ordinal;
    private static bool isCaseSensitive = true;

    // ReSharper restore StaticFieldInGenericType

    /// <summary>
    /// See <see cref="IComparable.CompareTo" />.
    /// </summary>
    public int CompareTo(object? other)
        => CompareTo((T?)other);

    /// <summary>
    /// See <see cref="IComparable{T}.CompareTo(T)" />.
    /// </summary>
    public int CompareTo(T? other)
        => string.Compare(ToString(), other?.ToString(), comparison);

    /// <summary>
    /// See <see cref="object.Equals(object)" />.
    /// </summary>
    public override bool Equals(object? other)
        => other is T typed && Equals(typed);

    /// <summary>
    /// See <see cref="IEquatable{T}.Equals(T)" />.
    /// </summary>
    public bool Equals(T? other)
        => other != null && ToString().Equals(other.ToString(), comparison);

    /// <summary>
    /// See <see cref="object.ToString" />.
    /// </summary>
    public abstract override string ToString();

    /// <summary>
    /// See <see cref="object.GetHashCode" />.
    /// </summary>
    public override int GetHashCode()
    {
        // ReSharper disable once NonReadonlyMemberInGetHashCode
        var str = isCaseSensitive ? ToString() : ToString()?.ToLowerInvariant();

        return str?.GetHashCode() ?? 0;
    }
}
