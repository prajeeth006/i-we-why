using System;

namespace Frontend.Vanilla.Core.Collections;

/// <summary>
/// Used especially in tests to check that check was raised with particular value config detected.
/// </summary>
internal sealed class DuplicateException(object? conflictingValue, string message) : Exception(message)
{
    public object? ConflictingValue { get; } = conflictingValue;
}
