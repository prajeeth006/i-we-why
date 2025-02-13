#nullable enable

using System;
using System.Collections.Generic;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Content.Placeholders;

/// <summary>
/// Replaces content placeholders in fields of particular type.
/// </summary>
public interface IFieldPlaceholderReplacer
{
    /// <summary>
    /// Gets the field type. Only field value that are its instance will be replaced using this replacer.
    /// </summary>
    Type FieldType { get; }

    /// <summary>
    /// Collects all strings of field value that can potentially contain placeholders.
    /// Then they are replaced when needed and passed to <see cref="Recreate" /> method.
    /// </summary>
    IEnumerable<string?> GetReplaceableStrings(object value);

    /// <summary>
    /// Recreates field value using given strings with replaced placeholders.
    /// Note that <c>null</c> can't be used as a dictionary key.
    /// </summary>
    object Recreate(object value, ReplacedStringMapping replacedStrings);
}

/// <summary>
/// Placeholder replacer meant to be reused in other composite replacers.
/// </summary>
public interface IFieldPlaceholderReplacer<T>
    where T : class
{
    /// <summary>See <see cref="IFieldPlaceholderReplacer.GetReplaceableStrings" />.</summary>
    IEnumerable<string?> GetReplaceableStrings(T value);

    /// <summary>See <see cref="IFieldPlaceholderReplacer.Recreate" />.</summary>
    T Recreate(T value, ReplacedStringMapping replacedStrings);
}

/// <summary>
/// Strongly-typed implementation of <see cref="IFieldPlaceholderReplacer" />.
/// </summary>
public abstract class FieldPlaceholderReplacer<T> : IFieldPlaceholderReplacer, IFieldPlaceholderReplacer<T>
    where T : class
{
    Type IFieldPlaceholderReplacer.FieldType { get; } = typeof(T);

    IEnumerable<string?> IFieldPlaceholderReplacer.GetReplaceableStrings(object value)
        => GetReplaceableStringsInternal((T)value);

    object IFieldPlaceholderReplacer.Recreate(object value, ReplacedStringMapping replacedStrings)
        => RecreateInternal((T)value, replacedStrings);

    IEnumerable<string?> IFieldPlaceholderReplacer<T>.GetReplaceableStrings(T value)
        => GetReplaceableStringsInternal(value);

    T IFieldPlaceholderReplacer<T>.Recreate(T value, ReplacedStringMapping replacedStrings)
        => RecreateInternal(value, replacedStrings);

    private IEnumerable<string?> GetReplaceableStringsInternal(T value)
    {
        Guard.NotNull(value, nameof(value));

        return GetReplaceableStrings(value) ?? throw new Exception($"{this} returned null.");
    }

    private T RecreateInternal(T value, ReplacedStringMapping replacedStrings)
    {
        Guard.NotNull(value, nameof(value));
        Guard.NotNull(replacedStrings, nameof(replacedStrings));

        return Recreate(value, replacedStrings) ?? throw new Exception($"{this} recreated value as null.");
    }

    /// <summary>Inner implementation of <see cref="IFieldPlaceholderReplacer{T}.GetReplaceableStrings" />.</summary>
    protected abstract IEnumerable<string?> GetReplaceableStrings(T value);

    /// <summary>Inner implementation of <see cref="IFieldPlaceholderReplacer{T}.Recreate" />.</summary>
    protected abstract T Recreate(T value, ReplacedStringMapping replacedStrings);
}
