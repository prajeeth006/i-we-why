using System;
using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.System;

public class TryObjectExtensionsTests
{
    private Mock<IFooService> service;
    private TestLogger<IFooService> log;
    private Exception testEx;

    public TryObjectExtensionsTests()
    {
        service = new Mock<IFooService>();
        log = new TestLogger<IFooService>();
        testEx = new Exception("Oups");
    }

    public interface IFooService
    {
        int GetValue();
        Task<string> GetReferenceAsync();
        Task<int> GetValueAsync();
    }

    [Fact]
    public void Try_ShouldPassInnerResult()
    {
        service.Setup(s => s.GetValue()).Returns(66);

        // Act
        var result = service.Object.Try(s => s.GetValue(), log);

        result.Should().Be(66);
        log.VerifyNothingLogged();
    }

    [Fact]
    public void Try_ShouldLogAndReturnDefault_IfValueType()
    {
        service.Setup(s => s.GetValue()).Throws(testEx);

        // Act
        var result = service.Object.Try(s => s.GetValue(), log);

        result.Should().Be(0);
        VerifyExceptionLogged();
    }

    [Fact]
    public async Task TryAsync_ShouldPassResult()
    {
        service.Setup(s => s.GetValueAsync()).ReturnsAsync(666);

        // Act
        var result = await service.Object.TryAsync(s => s.GetValueAsync(), log);

        result.Should().Be(666);
        log.VerifyNothingLogged();
    }

    [Fact]
    public async Task TryAsync_ShouldPassResult_IfReferenceType()
    {
        service.Setup(s => s.GetReferenceAsync()).ReturnsAsync("wtf");

        // Act
        var result = await service.Object.TryAsync(s => s.GetReferenceAsync(), log);

        result.Should().Be("wtf");
        log.VerifyNothingLogged();
    }

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public async Task TryAsync_ShouldLogAndPassDefault(bool throwAsync)
    {
        if (throwAsync)
            service.Setup(s => s.GetValueAsync()).ThrowsAsync(testEx);
        else
            service.Setup(s => s.GetValueAsync()).Throws(testEx);

        // Act
        var result = await service.Object.TryAsync(s => s.GetValueAsync(), log, failedResult: -66);

        result.Should().Be(-66);
        VerifyExceptionLogged();
    }

    private void VerifyExceptionLogged()
    {
        var logged = log.Logged.Single();
        logged.Verify(LogLevel.Error, testEx);
        logged.FinalMessage.Should().Be(TryObjectExtensions.LogMessage);
    }
}
