#nullable enable

using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.System;

public class TaskExtensionsTests
{
    [Fact]
    public async Task AsNullableResult_Test()
    {
        var task = Task.FromResult("abc");

        // Act
        var nullable = task.AsNullableResult();

        (await nullable).Should().Be("abc");
    }
}
