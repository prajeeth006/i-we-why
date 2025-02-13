using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

#pragma warning disable CS1591 // Just dummy data -> no docs needed
namespace Frontend.Vanilla.ServiceClients.Services.Authentication.PendingActions;

public sealed class PendingActionList(bool ordered = false, IEnumerable<PendingAction> actions = null) : IPosApiResponse<PendingActionList>
{
    public bool Ordered { get; } = ordered;
    public IReadOnlyList<PendingAction> Actions { get; } = actions.NullToEmpty().ToList().AsReadOnly();

    PendingActionList IPosApiResponse<PendingActionList>.GetData() => this;
}

public sealed class PendingAction(string name, bool reactionNeeded, IEnumerable<KeyValuePair<string, string>> details)
{
    public string Name { get; } = name;
    public bool ReactionNeeded { get; } = reactionNeeded;
    public IReadOnlyDictionary<string, string> Details { get; } = details.NullToEmpty().ToDictionary().AsReadOnly();
}
