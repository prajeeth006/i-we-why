using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Diagnostics.Contracts;
using Frontend.Vanilla.Diagnostics.Contracts.Info;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.Diagnostics.HealthPages.Api.InfoPages;

internal sealed class InfoPagesOverviewController : IDiagnosticApiController
{
    private readonly Task<object?> immutableResult;

    public InfoPagesOverviewController(IEnumerable<IDiagnosticInfoProvider> providers)
    {
        var overview = providers
            .Select(p => p.Metadata)
            .OrderBy(p => p.Name)
            .Select(p => new InfoPageMetadataDto(p.UrlPathSegment, p.Name, p.ShortDescription))
            .ToList();

        immutableResult = overview.AsTask<object?>();
    }

    public DiagnosticsRoute GetRoute() => DiagnosticApiUrls.InfoPages.Overview;
    public Task<object?> ExecuteAsync(HttpContext c) => immutableResult;
}
