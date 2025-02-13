namespace Frontend.Vanilla.Core.System.Uris;

/// <summary>
/// Strategy to provide different options when adding query string values.
/// </summary>
public enum QueryStringDuplicateHandling
{
    /// <summary>
    /// Use values from both original query string and new values.
    ///
    /// Example:
    /// Original: ?a=1&amp;b=2
    /// Add: (a, 3)
    /// Result: ?a=1&amp;a=3&amp;b=2
    /// </summary>
    Merge = 0,

    /// <summary>
    /// Use values from new values.
    ///
    /// Example:
    /// Original: ?a=1&amp;b=2
    /// Add: (a, 3)
    /// Result: ?a=3&amp;b=2
    /// </summary>
    PreferNew = 1,

    /// <summary>
    /// Use values from new values.
    ///
    /// Example:
    /// Original: ?a=1&amp;b=2
    /// Add: (a, 3)
    /// Result: ?a=1&amp;b=2
    /// </summary>
    PreferOriginal = 2,
}
