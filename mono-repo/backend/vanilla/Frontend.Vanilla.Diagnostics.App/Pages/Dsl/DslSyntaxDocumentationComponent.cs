using System.Collections.Generic;
using Frontend.Vanilla.Diagnostics.Contracts.Dsl;
using Microsoft.AspNetCore.Components;

namespace Frontend.Vanilla.Diagnostics.App.Pages.Dsl;

public abstract class DslSyntaxDocumentationComponent : ComponentBase
{
    [Parameter]
    public IReadOnlyList<DslSyntaxHint> SyntaxHints { get; set; }
}
