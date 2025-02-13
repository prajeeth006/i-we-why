using System;
using System.Collections.Concurrent;
using System.Collections.Generic;

namespace Frontend.Vanilla.Core.Ioc;

/// <summary>
/// Resolves context specific variables. Context can be static, HttpContext, some other scope...
/// </summary>
internal interface ICurrentContextAccessor
{
    /// <summary>Gets a dictionary for storing values for current context.</summary>
    ConcurrentDictionary<object, Lazy<object?>> Items { get; }
}

internal sealed class StaticContextAccessor : ICurrentContextAccessor
{
    public ConcurrentDictionary<object, Lazy<object?>> Items { get; set; } = new ConcurrentDictionary<object, Lazy<object?>>();
}
