using System.Linq;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.Features.Cookies;

internal sealed class CookiesDiagnosticProvider(ICookieConfiguration config) : SyncDiagnosticInfoProvider
{
    public override DiagnosticInfoMetadata Metadata { get; } = new (
        name: "Cookies",
        urlPath: "cookies",
        shortDescription: "Shows default cookie options.");

    public override object GetDiagnosticInfo()
        => new
        {
            Defaults = new
            {
                config.CurrentLabelDomain,
                config.Secure,
            },
        };
}
