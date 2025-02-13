using System.Collections.Generic;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Account.SegmentationGroups;

/// <summary>
/// List of accounts associated with account which was migrated from other label(s).
/// </summary>
internal sealed class SegmentationGroupsResponse : IPosApiResponse<IReadOnlyList<string>>
{
    public IReadOnlyList<string> GroupNames { get; set; }
    public IReadOnlyList<string> GetData() => GroupNames.NullToEmpty();
}
