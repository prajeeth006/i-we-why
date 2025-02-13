namespace Frontend.Vanilla.Core.System;

/// <summary>
/// Simple value wrapper for general use.
/// </summary>
public sealed class Wrapper<T>
{
    /// <summary>Gets wrapped value.</summary>
    public T Value { get; }

    /// <summary>Creates a new instance.</summary>
    public Wrapper(T value)
        => Value = value;

    /// <summary>Creates a <see cref="Wrapper{T}" /> implicitly.</summary>
    public static implicit operator Wrapper<T>(T value)
        => new Wrapper<T>(value);

    /// <summary>Gets <see cref="Value" /> implicitly.</summary>
    public static implicit operator T(Wrapper<T> wrapper)
        => wrapper.Value;

    /// <summary>Returns info about <see cref="Value" />.</summary>
    public override string ToString()
        => "Wrapped: " + Value;
}
