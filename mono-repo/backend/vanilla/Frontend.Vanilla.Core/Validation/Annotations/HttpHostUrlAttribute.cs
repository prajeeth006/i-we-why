using System;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Core.Validation.Annotations.Abstract;

namespace Frontend.Vanilla.Core.Validation.Annotations;

/// <summary>
/// Verifies that the value of a property is an absolute HTTP(S) URI with no query nor fragment hence suitable for constructing child URIs.
/// </summary>
internal sealed class HttpHostUrlAttribute : ValidationAttributeBase
{
    public const string InvalidReason = "must be valid HTTP(S) URL without query and fragment";

    public override string? GetInvalidReason(object value)
        => !((Uri)value).IsHttpHost() ? InvalidReason : null;
}
