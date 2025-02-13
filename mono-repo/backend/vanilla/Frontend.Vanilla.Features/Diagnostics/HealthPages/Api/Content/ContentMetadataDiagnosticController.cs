using System.Linq;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Diagnostics.Contracts;
using Frontend.Vanilla.Diagnostics.Contracts.Content;
using Frontend.Vanilla.Features.Globalization;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.Diagnostics.HealthPages.Api.Content;

internal sealed class ContentMetadataDiagnosticController(ILanguageService languageService, IContentConfiguration contentConfig) : SyncDiagnosticApiController
{
    public override DiagnosticsRoute GetRoute() => DiagnosticApiUrls.Content.MetadataUrl;

    public override object? Execute(HttpContext httpContext)
    {
        var cultures = languageService.Allowed
            .Select(l => l.Culture)
            .OrderBy(c => c.EnglishName)
            .Select(c => new SelectItem(c, $"{c.EnglishName} - {c}"));

        var pathRelativities = new[]
        {
            new SelectItem(DocumentPathRelativity.ConfiguredRootNode, $"Configured Root Node: {contentConfig.RootNodePath}"),
            new SelectItem(DocumentPathRelativity.AbsoluteRoot, "Absolute Root: /"),
        };
        var dslEvaluations = new[]
        {
            new SelectItem(DslEvaluation.FullOnServer, "Full on Server"),
            new SelectItem(DslEvaluation.PartialForClient, "Partial for Client"),
        };

        return new ContentMetadataDto(contentConfig.Host, cultures, pathRelativities, dslEvaluations);
    }
}
