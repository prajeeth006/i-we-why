using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Diagnostics.Contracts;
using Frontend.Vanilla.Diagnostics.Contracts.Dsl;
using Frontend.Vanilla.DomainSpecificLanguage.Parsing.Lexical;
using Frontend.Vanilla.DomainSpecificLanguage.Providers;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.Diagnostics.HealthPages.Api.Dsl;

internal sealed class DslMetadataDiagnosticController : IDiagnosticApiController
{
    private readonly Task<object?> immutableResult;

    public DslMetadataDiagnosticController(IEnumerable<DslValueProvider> providers, IProviderMembers providerMembers)
    {
        var providersMetadata = providers
            .OrderBy(p => p.Name)
            .Select(p => new ProviderMetadata(
                p.Name,
                p.Documentation,
                assembly: p.ExposedType.Assembly.GetName().Name!,
                members: providerMembers.Members
                    .Where(m => m.ProviderName.Equals(p.Name))
                    .OrderBy(m => m.MemberName)
                    .Select(m => new MemberMetadata(
                        signature: m.ToString(),
                        m.Documentation,
                        m.DslType.ToString(),
                        m.Volatility.ToString(),
                        m.IsClientOnly,
                        m.ObsoleteMessage?.Value,
                        isProperty: m.Parameters.Count == 0))));

        var syntaxHints = SyntaxHint.AllHints.Select(h => new DslSyntaxHint(h.HtmlId, h.KeywordHtmls, h.Description, h.ExampleHtmls));
        immutableResult = new DslMetadataResponse(providersMetadata, syntaxHints).AsTask<object?>();
    }

    public DiagnosticsRoute GetRoute() => DiagnosticApiUrls.Dsl.Metadata;
    public Task<object?> ExecuteAsync(HttpContext c) => immutableResult;
}
