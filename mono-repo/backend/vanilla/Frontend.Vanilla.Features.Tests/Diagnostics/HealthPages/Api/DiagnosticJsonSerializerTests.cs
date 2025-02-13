using System;
using FluentAssertions;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.Diagnostics.HealthPages.Api;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Xunit;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Diagnostics.HealthPages.Api;

public class DiagnosticJsonSerializerTests
{
    [Theory, BooleanData]
    public void ShouldSerializeCorrectly(bool testBytes)
    {
        var obj = new
        {
            Value = 123,
            Day = DayOfWeek.Friday,
        };

        // Act
        var json = testBytes
            ? DiagnosticJsonSerializer.ToBytes(obj).DecodeToString()
            : DiagnosticJsonSerializer.ToDiagnosticJson(obj).ToString();

        json.Should().BeJson(@"{
                Value: 123,
                Day: 'Friday'
            }");
    }
}
