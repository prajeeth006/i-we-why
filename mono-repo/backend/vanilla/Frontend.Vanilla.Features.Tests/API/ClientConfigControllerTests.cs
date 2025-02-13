using System.Collections.Generic;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.API;

public class ClientConfigControllerTests
{
    private CancellationToken ct;

    public ClientConfigControllerTests()
    {
        ct = new CancellationTokenSource().Token;
    }

    [Fact]
    public async Task Load_ShouldReturnMergedClientConfiguration()
    {
        IReadOnlyDictionary<string, object> expected = new Dictionary<string, object>
        {
            { "someConfig", new { hello = "world" } },
        };

        var configs = new Mock<IClientConfigMerger>();
        configs.Setup(c => c.GetMergedConfigAsync(ct)).Returns(Task.FromResult(expected));

        var controller = new ClientConfigController(configs.Object)
        {
            ControllerContext = new ControllerContext { HttpContext = new DefaultHttpContext() },
        };

        controller.ControllerContext.HttpContext.Request.Method = HttpMethod.Get.ToString();
        controller.ControllerContext.HttpContext.Request.Path = "/en/api/clientconfig";

        var httpActionResult = await controller.Get(ct);
        var result = httpActionResult as OkObjectResult;

        result.Should().NotBeNull();
        result?.Value.Should().BeEquivalentTo(expected);
    }

    [Fact]
    public async Task PartialLoad_ShouldReturnMergedClientConfiguration()
    {
        var names = new[] { "someConfig" };
        IReadOnlyDictionary<string, object> expected = new Dictionary<string, object>
        {
            { "someConfig", new { hello = "world" } },
        };

        var configs = new Mock<IClientConfigMerger>();
        configs.Setup(c => c.GetMergedConfigForAsync(names, ct)).Returns(Task.FromResult(expected));

        var controller = new ClientConfigController(configs.Object)
        {
            ControllerContext = new ControllerContext { HttpContext = new DefaultHttpContext() },
        };

        controller.ControllerContext.HttpContext.Request.Method = HttpMethod.Get.ToString();
        controller.ControllerContext.HttpContext.Request.Path = "/en/api/clientconfig";

        var httpActionResult = await controller.GetPartial(names, ct);
        var result = httpActionResult as OkObjectResult;

        result.Should().NotBeNull();
        result?.Value.Should().BeEquivalentTo(expected);
    }
}
