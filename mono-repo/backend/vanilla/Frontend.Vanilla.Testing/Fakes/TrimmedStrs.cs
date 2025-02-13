using System;
using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.Testing.Fakes;

/// <summary>
///     Helper for convenient handling of <see cref="TrimmedRequiredString" /> in unit tests.
/// </summary>
internal static class TrimmedStrs
{
    public static readonly TrimmedRequiredString[] Empty = Array.Empty<TrimmedRequiredString>();

    public static List<TrimmedRequiredString> AsTrimmed(this IEnumerable<string> strs)
    {
        return strs.Select(s => new TrimmedRequiredString(s)).ToList();
    }
}
