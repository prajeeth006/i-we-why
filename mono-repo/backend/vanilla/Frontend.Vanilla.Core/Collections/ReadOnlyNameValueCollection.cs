using System;
using System.Collections.Specialized;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Core.Collections;

/// <summary>
/// Read-only wrapper for <see cref="NameValueCollection"/>.
/// </summary>
[Serializable]
public sealed class ReadOnlyNameValueCollection : NameValueCollection
{
    /// <summary>
    /// Gets an immutable <see cref="NameValueCollection"/> that contains no entries.
    /// </summary>
    public static readonly ReadOnlyNameValueCollection Empty = new (new NameValueCollection());

    /// <summary>
    /// Initializes a new instance of the <see cref="ReadOnlyNameValueCollection"/> class.
    /// </summary>
    /// <param name="collectionToCopy">The collection to copy its items.</param>
    public ReadOnlyNameValueCollection(NameValueCollection collectionToCopy)
        : base(collectionToCopy)
    {
        Guard.NotNull(collectionToCopy, nameof(collectionToCopy));
        IsReadOnly = true;
    }
}
