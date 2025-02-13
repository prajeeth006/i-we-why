using System;
using System.Diagnostics;
using System.IO;
using System.Net.Http;
using System.Text;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.OpenTelemetry;

internal static class ActivityExtensions
{
    public static void EnrichWithHttpRequest(this Activity activity, HttpRequest httpRequest)
    {
        foreach (var (key, value) in httpRequest.Headers)
        {
            activity.AddTag($"ExtRequestHeader-{key}", value);
        }
    }

    public static void EnrichWithHttpResponse(this Activity activity, HttpResponse httpResponse)
    {
        activity.AddTag("ExtResponseStatusCode", httpResponse.StatusCode);
        foreach (var (key, value) in httpResponse.Headers)
        {
            activity.AddTag($"ExtResponseHeader-{key}", value);
        }

        if (httpResponse.ContentLength is > 0)
        {
            try
            {
                using var reader = new StreamReader(httpResponse.Body, Encoding.UTF8);
                activity.AddTag("ExtResponseBody", reader.ReadToEnd());
            }
            catch (Exception ex)
            {
                activity.AddTag("ExtResponseBodyError", ex.Message);
            }
        }
    }

    public static void EnrichWithHttpRequestMessage(this Activity activity, HttpRequestMessage httpRequestMessage)
    {
        foreach (var header in httpRequestMessage.Headers)
        {
            activity.AddTag($"ExtRequestHeader-{header.Key}", header.Value);
        }
    }

    public static void EnrichAWithHttpResponseMessage(this Activity activity, HttpResponseMessage httpResponseMessage)
    {
        activity.AddTag("ExtResponseStatusCode", ((int)httpResponseMessage.StatusCode).ToString());
        foreach (var header in httpResponseMessage.Headers)
        {
            activity.AddTag($"ExtResponseHeader-{header.Key}", header.Value);
        }

        try
        {
            using Stream contentStream = httpResponseMessage.Content.ReadAsStream();
            using StreamReader reader = new StreamReader(contentStream, Encoding.UTF8);
            string responseBody = reader.ReadToEnd();
            activity.AddTag("ExtResponseBody", responseBody);
        }
        catch (Exception ex)
        {
            activity.AddTag("ExtResponseBodyError", ex.Message);
        }
    }
}
