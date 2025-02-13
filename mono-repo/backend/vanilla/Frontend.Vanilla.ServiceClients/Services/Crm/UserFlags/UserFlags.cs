using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;
using JetBrains.Annotations;

#pragma warning disable CS1591 // Model data -> no docs needed
namespace Frontend.Vanilla.ServiceClients.Services.Crm.UserFlags;

public sealed class UserFlag(string name = null, string value = null, [CanBeNull] IEnumerable<string> reasonCodes = null)
{
    public string Name { get; } = name;
    public string Value { get; } = value;

    [CanBeNull]
    public IReadOnlyList<string> ReasonCodes { get; } = reasonCodes?.ToArray().AsReadOnly();
}

public sealed class UserFlagsResponse : IPosApiResponse<IReadOnlyList<UserFlag>>
{
    public string AccountName { get; set; }
    public IReadOnlyList<UserFlag> Flags { get; set; }
    public IReadOnlyList<UserFlag> GetData() => Flags.NullToEmpty();
}
