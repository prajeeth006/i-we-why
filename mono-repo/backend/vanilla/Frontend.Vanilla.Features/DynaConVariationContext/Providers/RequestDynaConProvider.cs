using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.Features.DynaConVariationContext.Providers;

/// <summary>
/// Provides information if request is internal or external.
/// </summary>
internal sealed class RequestDynaConProvider(IInternalRequestEvaluator requestEvaluator) : IWebDynaConVariationContextProvider
{
    public TrimmedRequiredString Name { get; } = "Request";
    public TrimmedRequiredString DefaultValue { get; } = RequestTypes.External;

    public string GetCurrentRawValue()
    {
        return requestEvaluator.IsInternal() ? RequestTypes.Internal : RequestTypes.External;
    }
}

internal static class RequestTypes
{
    public const string External = "External";
    public const string Internal = "Internal";
}
