using System.Collections.Generic;
using Frontend.Vanilla.Diagnostics.Contracts.Dsl;
using Microsoft.AspNetCore.Components;

namespace Frontend.Vanilla.Diagnostics.App.Pages.Dsl;

public abstract class DslProvidersDocumentationComponent : ComponentBase
{
    [Parameter]
    public IReadOnlyList<ProviderMetadata> ProvidersMetadata { get; set; }

    [Parameter]
    public IReadOnlyDictionary<string, ProviderMemberValue> ProvidersValues { get; set; }

    protected static string GetVolatilityDescription(string volatility)
        => volatility switch
        {
            "Static" => "Value doesn't ever change. It's evaluated already during compilation.Usually it's static configuration value of the app."
                        + " This has totally the best performance.",
            "Client" => "Value can change anytime thus should be evaluated on client browser in the single page application."
                        + " This introduced additional overhead but gives the best user experience.",
            "Server" => "Value can change between full page requests but doesn't change during lifetime of the single page application."
                        + " This guarantees good performance e.g.content is already filtered on server and doesn't even get transferred to client browser.",
            _ => "Unknown volatility. Ask Vanilla developers to add its description.",
        };

    protected static string GetDslTypeDescription(string dslType)
        => dslType == "Void"
            ? "Can be used only as a statement in a DSL action."
            : "Can be used anywhere expect as a statement in a DSL action.";
}
