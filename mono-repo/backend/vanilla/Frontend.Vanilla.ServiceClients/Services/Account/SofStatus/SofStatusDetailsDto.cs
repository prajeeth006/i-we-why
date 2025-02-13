using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.ServiceClients.Services.Account.SofStatus;

internal sealed class SofStatusDetails(string sofStatus = null, int redStatusDays = -1)
{
    public string SofStatus { get; } = sofStatus;
    public int RedStatusDays { get; } = redStatusDays;
}

internal sealed class SofStatusDetailsDto(string sofStatus = null, UtcDateTime? redStatusStartDate = null)
{
    public string SofStatus { get; } = sofStatus;
    public UtcDateTime? RedStatusStartDate { get; } = redStatusStartDate;
}
