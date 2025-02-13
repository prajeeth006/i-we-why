using System;
using System.Diagnostics;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Uri = System.Uri;

namespace Frontend.Vanilla.Diagnostics.App.Infrastructure;

public interface IVanillaApiClient
{
    Task<T> GetAsync<T>(string relativeUrl);
    Task PostAsync(string relativeUrl, object data);
    Task SendAsync(HttpMethod method, string relativeUrl, object data = null);
    Task<T> SendAsync<T>(HttpMethod method, string relativeUrl, object data = null);
}

public sealed class VanillaApiClient(string baseAddress) : IVanillaApiClient
{
    private readonly HttpClient httpClient = new () { BaseAddress = new Uri(baseAddress) };

    public Task<T> GetAsync<T>(string relativeUrl)
        => SendAsync<T>(HttpMethod.Get, relativeUrl);

    public Task PostAsync(string relativeUrl, object data)
        => SendAsync<object>(HttpMethod.Post, relativeUrl, data);

    public Task SendAsync(HttpMethod method, string relativeUrl, object data)
        => SendAsync<object>(method, relativeUrl, data);

    public async Task<T> SendAsync<T>(HttpMethod method, string relativeUrl, object data = null)
    {
        var request = new HttpRequestMessage(method, relativeUrl);

        if (data != null)
        {
            var json = JsonConvert.SerializeObject(data);
            request.Content = new StringContent(json, Encoding.UTF8, "application/json");
        }

        var start = Stopwatch.GetTimestamp();
        var response = await httpClient.SendAsync(request);
        var requestInfo = $"{request.Method} {request.RequestUri}";
        Console.WriteLine($"Network request {requestInfo} took {Stopwatch.GetElapsedTime(start).TotalMilliseconds} ms.");

        if (!response.IsSuccessStatusCode)
        {
            var dto = await DeserializeResponseAsync<ErrorDto>();

            throw new ApiException(dto?.Message ?? $"HTTP request failed: {response.StatusCode}.", response.StatusCode);
        }

        return typeof(T) != typeof(object)
            ? await DeserializeResponseAsync<T>()
            : default;

        async Task<TDto> DeserializeResponseAsync<TDto>()
        {
            var start = Stopwatch.GetTimestamp();
            var json = await response.Content.ReadAsStringAsync();
            var dto = JsonConvert.DeserializeObject<TDto>(json, new JsonSerializerSettings { DateParseHandling = DateParseHandling.None });
            Console.WriteLine($"JSON deserialization of response from {requestInfo} took {Stopwatch.GetElapsedTime(start).TotalMilliseconds} ms.");

            return dto;
        }
    }

    private class ErrorDto
    {
        public string Message { get; set; }
    }
}
