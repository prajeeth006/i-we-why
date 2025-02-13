using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Features.Json.ActionResults;
using Frontend.Vanilla.Features.Messages;
using Frontend.Vanilla.Testing.Fakes;
using Newtonsoft.Json.Linq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Json.ActionResults;

public class MessagesResponseBodyExtensionsWriterTests
{
    private CancellationToken ct;
    private JObject body;

    public MessagesResponseBodyExtensionsWriterTests()
    {
        body = new JObject();
        body["hello"] = "world";
        ct = TestCancellationToken.Get();
    }

    private void VerifyMessage(string type, string msg, string lifetime = "Single", int index = 0, string scope = "")
    {
        var messages = (JArray)body["vnMessages"]!;

        ((string)messages[index]["type"]!).Should().Be(type);
        ((string)messages[index]["html"]!).Should().Be(msg);
        ((string)messages[index]["lifetime"]!).Should().Be(lifetime);
        ((string)messages[index]["scope"]!).Should().Be(scope);
        ((string)body["hello"]!).Should().Be("world");
    }

    [Fact]
    public async Task ShouldWriteErrorMessage()
    {
        var writer = new MessagesResponseBodyExtensionWriter(new List<ApiMessage> { new ApiMessage(MessageType.Error, "e") });

        await writer.Write(body, null!, ct);

        VerifyMessage("Error", "e");
    }

    [Fact]
    public async Task ShouldWriteMessageWithSpecifiedLifetime()
    {
        var writer = new MessagesResponseBodyExtensionWriter(new List<ApiMessage>
            { new ApiMessage(MessageType.Warning, "w", ApiMessageLifetime.TempData, string.Empty) });

        await writer.Write(body, null!, ct);

        VerifyMessage("Warning", "w", "TempData");
    }

    [Fact]
    public async Task ShouldWriteWarningMessage()
    {
        var writer = new MessagesResponseBodyExtensionWriter(new List<ApiMessage> { new ApiMessage(MessageType.Warning, "w") });

        await writer.Write(body, null!, ct);

        VerifyMessage("Warning", "w");
    }

    [Fact]
    public async Task ShouldWriteInfoMessage()
    {
        var writer = new MessagesResponseBodyExtensionWriter(new List<ApiMessage> { new ApiMessage(MessageType.Information, "i") });

        await writer.Write(body, null!, ct);

        VerifyMessage("Information", "i");
    }

    [Fact]
    public async Task ShouldWriteSuccessMessage()
    {
        var writer = new MessagesResponseBodyExtensionWriter(new List<ApiMessage> { new ApiMessage(MessageType.Success, "s") });

        await writer.Write(body, null!, ct);

        VerifyMessage("Success", "s");
    }

    [Fact]
    public async Task ShouldWriteMessageWithSpecifiedScope()
    {
        var writer = new MessagesResponseBodyExtensionWriter(new List<ApiMessage> { new ApiMessage(MessageType.Warning, "w", scope: "scope") });

        await writer.Write(body, null!, ct);

        VerifyMessage("Warning", "w", scope: "scope");
    }
}
