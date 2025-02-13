using System;
using System.Collections.Specialized;
using System.Linq;
using System.Web;
using FluentAssertions;
using FluentAssertions.Primitives;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Uris;

namespace Frontend.Vanilla.Testing.FluentAssertions;

internal static class UriFluentAssertions
{
    public static AndConstraint<ObjectAssertions> BeUriWithAnyQueryOrder(this ObjectAssertions assertions, string expectedUriStr)
    {
        if (expectedUriStr == null)
            return assertions.BeNull();

        var expectedUri = new Uri(expectedUriStr);
        var actualUri = assertions.Subject.Should().BeAssignableTo<Uri>().Which;

        if (!expectedUri.HasEqualComponents(actualUri, UriComponents.SchemeAndServer | UriComponents.Path))
            throw CreateError("Left parts (everything except query) of given URLs differ.");

        var expectedQs = HttpUtility.ParseQueryString(expectedUri.Query);
        var actualQs = HttpUtility.ParseQueryString(actualUri.Query);

        VerifyQueryParamNames(expectedQs, actualQs, "URL is missing some query parameters");
        VerifyQueryParamNames(actualQs, expectedQs, "URL has some unexpected query parameters");

        var diffVals = expectedQs.AllKeys
            .Where(k => expectedQs[k] != actualQs[k])
            .Select(k => $"- '{k}' is '{actualQs[k]}' but expected '{expectedQs[k]}'.")
            .Join(Environment.NewLine);

        if (diffVals.Length > 0)
            throw CreateError($"Some query parameters differ:{Environment.NewLine}{diffVals}");

        return assertions.NotBeNull();

        void VerifyQueryParamNames(NameValueCollection from, NameValueCollection to, string messagePrefix)
        {
            var diff = from.AllKeys.Except(to.AllKeys).Select(q => $"{q}={from[q]}").Join("&");

            if (diff.Length > 0)
                throw CreateError($"{messagePrefix}: {diff}");
        }

        Exception CreateError(string reason)
        {
            return FailureHelper.CreateError(reason, $"Expected URL: {expectedUriStr}", $"Actual URL: {assertions.Subject}");
        }
    }
}
