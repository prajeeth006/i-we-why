using System.Net;
using FluentAssertions;
using Frontend.Vanilla.Core.Net;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Net;

public sealed class HttpStatusCodeExtensionsTests
{
    [Theory]
    [InlineData(HttpStatusCode.OK, true)]
    [InlineData(HttpStatusCode.NoContent, true)]
    [InlineData((HttpStatusCode)299, true)]
    [InlineData(HttpStatusCode.Continue, false)]
    [InlineData(HttpStatusCode.Ambiguous, false)]
    [InlineData(HttpStatusCode.BadRequest, false)]
    [InlineData(HttpStatusCode.InternalServerError, false)]
    public void IsSuccessTest(HttpStatusCode statusCode, bool expected)
        => statusCode.IsSucccess().Should().Be(expected);

    [Theory]
    [InlineData(HttpStatusCode.Continue, HttpStatusCategory.Informational)]
    [InlineData(HttpStatusCode.SwitchingProtocols, HttpStatusCategory.Informational)]
    [InlineData(HttpStatusCode.OK, HttpStatusCategory.Success)]
    [InlineData(HttpStatusCode.Accepted, HttpStatusCategory.Success)]
    [InlineData(HttpStatusCode.Ambiguous, HttpStatusCategory.Redirection)]
    [InlineData(HttpStatusCode.MovedPermanently, HttpStatusCategory.Redirection)]
    [InlineData(HttpStatusCode.BadRequest, HttpStatusCategory.ClientError)]
    [InlineData(HttpStatusCode.Conflict, HttpStatusCategory.ClientError)]
    [InlineData(HttpStatusCode.InternalServerError, HttpStatusCategory.ServerError)]
    [InlineData(HttpStatusCode.ServiceUnavailable, HttpStatusCategory.ServerError)]
    internal void GetCategoryTest(HttpStatusCode code, HttpStatusCategory expected)
        => code.GetCategory().Should().Be(expected);
}
