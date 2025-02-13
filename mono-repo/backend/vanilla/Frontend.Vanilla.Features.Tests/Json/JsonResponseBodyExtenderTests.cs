#nullable enable
using System.Collections.Generic;
using System.Threading;
using FluentAssertions;
using Frontend.Vanilla.Features.Json;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Http;
using Moq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Json;

public class JsonResponseBodyExtenderTests
{
    private readonly IJsonResponseBodyExtender extender;
    private readonly Mock<HttpContext> httpContext;
    private readonly Mock<IHttpContextAccessor> httpContextAccessor;
    private readonly Mock<IJsonResponseBodyExtensionWriter> writer1;
    private readonly Mock<IJsonResponseBodyExtensionWriter> writer2;
    private readonly IDictionary<object, object?> items;
    private readonly CancellationToken ct;

    public JsonResponseBodyExtenderTests()
    {
        items = new Dictionary<object, object?>();
        httpContextAccessor = new Mock<IHttpContextAccessor>();
        httpContext = new Mock<HttpContext>();
        httpContextAccessor.SetupGet(a => a.HttpContext).Returns(httpContext.Object);
        httpContext.SetupGet(c => c.Items).Returns(items);
        writer1 = new Mock<IJsonResponseBodyExtensionWriter>();
        writer2 = new Mock<IJsonResponseBodyExtensionWriter>();
        ct = TestCancellationToken.Get();

        extender = new JsonResponseBodyExtender(httpContextAccessor.Object);
    }

    [Fact]
    public void AddForThisRequest_ShouldStoreWritersInHttpContext()
    {
        extender.AddForThisRequest(writer1.Object);
        extender.AddForThisRequest(writer2.Object);

        var writers = (List<IJsonResponseBodyExtensionWriter>)items[JsonResponseBodyExtender.RequestKey]!;
        writers.Should().ContainInOrder(writer1.Object, writer2.Object);
    }

    [Fact]
    public void Extend_ShouldExecuteWriters()
    {
        extender.AddForThisRequest(writer1.Object);
        extender.AddForThisRequest(writer2.Object);

        var serializer = new JsonSerializer();
        var body = new JObject();

        extender.Extend(body, serializer, ct);

        writer1.Verify(w => w.Write(body, serializer, ct));
        writer2.Verify(w => w.Write(body, serializer, ct));
    }
}
