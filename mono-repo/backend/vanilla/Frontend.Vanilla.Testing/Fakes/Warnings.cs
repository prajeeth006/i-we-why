using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.Testing.Fakes;

internal static class Warnings
{
    [SuppressMessage("ReSharper", "SA1401", Justification = "Used for out parameters.")]
    public static IReadOnlyList<TrimmedRequiredString> Empty = new List<TrimmedRequiredString>();

    public static IReadOnlyList<TrimmedRequiredString> Get(params string[] warnings)
    {
        return warnings.Select(w => new TrimmedRequiredString(w)).ToList();
    }
}
