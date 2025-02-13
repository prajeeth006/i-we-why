using Frontend.Vanilla.Core.IO;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Validation.Annotations.Abstract;

namespace Frontend.Vanilla.Core.Validation.Annotations;

/// <summary>
/// Verifies that the value of a property is rooted filesystem path.
/// </summary>
internal sealed class RootedPathAttribute : ValidationAttributeBase
{
    public override string? GetInvalidReason(object value)
    {
        var reason = RootedPath.GetInvalidReason((string)value);

        return reason.IfNotNull(r => $"must be {RootedPath.MustBe} but it {r}");
    }
}
