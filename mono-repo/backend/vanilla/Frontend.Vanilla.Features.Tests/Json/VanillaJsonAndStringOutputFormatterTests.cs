using System;
using System.Buffers;
using System.IO;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Features.Json;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Formatters;
using Moq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Json;

public class VanillaJsonAndStringOutputFormatterTests
{
    private class Model(string hello)
    {
        public string Hello { get; } = hello;
    }

    private readonly VanillaJsonAndStringOutputFormatter formatter;
    private readonly Mock<IJsonResponseBodyExtender> jsonResponseBodyExtender;
    private readonly Mock<HttpContext> httpContext;
    private readonly Func<Stream, Encoding, TextWriter> writerFactory;
    private readonly TextWriter writer;
    private readonly Model model;
    private readonly Stream responseStream;
    private readonly Encoding selectedEncoding;
    private readonly CancellationToken ct;

    public VanillaJsonAndStringOutputFormatterTests()
    {
        jsonResponseBodyExtender = new Mock<IJsonResponseBodyExtender>();
        writer = new StringWriter();
        httpContext = new Mock<HttpContext>();
        responseStream = new MemoryStream();
        httpContext.SetupGet(c => c.Response.Body).Returns(responseStream);
        selectedEncoding = Encoding.UTF8;
        ct = TestCancellationToken.Get();
        httpContext.SetupGet(c => c.RequestAborted).Returns(ct);
        writerFactory = (stream, encoding) =>
        {
            if (stream == responseStream && encoding.EncodingName == selectedEncoding.EncodingName)
            {
                return writer;
            }

            throw new Exception();
        };
        model = new Model("World");

        formatter = new VanillaJsonAndStringOutputFormatter(
            new JsonSerializerSettings(),
            ArrayPool<char>.Create(),
            new MvcOptions(),
            jsonResponseBodyExtender.Object,
            null);

        jsonResponseBodyExtender
            .Setup(e => e.Extend(It.IsAny<JObject>(), It.IsAny<JsonSerializer>(), ct))
            .Callback<JObject, JsonSerializer, CancellationToken>((body, _, _) => body["extended"] = true)
            .Returns(Task.CompletedTask);
    }

    [Fact]
    public async Task ShouldConvertToJsonAndRunExtenders()
    {
        var context = new OutputFormatterWriteContext(httpContext.Object, writerFactory, typeof(Model), model);

        await formatter.WriteResponseBodyAsync(context, selectedEncoding);

        var response = writer.ToString();
        var json = JObject.Parse(response!);
        ((string)json["Hello"]!).Should().Be("World");
        ((bool)json["extended"]!).Should().BeTrue();
    }

    [Fact]
    public async Task ShouldWorkWhenObjectIsString()
    {
        const string response = "now";
        var context = new OutputFormatterWriteContext(httpContext.Object, writerFactory, response.GetType(), response);

        await formatter.WriteResponseBodyAsync(context, selectedEncoding);

        writer.ToString().Should().Be(response);
    }
}
