using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;

namespace Frontend.Host.Features.StaticFiles;

internal interface IStaticFilesPhysicalFileProvider
{
    PhysicalFileProvider? FileProvider { get; }
}

internal sealed class StaticFilesPhysicalFileProvider : IStaticFilesPhysicalFileProvider
{
    public const string ClientDist = "ClientDist";
    public PhysicalFileProvider? FileProvider { get; }

    public StaticFilesPhysicalFileProvider(IHostEnvironment hostEnvironment)
    {
        var fullPath = Path.Combine(hostEnvironment.ContentRootPath, ClientDist);
        if (Directory.Exists(fullPath))
        {
            FileProvider = new PhysicalFileProvider(fullPath);
        }
    }
}
