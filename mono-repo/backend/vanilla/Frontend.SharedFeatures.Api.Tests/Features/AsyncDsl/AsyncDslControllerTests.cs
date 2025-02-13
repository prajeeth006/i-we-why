using System.Security.Claims;
using FluentAssertions;
using Frontend.SharedFeatures.Api.Features.AsyncDsl;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Services.Account;
using Frontend.Vanilla.ServiceClients.Services.Common;
using Frontend.Vanilla.ServiceClients.Services.Crm;
using Frontend.Vanilla.ServiceClients.Services.Crm.CampaignDatas;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.SharedFeatures.Api.Tests.Features.AsyncDsl;

public class AsyncDslControllerTests
{
    private readonly AsyncDslController controller;
    private readonly Mock<IPosApiCommonService> posApiCommonService;
    private readonly Mock<IPosApiAccountService> posApiAccountService;
    private readonly Mock<ClaimsPrincipal> user;
    private readonly Mock<IPosApiCrmServiceInternal> posApiCrmServiceInternal;
    private readonly TestLogger<AsyncDslController> log;
    private readonly CancellationToken ct;

    public AsyncDslControllerTests()
    {
        posApiCommonService = new Mock<IPosApiCommonService>();
        posApiAccountService = new Mock<IPosApiAccountService>();
        log = new TestLogger<AsyncDslController>();
        user = new Mock<ClaimsPrincipal>();
        posApiCrmServiceInternal = new Mock<IPosApiCrmServiceInternal>();
        ct = new CancellationTokenSource().Token;

        controller = new AsyncDslController(posApiCommonService.Object, posApiAccountService.Object, posApiCrmServiceInternal.Object, log)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = user.Object },
            },
        };
    }

    [Fact]
    public async Task List_ShouldCheckIfSpecifiedItemsExistInSpecifiedLists()
    {
        posApiCommonService.Setup(s => s.GetListAsync("testList", ct)).ReturnsAsync(new List<string> { "bli", "bla" });
        posApiCommonService.Setup(s => s.GetListAsync("testList2", ct)).ReturnsAsync(new List<string>());

        var request = new List<AsyncListDslItemRequest>
        {
            new AsyncListDslItemRequest { ListName = "testList", Item = "bla" },
            new AsyncListDslItemRequest { ListName = "testList2", Item = "ble" },
        };

        var result = (OkObjectResult)await controller.List(request, ct);
        var response = (AsyncDslListResponse)result.Value!;

        response.Data[0].Passed.Should().BeTrue();
        response.Data[0].ListName.Should().Be("testList");
        response.Data[0].Item.Should().Be("bla");

        response.Data[1].Passed.Should().BeFalse();
        response.Data[1].ListName.Should().Be("testList2");
        response.Data[1].Item.Should().Be("ble");
    }

    [Fact]
    public async Task GroupAttribute_ShouldCheckIfSpecifiedItemsExistInSpecifiedLists()
    {
        posApiCrmServiceInternal.Setup(s => s.GetCampaignsAsync(It.IsAny<ExecutionMode>())).ReturnsAsync(new List<CampaignData>()
        {
            new (action: "test", rewardAttributes: new KeyValuePair<string, string>[]
            {
                new ("reward1", "value1"),
                new ("reward2", "value2"),
            }),
        });

        var request = new List<AsyncDslGroupAttributeItemRequest>
        {
            new AsyncDslGroupAttributeItemRequest { GroupName = "test", GroupAttribute = "reward1" },
            new AsyncDslGroupAttributeItemRequest { GroupName = "test", GroupAttribute = "reward21" },
        };

        var result = (OkObjectResult)await controller.GroupAttribute(request, ct);
        var response = (AsyncDslGroupAttributeResponse)result.Value!;

        response.Data[0].Value.Should().Be("value1");
        response.Data[0].GroupName.Should().Be("test");
        response.Data[0].GroupAttribute.Should().Be("reward1");

        response.Data[1].Value.Should().Be("");
        response.Data[1].GroupName.Should().Be("test");
        response.Data[1].GroupAttribute.Should().Be("reward21");
    }

    [Fact]
    public async Task List_SetPassedToFalseInCaseOfAnExceptionAndLogAnError()
    {
        var ex = new Exception();
        posApiCommonService.Setup(s => s.GetListAsync("testList", ct)).ReturnsAsync(new List<string> { "bli", "bla" });
        posApiCommonService.Setup(s => s.GetListAsync("testList2", ct)).ThrowsAsync(ex);

        var request = new List<AsyncListDslItemRequest>
        {
            new AsyncListDslItemRequest { ListName = "testList", Item = "bla" },
            new AsyncListDslItemRequest { ListName = "testList2", Item = "ble" },
        };

        var result = (OkObjectResult)await controller.List(request, ct);
        var response = (AsyncDslListResponse)result.Value!;

        response.Data[0].Passed.Should().BeTrue();
        response.Data[0].ListName.Should().Be("testList");
        response.Data[0].Item.Should().Be("bla");

        response.Data[1].Passed.Should().BeFalse();
        response.Data[1].ListName.Should().Be("testList2");
        response.Data[1].Item.Should().Be("ble");

        log.Logged.Single().Verify(LogLevel.Error, ex);
    }

    [Fact]
    public async Task SegmentationGroup_ShouldCheckIfUserIsInSpecifiedGroups()
    {
        user.SetupGet(u => u.Identity!.IsAuthenticated).Returns(true);
        posApiAccountService.Setup(s => s.GetSegmentationGroupsAsync(ct)).ReturnsAsync(new[] { "bli", "bla" });

        var request = new List<AsyncDslIsInGroupRequest>
        {
            new AsyncDslIsInGroupRequest { Group = "bla" },
            new AsyncDslIsInGroupRequest { Group = "ble" },
        };

        var result = (OkObjectResult)await controller.SegmentationGroup(request, ct);
        var response = (AsyncDslGroupResponse)result.Value!;

        response.Data[0].Passed.Should().BeTrue();
        response.Data[0].Group.Should().Be("bla");

        response.Data[1].Passed.Should().BeFalse();
        response.Data[1].Group.Should().Be("ble");
    }

    [Fact]
    public async Task SegmentationGroup_ShouldSetPassedToFalseAndLogErrorInCaseOfException()
    {
        var ex = new Exception();
        user.SetupGet(u => u.Identity!.IsAuthenticated).Returns(true);
        posApiAccountService.Setup(s => s.GetSegmentationGroupsAsync(ct)).ThrowsAsync(ex);

        var request = new List<AsyncDslIsInGroupRequest>
        {
            new AsyncDslIsInGroupRequest { Group = "bla" },
            new AsyncDslIsInGroupRequest { Group = "ble" },
        };

        var result = (OkObjectResult)await controller.SegmentationGroup(request, ct);
        var response = (AsyncDslGroupResponse)result.Value!;

        response.Data[0].Passed.Should().BeFalse();
        response.Data[0].Group.Should().Be("bla");

        response.Data[1].Passed.Should().BeFalse();
        response.Data[1].Group.Should().Be("ble");

        log.Logged.Should().HaveCount(2);
        log.Logged[0].Verify(LogLevel.Error, ex);
        log.Logged[1].Verify(LogLevel.Error, ex);
    }
}
