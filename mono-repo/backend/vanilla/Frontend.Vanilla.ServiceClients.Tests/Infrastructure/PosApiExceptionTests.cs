using System;
using System.Collections.Generic;
using System.Net;
using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Infrastructure;

public class PosApiExceptionTests
{
    private readonly Exception innerEx = new ();

    private readonly Dictionary<string, string> values = new ()
    {
        { "Key 1", "Value 1" },
        { "Key 2", "Value 2" },
    };

    [Fact]
    public void ShouldHaveEmptyDefaults()
    {
        var target = new PosApiException(); // Act

        Verify(target,
            $"Exception of type '{typeof(PosApiException)}' was thrown.",
            httpCode: default,
            posApiCode: 0,
            posApiMessage: null,
            posApiValues: new Dictionary<string, string>());
    }

    [Fact]
    public void ShouldInitializeAllProperties()
    {
        var target = new PosApiException("Oups", innerEx, HttpStatusCode.BadRequest, 666, "PosAPI oups", values); // Act

        Verify(target, "Oups", HttpStatusCode.BadRequest, posApiCode: 666, posApiMessage: "PosAPI oups", posApiValues: values);
    }

    [Fact]
    public void ShouldCopyProperties()
    {
        var original = new PosApiException("Original", innerEx, HttpStatusCode.BadRequest, 666, "PosAPI oups", values);

        var target = new PosApiException("Oups", original); // Act

        Verify(target, "Oups", HttpStatusCode.BadRequest, posApiCode: 666, posApiMessage: "PosAPI oups", posApiValues: values);
    }

    [Fact]
    public void ShouldAllowOverridingProperties()
    {
        var original = new PosApiException("Original", innerEx, HttpStatusCode.BadRequest, 666, "PosAPI oups", values);
        var otherVals = new Dictionary<string, string> { { "Other", "Key" } };

        var target = new PosApiException("Oups", original, HttpStatusCode.Conflict, 777, "Other", otherVals); // Act

        Verify(target, "Oups", HttpStatusCode.Conflict, posApiCode: 777, posApiMessage: "Other", posApiValues: otherVals);
    }

    private static void Verify(
        PosApiException target,
        string message,
        HttpStatusCode httpCode,
        int posApiCode,
        string posApiMessage,
        Dictionary<string, string> posApiValues)
    {
        target.Message.Should().Be(message);
        target.HttpCode.Should().Be(httpCode);
        target.PosApiCode.Should().Be(posApiCode);
        target.PosApiMessage.Should().Be(posApiMessage);
        target.PosApiValues.Should().Equal(posApiValues);
    }
}
