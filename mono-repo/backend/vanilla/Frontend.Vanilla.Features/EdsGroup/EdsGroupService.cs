using System.Collections.Generic;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Notification;
using Frontend.Vanilla.ServiceClients.Services.Notification.EdsGroup;

namespace Frontend.Vanilla.Features.EdsGroup;

internal interface IEdsGroupService
{
    Task<string> OptInAsync(ExecutionMode executionMode, EdsGroupOptInRequest request);
}

internal sealed class EdsGroupService(IPosApiNotificationService posApiNotificationService) : IEdsGroupService
{
    private static readonly IDictionary<int, string> PosApiErrorMapper = new Dictionary<int, string>()
    {
        { 418, "ERROR" },
        { 419, "INVALID" },
        { 420, "EXPIRED" },
        { 421, "INVALID" },
        { 422, "NOT-OFFERED" },
        { 423, "OPTINS-EXCEEDED" },
        { 424, "INCOMPLETE" },
        { 500, "ERROR" },
    };

    public async Task<string> OptInAsync(ExecutionMode mode, EdsGroupOptInRequest request)
    {
        try
        {
            var optIn = await posApiNotificationService.UpdateEdsGroupStatusAsync(mode, request);

            return optIn.OptinStatus ? "OPTED-IN" : "OPTED-OUT";
        }
        catch (PosApiException posApiException)
        {
            return PosApiErrorMapper.ContainsKey(posApiException.PosApiCode)
                ? PosApiErrorMapper[posApiException.PosApiCode]
                : PosApiErrorMapper[500];
        }
    }
}
