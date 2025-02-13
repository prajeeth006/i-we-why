using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.AntiForgeryProtection;
using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.ServiceClients.Services.Account;
using Frontend.Vanilla.ServiceClients.Services.Common;
using Frontend.Vanilla.ServiceClients.Services.Crm;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.AsyncDsl;

public class AsyncListDslItemRequest
{
    public string ListName { get; set; } = "";
    public string Item { get; set; } = "";
}

public class AsyncDslListItemResponse : AsyncListDslItemRequest
{
    public bool Passed { get; set; }
}

public class AsyncDslListResponse(AsyncDslListItemResponse[] data)
{
    public AsyncDslListItemResponse[] Data { get; } = data;
}

public class AsyncDslIsInGroupRequest
{
    public string Group { get; set; } = "";
}

public class AsyncDslIsInGroupResponse : AsyncDslIsInGroupRequest
{
    public bool Passed { get; set; }
}

public class AsyncDslGroupResponse(AsyncDslIsInGroupResponse[] data)
{
    public AsyncDslIsInGroupResponse[] Data { get; } = data;
}

public class AsyncDslGroupAttributeItemRequest
{
    public string GroupName { get; set; } = "";
    public string GroupAttribute { get; set; } = "";
}

public class AsyncDslGroupAttributeItemResponse : AsyncDslGroupAttributeItemRequest
{
    public string Value { get; set; } = "";
}

public class AsyncDslGroupAttributeResponse(AsyncDslGroupAttributeItemResponse[] data)
{
    public AsyncDslGroupAttributeItemResponse[] Data { get; } = data;
}

[AllowAnonymous]
[BypassAntiForgeryToken]
[Route("{culture}/api/[controller]")]
[ApiController]
public class AsyncDslController : BaseController
{
    private readonly IPosApiCommonService posApiCommonService;
    private readonly IPosApiAccountService posApiAccountService;
    private readonly IPosApiCrmServiceInternal posApiCrmService;
    private readonly ILogger log;

    public AsyncDslController(IServiceProvider c, IPosApiCommonService posApiCommonService, IPosApiAccountService posApiAccountService, ILogger<AsyncDslController> log)
        : this(posApiCommonService, posApiAccountService, c.GetRequiredService<IPosApiCrmServiceInternal>(), log) { }

    internal AsyncDslController(
        IPosApiCommonService posApiCommonService,
        IPosApiAccountService posApiAccountService,
        IPosApiCrmServiceInternal posApiCrmService,
        ILogger<AsyncDslController> log)
    {
        this.posApiCommonService = posApiCommonService;
        this.posApiAccountService = posApiAccountService;
        this.posApiCrmService = posApiCrmService;
        this.log = log;
    }

    [HttpPost("list")]
    public async Task<IActionResult> List([FromBody] IEnumerable<AsyncListDslItemRequest> request, CancellationToken cancellationToken)
    {
        var data = await Task.WhenAll(
            Enumerable.Select(request, async r =>
            {
                var result = new AsyncDslListItemResponse
                {
                    ListName = r.ListName,
                    Item = r.Item,
                };

                try
                {
                    var list = await posApiCommonService.GetListAsync(r.ListName, cancellationToken);
                    result.Passed = list.Contains(r.Item);
                }
                catch (Exception ex)
                {
                    log.LogError(ex, "AsyncDsl list failed");
                }

                return result;
            }));

        return Ok(new AsyncDslListResponse(data));
    }

    [HttpPost("group")]
    public async Task<IActionResult> SegmentationGroup([FromBody] IEnumerable<AsyncDslIsInGroupRequest> request, CancellationToken cancellationToken)
    {
        var data = await Task.WhenAll(
            request.Select(
                async r =>
                {
                    var result = new AsyncDslIsInGroupResponse
                    {
                        Group = r.Group,
                    };

                    if (User.Identity is not { IsAuthenticated: true }) return result;

                    try
                    {
                        var groups = await posApiAccountService.GetSegmentationGroupsAsync(cancellationToken);
                        result.Passed = groups.Contains(r.Group);
                    }
                    catch (Exception ex)
                    {
                        log.LogError(ex, "AsyncDsl SegmentationGroup failed");
                    }

                    return result;
                }));

        return Ok(new AsyncDslGroupResponse(data));
    }

    [HttpPost("groupattribute")]
    public async Task<IActionResult> GroupAttribute([FromBody] IEnumerable<AsyncDslGroupAttributeItemRequest> request,
        CancellationToken cancellationToken)
    {
        var data = await Task.WhenAll(
            Enumerable.Select(request, async r =>
            {
                var result = new AsyncDslGroupAttributeItemResponse()
                {
                    GroupName = r.GroupName,
                    GroupAttribute = r.GroupAttribute,
                };

                try
                {
                    var mode = ExecutionMode.Async(cancellationToken);
                    var campaigns = await posApiCrmService.GetCampaignsAsync(mode);
                    var campaign = Enumerable.FirstOrDefault(campaigns, c => c.Action == r.GroupName);

                    result.Value = campaign?.RewardAttributes.GetValue(r.GroupAttribute) ?? string.Empty;
                }
                catch (Exception ex)
                {
                    log.LogError(ex, "AsyncDsl GroupAttribute failed");
                }

                return result;
            }));

        return Ok(new AsyncDslGroupAttributeResponse(data));
    }
}
