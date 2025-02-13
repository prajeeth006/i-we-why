#nullable enable
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.SelfExclusion;

internal sealed class SelfExclusionDetails(string? categoryId, UtcDateTime? startDate, UtcDateTime? endDate)
{
    public string? CategoryId { get; } = categoryId;
    public UtcDateTime? StartDate { get; } = startDate;
    public UtcDateTime? EndDate { get; } = endDate;
}
