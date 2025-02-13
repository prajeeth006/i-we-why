using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Diagnostics.Contracts;
using Frontend.Vanilla.Diagnostics.Contracts.Dsl;
using Frontend.Vanilla.DomainSpecificLanguage.Providers;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;

namespace Frontend.Vanilla.Features.Diagnostics.HealthPages.Api.Dsl;

internal sealed class DslProviderValuesDiagnosticController(IProviderMembers providerMembers) : IDiagnosticApiController
{
    public DiagnosticsRoute GetRoute() => DiagnosticApiUrls.Dsl.ProvidersValues;

    public async Task<object?> ExecuteAsync(HttpContext httpContext)
    {
        var data = await Task.WhenAll(providerMembers.Members
            .Where(m => m.Parameters.Count == 0 && !m.IsClientOnly &&
                        !m.SkipInitialValueGetOnDslPage) // We don't have args to evaluated funcs and client-side would throw anyway
            .Select(m => GetProviderValueAsync(m, httpContext.RequestAborted)));

        return data.ToDictionary();
    }

    private static async Task<(string, ProviderMemberValue)> GetProviderValueAsync(ProviderMember member, CancellationToken cancellationToken)
    {
        ProviderMemberValue dto;

        try
        {
            var value = await member.ValueAccessor.Invoke(ExecutionMode.Async(cancellationToken), Array.Empty<object>());
            dto = new ProviderMemberValue(valueJson: JsonConvert.ToString(value ?? string.Empty));
        }
        catch (Exception ex)
        {
            dto = new ProviderMemberValue(error: ex.GetMessageIncludingInner());
        }

        return (member.ToString(), dto);
    }
}
