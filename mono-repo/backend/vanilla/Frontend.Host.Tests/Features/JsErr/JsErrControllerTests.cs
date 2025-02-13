using System.Net;
using System.Text.RegularExpressions;
using FluentAssertions;
using Frontend.Host.Features.JsErr;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Features.Diagnostics;
using Frontend.Vanilla.Features.Logging;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Host.Tests.Features.JsErr;

public class JsErrControllerTests
{
    private readonly ErrorData commonErrData;
    private readonly JsErrController controller;
    private readonly Mock<IClientIPResolver> clientIpResolver;
    private readonly GlobalJavascriptErrorHandlerConfiguration globalJavascriptErrorHandlerConfiguration;
    private readonly TestLogger<JsErrController> testLogger;

    public JsErrControllerTests()
    {
        commonErrData = new ErrorData()
        {
            cause = "error was caused by: user, intentionally",
            message = "myVariable is undefined",
            name = "some name", // firefox and ie specific
            description = "some error description",

            // NOTE: we are converting arguments array to string. So we deserialize string here.
            arguments = "arg1, arg2", // chrome specific

            stack = "some long and sophisticated stack",
            stacktrace = "some long and sophisticated stacktrace", // opera specific

            sourceURL = "http://safari/assets/jsfileName.js", // safari specific
            source = "Reference error(some variable was not defined)",

            fileName = "http://firefox/assets/jsfileName.js", // firefox specific

            line = "246", // safari specific
            number = "500", // ie specific ;-)
            lineNumber = "127", // firefox specific
            columnNumber = "1", // firefox specific
            time = "71892371298379",
            occurrences = 5,
        };

        clientIpResolver = new Mock<IClientIPResolver>();
        clientIpResolver.Setup(c => c.Resolve()).Returns(IPAddress.Parse("192.168.1.1"));
        globalJavascriptErrorHandlerConfiguration = new GlobalJavascriptErrorHandlerConfiguration
        {
            MaxErrorsPerBatch = 10,
            IsEnabled = true,
        };
        testLogger = new TestLogger<JsErrController>();

        controller = new JsErrController(clientIpResolver.Object, globalJavascriptErrorHandlerConfiguration, testLogger);
    }

    [Fact]
    public void TypeShouldMatchMetadata()
    {
        ClientLogControllerMetadata.TypeName.Should().Be(typeof(JsErrController).ToString());
    }

    [Fact]
    public void ShouldLogTraceMessage()
    {
        var result = controller.Post(new[] { new ErrorData { message = "msg", type = "Trace", time = "1576489626486" } });

        result.Should().BeOfType<OkObjectResult>();

        testLogger.Logged[0].Verify(LogLevel.Trace, ("message", "msg"), ("time", DateTimeOffset.FromUnixTimeMilliseconds(1576489626486)));
    }

    [Theory]
    [InlineData("Debug", LogLevel.Debug)]
    [InlineData("Info", LogLevel.Information)]
    [InlineData("Warn", LogLevel.Warning)]
    [InlineData("Error", LogLevel.Error)]
    public void ShouldLogMessage(string type, LogLevel expectedLogLevel)
    {
        var result = controller.Post(new[] { new ErrorData { message = "msg", type = type } });

        result.Should().BeOfType<OkObjectResult>();

        testLogger.Logged[0].Verify(expectedLogLevel);
    }

    [Fact]
    public void ShouldLogError()
    {
        var errs = ErrorData.Deserealize(Errs.FromData(commonErrData).ToChrome());
        var result = controller.Post(errs.ToArray());

        result.Should().BeOfType<OkObjectResult>();

        testLogger.Logged[0].Verify(LogLevel.Error, ("@error", errs[0]), ("ipAddress", "192.168.1.1"));
    }

    [Fact]
    public void ShouldNotLogIfLoggingIsNotEnabled()
    {
        globalJavascriptErrorHandlerConfiguration.IsEnabled = false;
        var errs = ErrorData.Deserealize(Errs.FromData(commonErrData).ToChrome());
        var result = controller.Post(errs.ToArray());

        result.Should().BeOfType<OkObjectResult>();

        testLogger.VerifyNothingLogged();
    }

    [Fact]
    public void ShouldNotLogDisabledLevels()
    {
        globalJavascriptErrorHandlerConfiguration.DisableLogLevels = new Dictionary<string, Regex?>
        {
            { "Error", null },
            { "Debug", new Regex("msg") },
        };
        var errs = new[]
        {
            new ErrorData { message = "msg", type = "Error" },
            new ErrorData { message = "Debug test", type = "Debug" },
            new ErrorData { message = "msg Debug", type = "Debug" },
            new ErrorData { message = "msg warn", type = "Warn" },
        };
        var result = controller.Post(errs);

        result.Should().BeOfType<OkObjectResult>();

        testLogger.Logged.Count.Should().Be(2);
        testLogger.Logged[0].Verify(LogLevel.Debug);
        testLogger.Logged[1].Verify(LogLevel.Warning);
    }

    [Fact]
    public void ShouldNotLogMaximumOfConfiguredEntries()
    {
        var result = controller.Post(new[]
        {
            new ErrorData { message = "msg", type = "Error" },
            new ErrorData { message = "msg", type = "Error" },
            new ErrorData { message = "msg", type = "Error" },
            new ErrorData { message = "msg", type = "Error" },
            new ErrorData { message = "msg", type = "Error" },
            new ErrorData { message = "msg", type = "Error" },
            new ErrorData { message = "msg", type = "Error" },
            new ErrorData { message = "msg", type = "Error" },
            new ErrorData { message = "msg", type = "Error" },
            new ErrorData { message = "msg", type = "Error" },
            new ErrorData { message = "msg", type = "Error" },
            new ErrorData { message = "msg", type = "Error" },
            new ErrorData { message = "msg", type = "Error" },
            new ErrorData { message = "msg", type = "Error" },
            new ErrorData { message = "msg", type = "Error" },
            new ErrorData { message = "msg", type = "Error" },
            new ErrorData { message = "msg", type = "Error" },
            new ErrorData { message = "msg", type = "Error" },
            new ErrorData { message = "msg", type = "Error" },
            new ErrorData { message = "msg", type = "Error" },
        });

        result.Should().BeOfType<OkObjectResult>();

        testLogger.Logged.Should().HaveCount(10);
    }

    [Fact]
    public void ChromeErrorContainsCauseField()
    {
        // arrange
        var data = commonErrData;
        var errString = Errs.FromData(data).ToChrome();

        // act
        var errs = ErrorData.Deserealize(errString);

        // assert
        errs.Count.Should().Be(1);
        errs[0].message.Should().Be(data.message);
        errs[0].name.Should().Be(data.name);
        errs[0].arguments.Should().Be(data.arguments);
        errs[0].stack.Should().Be(data.stack);
        errs[0].cause.Should().Be("error was caused by: user, intentionally");
    }

    [Fact]
    public void SingleChromeErrorDeserializedProperly()
    {
        // arrange
        var data = commonErrData;
        var errString = Errs.FromData(data).ToChrome();

        // act
        var errs = ErrorData.Deserealize(errString);

        // assert
        errs.Count.Should().Be(1);
        errs[0].message.Should().Be(data.message);
        errs[0].name.Should().Be(data.name);
        errs[0].arguments.Should().Be(data.arguments);
        errs[0].stack.Should().Be(data.stack);
    }

    [Fact]
    public void SingleFirefoxErrorDeserializedProperly()
    {
        // arrange
        var data = commonErrData;
        var errString = Errs.FromData(data).ToFireFox();

        // act
        var errs = ErrorData.Deserealize(errString);

        // assert
        errs.Count.Should().Be(1);
        errs[0].message.Should().Be(data.message);
        errs[0].name.Should().Be(data.name);
        errs[0].fileName.Should().Be(data.fileName);
        errs[0].lineNumber.Should().Be(data.lineNumber);
        errs[0].columnNumber.Should().Be(data.columnNumber);
        errs[0].stack.Should().Be(data.stack);
    }

    [Fact]
    public void SingleIeErrorDeserializedProperly()
    {
        // arrange
        var data = commonErrData;
        var errString = Errs.FromData(data).ToIe();

        // act
        var errs = ErrorData.Deserealize(errString);

        // assert
        errs.Count.Should().Be(1);
        errs[0].message.Should().Be(data.message);
        errs[0].name.Should().Be(data.name);
        errs[0].description.Should().Be(data.description);
        errs[0].stack.Should().Be(data.stack);
    }

    [Fact]
    public void SingleSafariErrorDeserializedProperly()
    {
        // arrange
        var data = commonErrData;
        var errString = Errs.FromData(data).ToSafari();

        // act
        var errs = ErrorData.Deserealize(errString);

        // assert
        errs.Count.Should().Be(1);
        errs[0].message.Should().Be(data.message);
        errs[0].line.Should().Be(data.line);
        errs[0].sourceURL.Should().Be(data.sourceURL);
        errs[0].stack.Should().Be(data.stack);

        // should not be present for Safari
        errs[0].description.Should().BeEmpty();
        errs[0].name.Should().BeEmpty();
        errs[0].columnNumber.Should().BeEmpty();
        errs[0].lineNumber.Should().BeEmpty();
        errs[0].fileName.Should().BeEmpty();
    }

    [Fact]
    public void SingleOperaErrorDeserializedProperly()
    {
        // arrange
        var data = commonErrData;
        var errString = Errs.FromData(data).ToOpera();

        // act
        var errs = ErrorData.Deserealize(errString);

        // assert
        errs.Count.Should().Be(1);
        errs[0].message.Should().Be(data.message);
        errs[0].stacktrace.Should().Be(data.stacktrace);
        errs[0].stack.Should().Be(data.stack);

        // should not be present for Opera
        errs[0].description.Should().BeEmpty();
        errs[0].name.Should().BeEmpty();
        errs[0].columnNumber.Should().BeEmpty();
        errs[0].lineNumber.Should().BeEmpty();
        errs[0].fileName.Should().BeEmpty();
        errs[0].line.Should().BeEmpty();
        errs[0].sourceURL.Should().BeEmpty();
    }

    [Fact]
    public void ErrorFormattedProperlyIfAllDataExisted()
    {
        // act
        var data = commonErrData;
        var expected = ErrorData.Format(data, "127.0.0.1");

        // assert
        expected.Should().ContainAll(
            "client ip: 127.0.0.1",
            data.message,
            data.name,
            data.description,
            data.stack,
            data.stacktrace,
            data.line,
            data.lineNumber,
            data.columnNumber,
            data.number,
            data.source,
            data.sourceURL,
            data.time,
            data.arguments,
            "occurrences: 5");
    }
}
