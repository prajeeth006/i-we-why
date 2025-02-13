using System;
using System.Linq;
using Frontend.Vanilla.Configuration.DynaCon.Context;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.WebAbstractions;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.LabelResolution;

internal interface ILabelResolver
{
    LabelResolutionMode Mode { get; }
    string Get();
    string Get(LabelResolutionMode mode);
}

internal sealed class LabelResolver(IHttpContextAccessor httpContextAccessor, ICurrentContextHierarchy currentContextHierarchy) : ILabelResolver
{
    public const string Label = "Label";
    public const string LabelRequestHeader = "X-Label";
    public static readonly string? LabelResolutionEnvironmentVariableValue = Environment.GetEnvironmentVariable("VANILLA_LABEL_RESOLUTION");

    public LabelResolutionMode Mode { get; } = LabelResolutionEnvironmentVariableValue is null ? LabelResolutionMode.HostnameEnd : Enum.Parse<LabelResolutionMode>(LabelResolutionEnvironmentVariableValue);

    public string Get()
        => Get(Mode);

    public string Get(LabelResolutionMode mode)
    {
        var context = httpContextAccessor.GetRequiredHttpContext();

        return context.Request.Headers.TryGetValue(LabelRequestHeader, out var labelRequestHeaderValue) ? labelRequestHeaderValue.ToString() : Get(mode, context.Request.Host.Host);
    }

    private string Get(LabelResolutionMode mode, string value)
    {
        var definedLabels = currentContextHierarchy.Value.Hierarchy.GetValue(Label)?.Keys
            .OrderByDescending(l => l.Length) // Order so that sh.bwin.de is tested before bwin.de
            .ToList();

        if (definedLabels.IsNullOrEmpty())
            throw new Exception("No labels are provided in variation context hierarchy from DynaCon/fallback file. Check the source.");

        var label = definedLabels.FirstOrDefault(l =>
            mode == LabelResolutionMode.HostnameEnd
                ? value.EndsWithIgnoreCase(l)
                : value.StartsWithIgnoreCase(l));

        return label ?? throw new Exception(string.Join(Environment.NewLine,
            $"Unable to determine label using mode '{mode}' with value {value} and list of defined labels: {definedLabels.Select(l => $"'{l}'").Join()}.",
            "Most likely:",
            "1) The hostname was incorrectly routed to this app -> network routing should be fixed.",
            "2) The list of labels is outdated -> desired label should be added to variation context values in DynaCon so that then it can be fetched by Vanilla.",
            "3) Future changeset with desired label is already scheduled, see /health/config -> next time the label shouldn't be routed until configuration is propagated.",
            "4) If hostname is 127.0.0.1 then label property or some config may have been accessed during app startup which is forbidden. It should be evaluated dynamically."));
    }
}
