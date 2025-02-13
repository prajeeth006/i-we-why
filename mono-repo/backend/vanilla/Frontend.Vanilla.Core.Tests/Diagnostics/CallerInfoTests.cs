using System;
using FluentAssertions;
using Frontend.Vanilla.Core.Diagnostics;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Diagnostics;

public sealed class CallerInfoTests
{
    [Fact]
    public void ShouldResolveCallerInfo()
    {
        var info = CallerInfo.Get();
        info.Should().StartWith($"{Environment.NewLine}BEGIN CALLER STACK TRACE{Environment.NewLine}")
            .And.EndWith($"{Environment.NewLine}END CALLER STACK TRACE{Environment.NewLine}{Environment.NewLine}")
            .And.Contain("Frontend.Vanilla.Core.Tests.Diagnostics.CallerInfoTests.ShouldResolveCallerInfo() in ")
            .And.Contain(@"CallerInfoTests.cs:line ");
    }
}
