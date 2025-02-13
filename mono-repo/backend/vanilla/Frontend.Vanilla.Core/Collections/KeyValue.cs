using System.Collections.Generic;
using System.Diagnostics;
using System.Runtime.CompilerServices;

namespace Frontend.Vanilla.Core.Collections;

/// <summary>
/// Shorthand for creating a <see cref="KeyValuePair{TKey,TValue}" />.
/// </summary>
internal static class KeyValue
{
    [DebuggerStepThrough, MethodImpl(MethodImplOptions.AggressiveInlining)]
    public static KeyValuePair<TKey, TValue> Get<TKey, TValue>(TKey key, TValue value)
        => new (key, value);
}
