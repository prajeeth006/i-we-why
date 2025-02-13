using Frontend.DeviceAtlas.Api.Application;

namespace Frontend.DeviceAtlas.Api;

internal class DeviceAtlasMiddleware
{
    private readonly IDeviceAtlasService deviceAtlasService;
    private readonly ILogger<DeviceAtlasMiddleware> logger;

    public DeviceAtlasMiddleware(RequestDelegate next, IDeviceAtlasService deviceAtlasService, ILogger<DeviceAtlasMiddleware> logger)
    {
        this.deviceAtlasService = deviceAtlasService;
        this.logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            context.Request.Headers.TryGetValue("x-daprops", out var daprops);
            var headers = context.Request.Headers.ToDictionary(k => k.Key, v => v.Value.ToString());
            var response = deviceAtlasService.GetDeviceProperties(headers, daprops);

            await context.Response.WriteAsJsonAsync(response, context.RequestAborted);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to provide device properties.");
            context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        }
    }
}
